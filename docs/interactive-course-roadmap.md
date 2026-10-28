# Interactive Course Roadmap

**Status:** Phase 0 audit complete with blockers; implementation not started.  
**Baseline commit:** 8918b2234dfeb8ceb3759c0964726df8fa8daf00  
**Rule:** Keep original lesson content and URLs intact. Add interactions as progressive enhancements; the lesson must remain useful without JavaScript or animation.

## Phase 0 — Audit and implementation plan

**Findings:** 180 canonical Markdown lessons map by stable front-matter URL to 180 posts/ HTML outputs. The repository also deploys 60 System Design and 60 Embedded Systems & IoT HTML-only lessons. Static host deployment copies pre-rendered output; the exact Markdown renderer command/version remains unidentified. Live HTTP probe: 308/308 tested URLs returned 200.

**Exit checklist**
- [x] Repository/default branch and audited commit recorded.
- [x] Canonical source/output counts and URL pattern recorded.
- [x] Existing JS/CSS and current diagram behavior inventoried.
- [x] Host copy/sync deployment script and origin service inspected.
- [x] Representative live pages and shared assets respond successfully; 308-URL HTTP probe passed.
- [ ] Identify authoritative renderer/build command, dependencies, and generated-output workflow for the 180 canonical lessons.
- [ ] Establish a browser console, keyboard, reduced-motion, and mobile/desktop visual baseline.
- [ ] Confirm the authoring source of the 60 System Design and 60 Embedded Systems & IoT companion pages.

**Gate:** Do not begin Phase 1 until the renderer/output ownership is resolved and baseline browser evidence can be captured or explicitly documented as unavailable.

## Phase 1 — Shared interactive foundation

Implement a small dependency-free vanilla JavaScript foundation in the existing static architecture. Start only after Phase 0 blockers are closed.

- Component contract: mount(element, config), reset(), destroy(); add pause() and step() only for components that support them.
- Idempotent initialization and cleanup; one isolated state object per instance; no global mutable simulation state.
- Semantic controls, keyboard access, labels, live status summaries, focus visibility, and reduced-motion behavior.
- Progressive enhancement: explanatory HTML remains visible if scripts fail or are disabled.
- Responsive SVG/HTML layouts; no Canvas unless it offers a measurable benefit.
- No new runtime dependency by default. Evaluate pinned Anime.js only if a prototype demonstrates that timeline choreography materially improves learning; simulation state must not depend on animation completion.
- Add unit tests for deterministic state transitions and a small browser smoke test for mount/reset/destroy/multiple instances.

**Gate:** representative page remains navigable and readable; no duplicate listeners after remount; keyboard/reduced-motion checks pass; no uncaught exceptions.

## Phase 2 — Three representative prototypes

1. **Load balancing:** Round Robin and Least Connections; fixed request sequence; configurable request count; health/failure toggle; per-server request and active-connection counters; step/replay/reset; textual event log. Ensure Least Connections ties are resolved deterministically and failed servers receive no new work.
2. **Caching:** explicit cache key, TTL clock, hit/miss and database-call counters; configurable assumed hit ratio must be clearly labeled as an input assumption, not a measured result; show expiration and invalidation/stale-read cases.
3. **CAP:** at least three replicas and an explicit network-partition control; consistency-first and availability-first policies; expose read/write outcomes, quorum assumptions, and operation failures. Explain CAP applies during a partition and avoid claiming a permanent universal “choose two” rule.

Preserve existing lesson prose; add a labeled interactive region after the relevant explanation. Every result has a non-animated text explanation.

**Gate:** technically reviewed expected outcomes; deterministic test fixtures; mobile and desktop checks; keyboard and reduced-motion tests; original lesson body/navigation preserved.

## Phase 3 — Reusable interaction library

Build and document components only after the prototypes demonstrate the patterns. Candidate families: request/response flow, selectable architecture diagram, step timeline, load-balancer simulator, cache/database simulator, queue/worker flow, replication/consistency, failure/recovery, capacity calculator, knowledge check, scenario comparison, and sandboxed code demonstrations when justified.

Each component documents learning objective, input schema, output/state transitions, invariants, accessibility behavior, reduced-motion behavior, reset/replay, cleanup, failure fallback, test cases, and an example lesson.

**Gate:** each shared component is used by at least one suitable lesson and has tests and usage documentation.

## Phase 4 — Course-wide rollout

Use docs/interactive-course-lesson-mapping.md as the proposal baseline. Review mapping classifications against actual lesson text before implementation. Deliver batches of 10–15 lessons, grouped by shared component and topic. For every lesson, preserve title, body, URL, heading order, code examples, and navigation; add one concept-specific interaction or document why a diagram/decision exercise is superior to a simulator.

Update mapping status only after implementation and tests. “Complete” means the interaction works, its outcome is technically accurate, mobile and keyboard paths pass, reduced motion works, and the lesson output passes integrity checks—not merely that animation renders.

**Gate:** each batch passes automated checks and receives review before the next batch starts.

## Phase 5 — Automated QA

Add checks compatible with the current stack: source/output completeness, URL stability, content/heading/code preservation, internal-link/asset checks, deterministic simulation tests, multiple-component isolation, remount cleanup, keyboard semantics, reduced motion, JS exceptions, and viewport checks. Compare before/after representative pages. Use browser automation only if an available browser workflow is confirmed; otherwise report static/HTTP checks and the missing browser evidence honestly.

**Gate:** all critical checks pass; remaining failures have severity, evidence, and remediation owners.

## Phase 6 — Performance, accessibility, and deployment

Load component scripts only on pages that use them or through a tiny shared initializer. Keep the production architecture static. Build with the confirmed canonical renderer, review generated output, and deploy through the existing authorized workflow only after batch tests pass. Verify homepage, all modified lesson URLs, shared assets, mobile layout, keyboard path, reduced-motion mode, console, and unrelated-site integrity. Record commit, deployment timestamp, evidence, and rollback procedure.

**Gate:** live behavior verified; no broad copy into shared dist/ until source/output diff is reviewed.

## Phase 7 — Final verification

Generate docs/interactive-course-final-report.md, update mapping and component inventory, and report actual totals by complete/partial/missing interaction, test results, accessibility/performance findings, live deployment evidence, limitations, and next steps.

## Proposed first batch after Phase 0 closure

Start with a small prototype set anchored in existing lesson topics:
- Lesson 147 — service discovery, load balancing, and health.
- Lesson 107 — caches, faster copies, and stale state.
- Lesson 143 — consistency models and read visibility (use CAP only if the lesson actually covers partition trade-offs; otherwise add a clearly linked companion exercise rather than rewriting it).

Select the exact third prototype lesson after inspecting current lesson text and titles; do not assume a dedicated CAP lesson exists.
