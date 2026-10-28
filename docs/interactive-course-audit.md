# Interactive Open Systems Course — Phase 0 Audit

**Audit date:** 2026-10-29  
**Repository:** https://github.com/reazromen/open-systems-course  
**Default branch:** main  
**Audited commit:** 8918b2234dfeb8ceb3759c0964726df8fa8daf00  
**Live site:** https://learn.reazromen.com

## Executive findings

- The repository is public, not archived, and its default branch is main. The Git tree is complete (not truncated) with **632 entries**: **304 HTML**, **241 Markdown**, **11 CSS**, **7 JavaScript**, **5 JSON**, **45 PNG**, **2 SVG**, plus directories and one placeholder.
- The canonical Open Systems Course has **180 Markdown lesson sources** in source/perspectives/ and **180 matching rendered lesson pages** in posts/open-systems-*.html. Source front matter includes a stable url matching each posts/ output URL and an explicit lesson number/title (confirmed on Lesson 1).
- The repository also includes two companion HTML-only tracks: **60 System Design lesson pages** and **60 Embedded Systems & IoT lesson pages**. Each directory also has an index page. These are not part of the 180-lesson count advertised by course.html, but must be treated as compatibility surfaces because the deployment copies them too.
- The repository contains existing JavaScript and CSS, including assets/phase1.js, phase2.js, responsive-v3.js, site.js, sitewide.js, and taxonomy-v1.js. These implement site search/navigation, network-diagram path tracing, responsive navigation, and site-wide behavior; **no Anime.js dependency, package manifest, or course build script appears in the repository tree**. The word “phase1” in an asset filename is not evidence of an interactive simulation framework.
- Live HTTP checks from the authorized Hserver environment returned **200 for 308/308 requested URLs**: root, course.html, 180 canonical lesson URLs, 60 System Design lessons, 60 Embedded Systems & IoT lessons, and six shared assets. This is an HTTP availability check, not a browser-console, keyboard, or visual regression test.
- The host deployment is a separate copy/sync step: /home/romen/private-course-preview/deploy-course.sh pulls the course-deploy repository's main, then copies course.html, assets/, static/, canonical lesson HTML, and both companion track directories into /home/romen/private-course-preview/repo/dist. The origin is served by the user-level learn-course-preview.service via serve_domain.py; the public response is behind Cloudflare Tunnel and includes X-Robots-Tag: noindex, nofollow, noarchive.

## Repository structure and source/output relationship

