# Interactive Open Systems Course — Phase 0 Audit

**Audit date:** 2026-10-29  
**Repository:** https://github.com/reazromen/open-systems-course  
**Default branch:** main  
**Audited commit:** 8918b2234dfeb8ceb3759c0964726df8fa8daf00  
**Live site:** https://learn.reazromen.com

## Executive findings

- The repository is public, not archived, and its default branch is main. The Git tree is complete (not truncated) with **632 entries**: **304 HTML**, **241 Markdown**, **11 CSS**, **7 JavaScript**, **5 JSON**, **45 PNG**, **2 SVG**, plus directories and one placeholder.
- The canonical Open Systems Course has **180 Markdown lesson sources** in source/perspectives/ and **180 matching rendered lesson pages** in posts/open-systems-*.html. Source front matter includes a stable url matching each posts/ output URL and an explicit lesson number/title (confirmed on Lesson 1).
- The repository also includes two companion tracks: **60 System Design lessons with 60 Markdown sources under source/system_design/** and **60 Embedded Systems & IoT lesson pages with no matching Markdown source directory in the inspected checkout**. Each deployed directory has an index page. These are outside the 180-lesson count advertised by course.html but are compatibility surfaces because deployment copies them too.
- The repository contains existing JavaScript and CSS, including assets/phase1.js, phase2.js, responsive-v3.js, site.js, sitewide.js, and taxonomy-v1.js. These implement site search/navigation, network-diagram path tracing, responsive navigation, and site-wide behavior; **no Anime.js dependency, package manifest, or course build script appears in the repository tree**. The word “phase1” in an asset filename is not evidence of an interactive simulation framework.
- Live HTTP checks from the authorized Hserver environment returned **200 for 308/308 requested URLs**. Browser baseline evidence is also captured separately in docs/interactive-course-browser-baseline.md: Firefox 157.0.1, 390×844 viewport, reduced motion, real Tab navigation, BiDi console/network events, and framework browser smoke checks.
- The host deployment is a separate copy/sync step: /home/romen/private-course-preview/deploy-course.sh pulls the course-deploy repository's main, then copies course.html, assets/, static/, canonical lesson HTML, and both companion track directories into /home/romen/private-course-preview/repo/dist. The origin is served by the user-level learn-course-preview.service via serve_domain.py; the public response is behind Cloudflare Tunnel and includes X-Robots-Tag: noindex, nofollow, noarchive.

## Repository structure and source/output relationship

| Area | Observed role |
|---|---|
| source/perspectives/open-systems-NNN-*.md | Canonical Markdown source, including YAML front matter, title, date, draft flag, language, stable URL, topic/tags, excerpt, read time, and body. |
| posts/open-systems-NNN-*.html | Rendered output for each of the 180 canonical lessons. |
| course.html | Course landing/index HTML; advertises a 180-lesson course. |
| assets/*.css, assets/*.js | Shared styles, search/navigation, diagrams, and responsive behavior. |
| static/ | Static media/assets. |
| source/system_design/lesson-NN-*.md and system_design/lesson-NN.html | 60 System Design Markdown sources and 60 rendered pages plus index; no renderer script/build command found. |
| embedded_systems_iot/lesson-NN.html | 60 deployed HTML lessons plus index; no corresponding source/embedded_systems_iot Markdown source or regeneration script found in the inspected checkout. |
| README.md | Documents the static deployment and host-side copy/sync model. |

**Important pipeline distinction:** no authoritative Markdown-to-HTML renderer or reproducible build command exists in this repository. The host deploy-course.sh only copies pre-rendered output. The separate reazromen.com CMS renderer is not this course's renderer and must not be run against shared dist/. System Design Markdown sources are present but their renderer is not; the Embedded Systems & IoT source itself was not found. The safe workflow and exact deployment copy process are documented in docs/interactive-course-build-and-source-of-truth.md.

## Existing interaction inventory

- assets/phase1.js: lazy-loads Pagefind for search/quick navigation; this is not a generic simulator lifecycle API.
- assets/phase2.js: attaches pointer/focus/click handlers to .network-diagram and .network-node elements to trace a diagram path. Existing behavior must be preserved and regression-tested.
- assets/responsive-v3.js: responsive navigation behavior.
- assets/site.js and assets/sitewide.js: existing site-level UI behavior.
- Shared CSS includes responsive and phase-specific styles. Existing page HTML includes search/theme controls and scripts. The baseline browser run captured console/network events on the course index and Lesson 107; no console events were observed, and no existing [data-interaction] roots were found on Lesson 107.
- No package.json, Anime.js bundle/reference, Web Worker script, or build/test configuration was found in the tracked repository tree. Prefer dependency-free vanilla JavaScript + semantic HTML/CSS/SVG unless an evidence-backed need for Anime.js emerges.

## Live-site evidence

At the time of the check, HTTPS root returned 200 with HTML content, cache-control: no-store, and X-Robots-Tag: noindex, nofollow, noarchive. A parallel HTTP probe checked 308 URLs and found zero non-200 responses. Sample canonical URLs include /posts/open-systems-001-what-is-a-computer-really.html and /posts/open-systems-107-caches-faster-copies-stale-state.html; companion samples include /system_design/lesson-01.html and /embedded_systems_iot/lesson-01.html.

A real Firefox 157.0.1 headless browser baseline was captured through geckodriver/WebDriver with BiDi console/network event subscription. Tested desktop at 1366×682 and mobile-emulated viewport at 390×844; reduced-motion emulation was confirmed. No console events were observed during the tested page loads. The favicon request returned 404. The body overflowed the 390 px viewport (405 px on course index, 418 px on Lesson 107). Real Tab actions moved focus through course links; framework focus-visible behavior was separately verified in a local browser fixture. Detailed evidence and limitations are in docs/interactive-course-browser-baseline.md.

## Baseline size and integrity notes

- GitHub tree reports 632 tracked entries; the canonical course source/output inventory is 180/180.
- The course deployment source directory contains approximately 26 MB total; the current generated site dist/ directory contains approximately 53 MB, including unrelated main-site content. Do not replace or clean this directory wholesale.
- The 180 canonical rendered lesson HTML files total 2,357,109 bytes in the deployment source (mean 13,095 bytes per lesson). This is repository-file size, not compressed transfer size.
- The local host's main website checkout has thousands of unrelated dirty paths. Do not use that checkout for course changes or run broad Git cleanup commands there. Keep all Phase 0 documentation changes isolated to the open-systems-course repository and a dedicated branch.
- Existing URLs and all 180 canonical output names must remain unchanged. Companion-track URLs and shared assets must also remain compatible.

## Risks and blockers

1. **Renderer provenance gap — high:** the canonical source/output relationship is visible, but the exact renderer command/version is not in this repo. The deploy script copies rendered HTML and does not build it.
2. **Companion source gap — medium:** System Design has 60 Markdown sources but no verified renderer. Embedded Systems & IoT has 60 HTML pages but no discoverable Markdown source or regeneration workflow. Do not regenerate or edit these tracks until their build provenance is established.
3. **Existing diagram behavior — medium:** phase2.js already binds events to network diagrams. New initialization must avoid duplicate listeners and preserve its path-tracing semantics.
4. **Deployment coupling — high:** host deployment copies a set of directories into a shared dist/ served by serve_domain.py; accidental sync or cleanup could affect other course tracks or site assets.
5. **Mobile overflow — medium:** body scroll width exceeded a 390 px viewport on the course index and Lesson 107; investigate separately from the interaction framework.
6. **Generated-output integrity — high:** canonical lesson source files and HTML outputs coexist without a reproducible renderer. Keep framework assets opt-in until a renderer and source/output integrity checks exist.
7. **Indexing policy — intentional but verify:** current response sends noindex headers. Preserve unless explicitly changed by the site owner.

## Phase 0 exit assessment

**Inventory and browser baseline complete; content-generation gates remain open.** The exact result of the renderer investigation is that no authoritative course renderer/build command exists in the repository; the safe deployment copy process and source gaps are now documented. Browser evidence includes console/network events, real Tab actions, reduced motion, and a 390×844 viewport. Phase 1 is limited to opt-in JS/CSS and tests; Phase 2/content rollout remains gated on a reproducible renderer and Embedded Systems & IoT source provenance. The proposed lesson mapping is in docs/interactive-course-lesson-mapping.md.
