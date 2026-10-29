# Interactive Course Roadmap

**Status:** Phase 2 prototypes and a pinned, body-only renderer pilot are implemented and tested. Sixty-five lesson source/output pairs now link to the standalone lab; no live production output has been deployed. The full 180-lesson source/output text-integrity check now passes.
**Baseline commit:** 8918b2234dfeb8ceb3759c0964726df8fa8daf00  
**Rule:** Keep original lesson content and URLs intact. Add interactions as progressive enhancements; the lesson must remain useful without JavaScript or animation.

## Phase 0 — Audit and implementation plan

**Findings:** 180 Open Systems Markdown sources map to 180 rendered pages. System Design also has 60 Markdown sources plus 60 rendered pages; Embedded Systems & IoT has 60 deployed HTML pages but no source Markdown in the inspected repository. The original checkout had no renderer; this branch now adds a pinned body-only renderer pilot for selected existing Open Systems pages. The host deploy script still only copies pre-rendered output. Browser baseline: Firefox 157.0.1, desktop and emulated 390×844 mobile, reduced-motion and real Tab actions tested; favicon 404 and mobile horizontal overflow observed. HTTP probe: 308/308 tested URLs returned 200.

**Exit checklist**
- [x] Repository/default branch and audited commit recorded.
- [x] Canonical source/output counts and URL pattern recorded.
- [x] Existing JS/CSS and current diagram behavior inventoried.
- [x] Host copy/sync deployment script and origin service inspected.
- [x] Representative live pages and shared assets respond successfully; 308-URL HTTP probe passed.
- [x] Confirmed the original repository had no renderer; added a pinned body-only renderer pilot with source/output checks for selected lessons.
- [x] Captured browser baseline including console events, real Tab behavior, reduced motion, desktop, and 390×844 viewport. Recorded favicon 404 and mobile overflow.
- [x] Identified System Design source Markdown (60 files); confirmed no Embedded Systems & IoT Markdown source exists in the inspected repo/deployment tree.

**Gate result:** Phase 1 added opt-in JS/CSS. A pinned renderer pilot now handles reviewed Open Systems lesson bodies, but full-corpus validation reports two pre-existing drift findings. Further rollout remains gated on reconciling those findings and recovering/formally migrating the Embedded Systems & IoT source provenance.

## Phase 1 — Shared interactive foundation

Implemented in assets/interactive-course.js and assets/interactive-course.css. This foundation is opt-in and is not injected into current lessons.

- Component contract: register(name, factory), mount(element, name, config), reset(), destroy(); add pause() and step() only for components that support them.
- Idempotent initialization and cleanup; one isolated state object per instance; no global mutable simulation state.
- Semantic controls, keyboard access, labels, live status summaries, focus visibility, and reduced-motion behavior.
- Progressive enhancement: explanatory HTML remains visible if scripts fail or are disabled.
- Responsive SVG/HTML layouts; no Canvas unless it offers a measurable benefit.
- No new runtime dependency by default. Evaluate pinned Anime.js only if a prototype demonstrates that timeline choreography materially improves learning; simulation state must not depend on animation completion.
- Add unit tests for deterministic state transitions and a small browser smoke test for mount/reset/destroy/multiple instances.

**Gate result:** passed for the shared foundation. Six Node tests pass; a Firefox browser fixture verified two isolated instances, step/reset/destroy, listener cleanup, keyboard focus-visible, reduced-motion CSS, and no teardown errors. Existing live pages were not modified. See docs/interactive-course-framework.md and docs/interactive-course-browser-baseline.md.

## Phase 2 — Representative interactive prototypes

1. **Load balancing:** Round Robin and Least Connections; fixed request sequence; configurable request count; health/failure toggle; per-server request and active-connection counters; step/replay/reset; textual event log. Ensure Least Connections ties are resolved deterministically and failed servers receive no new work.
2. **Caching:** explicit cache key, TTL clock, hit/miss and database-call counters; configurable assumed hit ratio must be clearly labeled as an input assumption, not a measured result; show expiration and invalidation/stale-read cases.
3. **CAP:** at least three replicas and an explicit network-partition control; consistency-first and availability-first policies; expose read/write outcomes, quorum assumptions, and operation failures. Explain CAP applies during a partition and avoid claiming a permanent universal “choose two” rule.

Preserve existing lesson prose; add a labeled interactive region after the relevant explanation. Every result has a non-animated text explanation.

**Gate result:** fifteen prototypes are implemented and tested with deterministic fixtures; desktop and 390×844 mobile browser smoke checks passed, including keyboard focus and reduced motion. Sixty-five source/rendered lesson pairs link to the companion lab using the pinned renderer pilot. See docs/interactive-course-prototypes.md. No production deployment occurred.

## Phase 3 — Reusable interaction library

