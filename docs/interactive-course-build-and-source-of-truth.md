# Course Source, Renderer and Deployment Contract

**Investigated:** 2026-10-29

## Open Systems Course — 180 lessons

- Authoring source: source/perspectives/open-systems-NNN-*.md.
- Published HTML: posts/open-systems-NNN-*.html.
- course.html is the course index. Markdown front matter includes the stable output URL and lesson title; source and HTML are both tracked in Git.

**Renderer finding:** no Markdown-to-HTML renderer or build command is present in this repository. The repository workflow validates course files but does not regenerate HTML. The sibling /home/romen/private-course-preview/repo/cms/build_content.py belongs to the separate reazromen.com CMS and reads that site's content/ and templates. It is not the course renderer and must not be run against the shared dist/.

Current safe process: edit the Markdown source, produce and review the corresponding rendered HTML artifact, commit both, then deploy the committed HTML. There is no version-pinned reproducible renderer command today; do not imply Markdown edits automatically update live HTML or run an unverified renderer over the lesson set. Renderer provenance is a reproducibility gap, now explicitly documented.

## System Design — 60 lessons

- Markdown sources: source/system_design/lesson-NN-*.md (60).
- Rendered pages: system_design/lesson-NN.html (60), plus system_design/index.html.
- No renderer/build script was found. Deployment copies pre-rendered HTML. Treat Markdown as content authority, but do not regenerate until a renderer/template is tested against existing pages.

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

## Phase 1 implication

The framework is plain JS/CSS and needs no Markdown rendering. Its assets are opt-in and do not change lesson HTML. Before course-wide content changes, establish a pinned renderer plus source/output validation. Recover or formally migrate the IoT source before editing that track.
