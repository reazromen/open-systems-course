#!/usr/bin/env python3
"""Render selected Open Systems Markdown bodies into their existing HTML page templates.

The template wrapper remains authoritative for layout and shared assets. This script only
regenerates the article .prose body; front matter/template metadata are deliberately not
rewritten. By default --write requires explicit lesson numbers to prevent mass changes.
"""
from __future__ import annotations
from html.parser import HTMLParser
from pathlib import Path
import argparse
import re
import sys
import subprocess
from markdown_it import MarkdownIt
import yaml

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "source" / "perspectives"
MD = MarkdownIt("commonmark", {"html": False, "linkify": False, "typographer": False})
RECONCILABLE_LEGACY_DRIFT_LESSONS = {35, 41}

class ProseParser(HTMLParser):
    def __init__(self, html: str, page: bool = True):
        super().__init__(convert_charrefs=True)
        self.page = page
        self.offsets = [0]
        for line in html.splitlines(keepends=True):
            self.offsets.append(self.offsets[-1] + len(line))
        self.active = not page
        self.depth = 0
        self.start = None
        self.end = None
        self.text_parts = []
    def absolute(self):
        line, col = self.getpos()
        return self.offsets[line - 1] + col
    def handle_starttag(self, tag, attrs):
        if not self.active and tag == "div" and "prose" in dict(attrs).get("class", "").split():
            self.active = True
            self.depth = 1
            self.start = self.absolute() + len(self.get_starttag_text())
            return
        if self.page and self.active and tag == "div":
            self.depth += 1
    def handle_endtag(self, tag):
        if self.page and self.active and tag == "div":
            self.depth -= 1
            if self.depth == 0:
                self.end = self.absolute()
                self.active = False
    def handle_data(self, data):
        if self.active and data.strip():
            self.text_parts.append(" ".join(data.split()))

def split_source_text(raw: str, path: Path):
    if not raw.startswith("---\n"):
        raise ValueError(f"{path}: missing YAML front matter")
    _, front, body = raw.split("---", 2)
    meta = yaml.safe_load(front) or {}
    if not isinstance(meta, dict) or not str(meta.get("url", "")).startswith("/posts/"):
        raise ValueError(f"{path}: missing canonical /posts/ URL in front matter")
    return meta, body.strip()

def split_source(path: Path):
    return split_source_text(path.read_text(encoding="utf-8"), path)

def source_paths():
    return sorted(SOURCE.glob("open-systems-*.md"))

def page_for(path: Path):
    meta, body = split_source(path)
    return meta, body, ROOT / meta["url"].lstrip("/")

def normalized_prose(html: str, is_page: bool):
    if is_page:
        # Historical output left tag names as visible text after some code blocks.
        html = html.replace("</pre>pre", "</pre>").replace("</code>code", "</code>")
    parser = ProseParser(html, page=is_page)
    parser.feed(html)
    if is_page and (parser.start is None or parser.end is None):
        raise ValueError("could not locate the article .prose container")
    return " ".join(parser.text_parts)

def render_body(body: str):
    return MD.render(body)

def check_one(path: Path):
    meta, body, output = page_for(path)
    if not output.exists():
        return False, f"{path.name}: missing output {output.relative_to(ROOT)}"
    current = output.read_text(encoding="utf-8")
    actual_text = normalized_prose(current, True)
    expected_text = normalized_prose(render_body(body), False)
    if actual_text != expected_text:
        return False, f"{path.name}: source/output text drift (source URL {meta['url']})"
    return True, f"{path.name}: source and output text agree"

def render_one(path: Path, reconcile_known_drift: bool = False):
    meta, body, output = page_for(path)
    if not output.exists():
        raise ValueError(f"{path.name}: cannot render without existing HTML template")
    current = output.read_text(encoding="utf-8")
    expected = render_body(body)
    current_text = normalized_prose(current, True)
    expected_text = normalized_prose(expected, False)
    if current_text != expected_text:
        number_match = re.search(r"open-systems-(\d+)-", path.name)
        number = int(number_match.group(1)) if number_match else -1
        if reconcile_known_drift and number in RECONCILABLE_LEGACY_DRIFT_LESSONS:
            print(f"RECONCILING explicitly reviewed legacy drift in Lesson {number:03d}", file=sys.stderr)
        else:
            # Permit an intentional source edit only when the existing HTML exactly matches
            # the committed source version. This prevents overwriting unexplained output drift.
            try:
                baseline = subprocess.run(
                    ["git", "show", f"HEAD:{path.relative_to(ROOT).as_posix()}"],
                    cwd=ROOT, check=True, capture_output=True, text=True, encoding="utf-8"
                ).stdout
                _, baseline_body = split_source_text(baseline, path)
                baseline_text = normalized_prose(render_body(baseline_body), False)
            except Exception as exc:
                raise ValueError(f"{path.name}: cannot verify source baseline: {exc}") from exc
            if current_text != baseline_text:
                raise ValueError(f"{path.name}: source/output text drift; refusing to overwrite")
    parser = ProseParser(current)
    parser.feed(current)
    if parser.start is None or parser.end is None:
        raise ValueError(f"{path.name}: .prose wrapper not found")
    output.write_text(current[:parser.start] + expected + current[parser.end:], encoding="utf-8")
    return output

def main():
    p = argparse.ArgumentParser(description=__doc__)
    mode = p.add_mutually_exclusive_group(required=True)
    mode.add_argument("--check", action="store_true", help="check source/output text consistency without writing")
    mode.add_argument("--write", action="store_true", help="render and update explicitly selected lesson outputs")
    p.add_argument("--lesson", action="append", type=int, help="lesson number to check/render; repeatable")
    p.add_argument("--all", action="store_true", help="explicitly select every lesson for --write")
    p.add_argument("--reconcile-known-drift", action="store_true", help="allow overwriting only explicitly selected historical drift lessons 035/041 after reviewing source changes")
    args = p.parse_args()
    paths = source_paths()
    if args.lesson:
        selected = set(args.lesson)
        paths = [x for x in paths if re.search(r"open-systems-(\d+)-", x.name) and int(re.search(r"open-systems-(\d+)-", x.name).group(1)) in selected]
        found = {int(re.search(r"open-systems-(\d+)-", x.name).group(1)) for x in paths}
        if selected - found:
            p.error("lesson source not found: " + ", ".join(map(str, sorted(selected - found))))
    elif args.write and not args.all:
        p.error("--write requires one or more --lesson values; use --all only after reviewing a full diff")
    if args.reconcile_known_drift and (not args.write or not args.lesson or args.all or any(n not in RECONCILABLE_LEGACY_DRIFT_LESSONS for n in args.lesson)):
        p.error("--reconcile-known-drift requires --write and explicit --lesson 35 and/or --lesson 41; --all is not allowed")
    failures = 0
    if args.check:
        for path in paths:
            ok, message = check_one(path)
            print(("OK   " if ok else "DRIFT ") + message)
            failures += not ok
        print(f"Checked {len(paths)} source/output pairs; {failures} drift finding(s).")
        return 1 if failures else 0
    for path in paths:
        try:
            out = render_one(path, reconcile_known_drift=args.reconcile_known_drift)
            print("RENDERED " + str(out.relative_to(ROOT)))
        except Exception as exc:
            print("ERROR " + str(exc), file=sys.stderr)
            failures += 1
    return 1 if failures else 0

if __name__ == "__main__":
    raise SystemExit(main())
