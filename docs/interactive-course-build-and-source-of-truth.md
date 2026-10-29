# Course Source, Renderer and Deployment Contract

**Investigated:** 2026-10-29

## Open Systems Course — 180 lessons

- Authoring source: source/perspectives/open-systems-NNN-*.md.
- Published HTML: posts/open-systems-NNN-*.html.
- course.html is the course index. Markdown front matter includes the stable output URL and lesson title; source and HTML are both tracked in Git.

**Original renderer finding:** no Markdown-to-HTML renderer or build command was present in the audited repository. The sibling `/home/romen/private-course-preview/repo/cms/build_content.py` belongs to the separate reazromen.com CMS and must not be used to render this course or run against shared `dist/`.

**New controlled renderer pilot (this branch):** `tools/render_course.py` uses pinned `markdown-it-py==3.0.0` and `PyYAML==6.0.3` to regenerate the `.prose` body inside an existing HTML template. It deliberately does not rebuild page metadata or create new page templates. Install with `python3 -m pip install -r requirements-renderer.txt`. Check the full corpus with `python3 tools/render_course.py --check`; render selected pages only with `python3 tools/render_course.py --write --lesson 107 --lesson 143 --lesson 147`. The write mode refuses unexplained output drift and only falls back to the committed source baseline when that baseline exactly matches the current rendered body. Never use `--all` without reviewing a complete output diff.

The initial full-corpus check found **two source/output discrepancies**. Lesson 035 had a list that CommonMark interpreted differently because the source omitted a blank line after the label; the Markdown was corrected to make the list explicit. Lesson 041 had generic repeated `array` examples in source while the output showed indexed examples; the source was corrected to match the intended `array[0]`–`array[3]` explanation. Both outputs were regenerated with the explicit `--reconcile-known-drift` flag after reviewing those two source changes. The current `python3 tools/render_course.py --check` reports **180 source/output pairs checked, 0 drift findings**. This is a newly introduced reproducible body renderer, not evidence that the historical renderer has been recovered.

## System Design — 60 lessons

- Markdown sources: source/system_design/lesson-NN-*.md (60).
- Rendered pages: system_design/lesson-NN.html (60), plus system_design/index.html.
- The original checkout had no renderer/build script. This branch adds a pinned body-only renderer and now verifies 180/180 canonical Open Systems source/output pairs. Deployment still copies pre-rendered HTML; the separate System Design and Embedded Systems & IoT tracks remain unresolved.

## Embedded Systems & IoT — 60 lessons

- Published pages: embedded_systems_iot/lesson-NN.html (60), plus index and README.
- No source/embedded_systems_iot directory or Markdown lesson sources exist in the inspected repository checkout; no build script or external authoring origin was identified in the inspected host deployment tree.
- HTML is the only discoverable source of truth. Do not regenerate from memory or reverse-convert HTML. Preserve these files until the original authoring source is recovered.

## Exact deployment process

Host script: /home/romen/private-course-preview/deploy-course.sh.

1. Takes a non-blocking lock at /tmp/open-systems-course-deploy.lock.
2. Changes directory to /home/romen/private-course-preview/course-deploy.
3. Runs git pull --ff-only origin main.
4. Ensures dist/assets, dist/static, dist/posts, dist/system_design, and dist/embedded_systems_iot exist.
5. Copies course.html; synchronizes assets/ and static/; copies posts/open-systems-*.html; synchronizes both companion HTML directories.
6. Logs the deployed commit and timestamp to deploy-course.log.

It does not render Markdown, run tests, delete old output, or replace shared dist/ wholesale. The site is served by learn-course-preview.service through serve_domain.py and exposed through Cloudflare Tunnel. Preserve X-Robots-Tag: noindex, nofollow, noarchive.

## Phase 1–2 implications

The framework is plain JS/CSS and does not require Markdown rendering. The new renderer safely updates selected Open Systems lesson bodies, and the full 180-page text-integrity check now passes with zero drift. System Design has 60 Markdown sources but still has no verified template/build workflow. Embedded Systems & IoT has no discoverable Markdown source. Do not regenerate those tracks or run a broad deployment until their provenance and integrity checks are resolved.