Initial library now documents and tests fifteen reusable behavior modules: load balancing, cache/TTL, queue/worker, retry/idempotency, SIP call flow, data-structure costs, graph/tree traversal, OS/file-I/O timelines, CPU scheduling, virtual-memory translation, race conditions/locks, network packet paths, protocol timelines for DNS/DHCP/NAT/TLS/routing/proxies, CAP/quorum, and storage/database guarantees. Candidate future families: request/response flow, selectable architecture diagram, failure/recovery, capacity calculator, knowledge check, scenario comparison, and sandboxed code demonstrations when justified. See docs/interactive-course-component-catalog.md.

Each component documents learning objective, input schema, output/state transitions, invariants, accessibility behavior, reduced-motion behavior, reset/replay, cleanup, failure fallback, test cases, and an example lesson.

**Gate:** each shared component is used by at least one suitable lesson and has tests and usage documentation.

## Phase 4 — Course-wide rollout

Use docs/interactive-course-lesson-mapping.md as the proposal baseline. Review mapping classifications against actual lesson text before implementation. Deliver batches of 10–15 lessons, grouped by shared component and topic. For every lesson, preserve title, body, URL, heading order, code examples, and navigation; add one concept-specific interaction or document why a diagram/decision exercise is superior to a simulator.

Update mapping status only after implementation and tests. “Complete” means the interaction works, its outcome is technically accurate, mobile and keyboard paths pass, reduced motion works, and the lesson output passes integrity checks—not merely that animation renders.

**Current rollout:** Batch 1 links ten lessons to five tested companion models: 107, 108, 113, 139, 143, 145, 146, 147, 149, and 152. Batch 2 adds a SIP call-flow companion for 131, 132, 134, 135, and 140. Batch 3 adds data-structure and graph/tree exercises for 041–050. Batch 4 adds OS timelines, scheduling, virtual memory, and race/lock models for 051–060. Batch 5 adds network packet-path exploration for 071–080. Batch 6 adds DNS/DHCP/NAT/TLS/routing/proxy timelines for 081–090. Batch 7 extends web-protocol scenarios for HTTP, method semantics, browser loading, sessions, CORS, and API contracts to Lessons 091–100. Batch 8 adds a storage/database explorer for Lessons 101–106 and 109–110. Seventy-three lessons now link to fifteen tested models; these are companion links rather than inline embedded controls, so the rollout remains partial. Continue with reviewed 10–15 lesson batches; do not claim all 180 are interactive yet. The canonical 180-lesson renderer gate is closed. Remaining rollout blockers are the separate System Design renderer/source workflow, Embedded Systems & IoT source provenance, and completing/reviewing the planned lesson batches. Do not label mapping entries complete based on links alone.

## Phase 5 — Automated QA

Add checks compatible with the current stack: source/output completeness, URL stability, content/heading/code preservation, internal-link/asset checks, deterministic simulation tests, multiple-component isolation, remount cleanup, keyboard semantics, reduced motion, JS exceptions, and viewport checks. Compare before/after representative pages. Use browser automation only if an available browser workflow is confirmed; otherwise report static/HTTP checks and the missing browser evidence honestly.

**Current QA result:** 62 Node tests pass; 3 Python renderer/integrity tests pass; JS syntax checks pass; seventy-three lesson source/output checks pass; Firefox 157.0.1 smoke test passes for all fifteen models, 390×844 layout, keyboard focus-visible, reduced motion, and zero console errors. Full-corpus renderer audit reports 180 source/output pairs checked and zero drift findings after the two documented source reconciliations. The course-scoped header CSS fix removed horizontal overflow from the course index and 73 tested lesson pages at 390×844; the favicon 404 remains a pre-existing issue. This is a passing pilot suite, not yet a course-wide QA gate.

## Phase 6 — Performance, accessibility, and deployment

Load component scripts only on pages that use them or through a tiny shared initializer. Keep the production architecture static. Build with the confirmed canonical renderer, review generated output, and deploy through the existing authorized workflow only after batch tests pass. Verify homepage, all modified lesson URLs, shared assets, mobile layout, keyboard path, reduced-motion mode, console, and unrelated-site integrity. Record commit, deployment timestamp, evidence, and rollback procedure.

**Status:** not deployed. Deployment is intentionally blocked until the planned canonical lesson batches are implemented/reviewed and the separate System Design/Embedded Systems & IoT provenance is handled. The current prototypes and twenty-five linked lessons have been tested on a local static server; no production change was made.

## Phase 7 — Final verification

Generate docs/interactive-course-final-report.md after the course-wide rollout and deployment gates are resolved. Until then, maintain this roadmap and the prototype catalog as an interim progress record; do not report the 180-lesson rollout as complete.

## Proposed first batch after Phase 0 closure

Start with a small prototype set anchored in existing lesson topics:
- Lesson 147 — service discovery, load balancing, and health.
- Lesson 107 — caches, faster copies, and stale state.
- Lesson 143 — consistency models and read visibility (use CAP only if the lesson actually covers partition trade-offs; otherwise add a clearly linked companion exercise rather than rewriting it).

Select the exact third prototype lesson after inspecting current lesson text and titles; do not assume a dedicated CAP lesson exists.
