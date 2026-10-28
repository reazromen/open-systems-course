# Open Systems Course

Standalone public static deployment for `https://learn.reazromen.com`.

- `course.html` is the course index.
- `posts/open-systems-*.html` contains the 180 rendered lessons.
- `source/perspectives/` contains the Markdown source of each lesson.
- `assets/` and `static/` contain the page styles and media needed by the course.

The live hostname is served by the Hserver Python HTTP process behind Cloudflare Tunnel. A host-side sync script pulls this repository and copies only the course output into the live site's `dist/`; unrelated main-site files are not touched. The pages intentionally send `X-Robots-Tag: noindex, nofollow, noarchive`.

## Interactive system-design prototypes

Fourteen deterministic learning models are available at `prototypes/interactive-system-design.html` when serving the repository root: load balancing, cache/TTL, queue/worker backpressure, retry/idempotency, SIP call flow, data-structure costs, graph/tree traversal, OS/file-I/O timelines, CPU scheduling, virtual-memory translation, race conditions/locks, network packet paths, DNS/DHCP/NAT/TLS/proxy timelines, and CAP/quorum. Sixty-five lesson source/output pairs link to this companion lab (041–060, 071–100, 107, 108, 113, 131, 132, 134, 135, 139, 140, 143, 145, 146, 147, 149, 152) on the interactive-course branch. These are companion links, not inline embeds. The branch is not a production deployment.

Install the pinned renderer dependencies with `python3 -m pip install -r requirements-renderer.txt`. Check source/output text integrity with `python3 tools/render_course.py --check`; all 180 canonical source/output pairs now pass. The audit initially found drift in Lessons 035 and 041; the source formatting/examples were reconciled and those outputs regenerated with the explicit known-drift override. The reviewed batches can be checked with `python3 tools/render_course.py --check --lesson 41 --lesson 42 --lesson 43 --lesson 44 --lesson 45 --lesson 46 --lesson 47 --lesson 48 --lesson 49 --lesson 50 --lesson 51 --lesson 52 --lesson 53 --lesson 54 --lesson 55 --lesson 56 --lesson 57 --lesson 58 --lesson 59 --lesson 60 --lesson 71 --lesson 72 --lesson 73 --lesson 74 --lesson 75 --lesson 76 --lesson 77 --lesson 78 --lesson 79 --lesson 80 --lesson 81 --lesson 82 --lesson 83 --lesson 84 --lesson 85 --lesson 86 --lesson 87 --lesson 88 --lesson 89 --lesson 90 --lesson 91 --lesson 92 --lesson 93 --lesson 94 --lesson 95 --lesson 96 --lesson 97 --lesson 98 --lesson 99 --lesson 100 --lesson 107 --lesson 108 --lesson 113 --lesson 131 --lesson 132 --lesson 134 --lesson 135 --lesson 139 --lesson 140 --lesson 143 --lesson 145 --lesson 146 --lesson 147 --lesson 149 --lesson 152`.

Run the local automated checks with `tools/test_interactive_course.sh`. For a real Firefox smoke test, start geckodriver on `127.0.0.1:4444` and run `RUN_BROWSER=1 tools/test_interactive_course.sh`. See `docs/interactive-course-build-and-source-of-truth.md`, `docs/interactive-course-prototypes.md`, and `docs/interactive-course-component-catalog.md` for limits and the exact process.
