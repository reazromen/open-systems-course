import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))
import render_course

class RendererPilotTests(unittest.TestCase):
    def test_sixty_five_pilot_lessons_have_matching_source_and_output_text(self):
        for number in (41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 107, 108, 113, 131, 132, 134, 135, 139, 140, 143, 145, 146, 147, 149, 152):
            path = next((ROOT / "source/perspectives").glob(f"open-systems-{number:03d}-*.md"))
            ok, message = render_course.check_one(path)
            self.assertTrue(ok, message)

    def test_full_canonical_corpus_has_no_source_output_text_drift(self):
        failures = []
        for path in render_course.source_paths():
            ok, message = render_course.check_one(path)
            if not ok:
                failures.append(message)
        self.assertEqual(failures, [])

    def test_every_canonical_source_has_an_existing_stable_output(self):
        paths = render_course.source_paths()
        self.assertEqual(len(paths), 180)
        urls = set()
        for path in paths:
            meta, body, output = render_course.page_for(path)
            self.assertTrue(output.is_file(), f"Missing output for {path.name}")
            self.assertTrue(meta["url"].startswith("/posts/open-systems-"))
            self.assertNotIn(meta["url"], urls, f"Duplicate URL {meta['url']}")
            urls.add(meta["url"])

if __name__ == "__main__":
    unittest.main()
