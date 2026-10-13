# Open Systems Course

Standalone public static deployment for `https://learn.reazromen.com`.

- `course.html` is the course index.
- `posts/open-systems-*.html` contains the 180 rendered lessons.
- `source/perspectives/` contains the Markdown source of each lesson.
- `assets/` and `static/` contain the page styles and media needed by the course.

The live hostname is served by the Hserver Python HTTP process behind Cloudflare Tunnel. A host-side sync script pulls this repository and copies only the course output into the live site's `dist/`; unrelated main-site files are not touched. The pages intentionally send `X-Robots-Tag: noindex, nofollow, noarchive`.