| Area | Observed role |
|---|---|
| source/perspectives/open-systems-NNN-*.md | Canonical Markdown source, including YAML front matter, title, date, draft flag, language, stable URL, topic/tags, excerpt, read time, and body. |
| posts/open-systems-NNN-*.html | Rendered output for each of the 180 canonical lessons. |
| course.html | Course landing/index HTML; advertises a 180-lesson course. |
| assets/*.css, assets/*.js | Shared styles, search/navigation, diagrams, and responsive behavior. |
| static/ | Static media/assets. |
| system_design/lesson-NN.html | 60 additional rendered lessons plus index; no Markdown source in this repository tree. |
| embedded_systems_iot/lesson-NN.html | 60 additional rendered lessons plus index; no Markdown source in this repository tree. |
| README.md | Documents the static deployment and host-side copy/sync model. |

**Important pipeline distinction:** the repo README documents source Markdown and rendered HTML, but no Markdown-to-HTML build command/script is present in this repository tree. The host's deploy-course.sh only copies already-rendered output; it does not regenerate lesson HTML from Markdown. Therefore, source editing alone cannot be assumed to update the live page. Before Phase 1, identify and document the authoritative renderer/build process for the canonical 180 lessons (including dependency versions and exact invocation) and the separate authoring origin for the two HTML-only companion tracks.

## Existing interaction inventory

- assets/phase1.js: lazy-loads Pagefind for search/quick navigation; this is not a generic simulator lifecycle API.
- assets/phase2.js: attaches pointer/focus/click handlers to .network-diagram and .network-node elements to trace a diagram path. Existing behavior must be preserved and regression-tested.
- assets/responsive-v3.js: responsive navigation behavior.
- assets/site.js and assets/sitewide.js: existing site-level UI behavior.
- Shared CSS includes responsive and phase-specific styles. Existing page HTML includes search/theme controls and scripts. A repository-wide interactive-component marker inventory and runtime console capture remain to be run in Phase 1 QA; inspected representative lessons showed no obvious load-balancing/cache/CAP simulator markup.
- No package.json, Anime.js bundle/reference, Web Worker script, or build/test configuration was found in the tracked repository tree. Prefer dependency-free vanilla JavaScript + semantic HTML/CSS/SVG unless an evidence-backed need for Anime.js emerges.

## Live-site evidence

At the time of the check, HTTPS root returned 200 with HTML content, cache-control: no-store, and X-Robots-Tag: noindex, nofollow, noarchive. A parallel HTTP probe checked 308 URLs and found zero non-200 responses. Sample canonical URLs include /posts/open-systems-001-what-is-a-computer-really.html and /posts/open-systems-107-caches-faster-copies-stale-state.html; companion samples include /system_design/lesson-01.html and /embedded_systems_iot/lesson-01.html.

The web search/fetch integration could not render the live site directly; live validation was therefore performed using curl and Python's HTTP client on Hserver. No real browser console or mobile visual inspection was available in Phase 0, so these checks remain open rather than being reported as passed.

## Baseline size and integrity notes

- GitHub tree reports 632 tracked entries; the canonical course source/output inventory is 180/180.
- The course deployment source directory contains approximately 26 MB total; the current generated site dist/ directory contains approximately 53 MB, including unrelated main-site content. Do not replace or clean this directory wholesale.
- The 180 canonical rendered lesson HTML files total 2,357,109 bytes in the deployment source (mean 13,095 bytes per lesson). This is repository-file size, not compressed transfer size.
- The local host's main website checkout has thousands of unrelated dirty paths. Do not use that checkout for course changes or run broad Git cleanup commands there. Keep all Phase 0 documentation changes isolated to the open-systems-course repository and a dedicated branch.
- Existing URLs and all 180 canonical output names must remain unchanged. Companion-track URLs and shared assets must also remain compatible.

## Risks and blockers

1. **Renderer provenance gap — high:** the canonical source/output relationship is visible, but the exact renderer command/version is not in this repo. The deploy script copies rendered HTML and does not build it.
2. **Companion source gap — medium:** the 60 System Design and 60 Embedded Systems & IoT lesson pages are HTML-only in this repository tree; ownership and regeneration source need to be identified before touching them.
3. **Existing diagram behavior — medium:** phase2.js already binds events to network diagrams. New initialization must avoid duplicate listeners and preserve its path-tracing semantics.
4. **Deployment coupling — high:** host deployment copies a set of directories into a shared dist/ served by serve_domain.py; accidental sync or cleanup could affect other course tracks or site assets.
5. **No browser baseline — medium:** HTTP availability is verified, but console, reduced-motion, keyboard, and responsive screenshot baselines are not yet captured.
6. **Generated-output integrity — high:** canonical lesson source files and HTML outputs coexist. Any new shared component must be added through the correct build/render pipeline and must not be overwritten by a future render.
7. **Indexing policy — intentional but verify:** current response sends noindex headers. Preserve unless explicitly changed by the site owner.

## Phase 0 exit assessment

**Partially met; do not start course-wide implementation yet.** Repository inventory, source/output mapping for the canonical 180 lessons, current assets, deployment copy behavior, and live HTTP availability are established. The remaining blocker is identifying the exact renderer/build process and obtaining browser-level baseline evidence. The proposed lesson mapping is in docs/interactive-course-lesson-mapping.md.
