#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

echo "== JavaScript unit tests =="
node --test tests/interactive-course.test.cjs tests/interactive-simulations.test.cjs

echo "== Python renderer integrity tests =="
python3 -m unittest tests/test_render_course.py -v

echo "== JavaScript syntax =="
node --check assets/interactive-course.js
node --check assets/interactive-simulations.js
node --check assets/interactive-prototypes.js
node --check tests/interactive-course-browser-smoke.cjs

echo "== Pilot source/output checks =="
python3 tools/render_course.py --check --lesson 41 --lesson 42 --lesson 43 --lesson 44 --lesson 45 --lesson 46 --lesson 47 --lesson 48 --lesson 49 --lesson 50 --lesson 51 --lesson 52 --lesson 53 --lesson 54 --lesson 55 --lesson 56 --lesson 57 --lesson 58 --lesson 59 --lesson 60 --lesson 71 --lesson 72 --lesson 73 --lesson 74 --lesson 75 --lesson 76 --lesson 77 --lesson 78 --lesson 79 --lesson 80 --lesson 81 --lesson 82 --lesson 83 --lesson 84 --lesson 85 --lesson 86 --lesson 87 --lesson 88 --lesson 89 --lesson 90 --lesson 91 --lesson 92 --lesson 93 --lesson 94 --lesson 95 --lesson 96 --lesson 97 --lesson 98 --lesson 99 --lesson 100 --lesson 107 --lesson 108 --lesson 113 --lesson 131 --lesson 132 --lesson 134 --lesson 135 --lesson 139 --lesson 140 --lesson 143 --lesson 145 --lesson 146 --lesson 147 --lesson 149 --lesson 152

echo "== Patch whitespace =="
git diff --check

if [[ "$(printenv RUN_BROWSER || true)" == "1" ]]; then
  echo "== Firefox browser smoke =="
  node tests/interactive-course-browser-smoke.cjs
else
  echo "Browser smoke skipped. Set RUN_BROWSER=1; requires Firefox + geckodriver at :4444."
fi

echo "All requested local checks passed."
