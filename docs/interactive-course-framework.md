# Interactive Course Framework

**Status:** Phase 1 implementation; no lesson content or production pages changed.

## Contract

- Dependency-free browser JavaScript, scoped CSS, semantic HTML and SVG.
- Register each component once under a lowercase kebab-case name. The factory receives root, config, status, listen, onCleanup, and prefersReducedMotion.
- A component must return reset() and destroy(); pause() and step() are optional and exposed only when implemented.
- CourseInteractions.mount(element, name, config) is idempotent for the same root/name. A different component cannot use that root until the current instance is destroyed.
- Every root owns isolated state. Registered event listeners and cleanup callbacks are removed during destroy().
- status(message) updates an authored [data-interaction-status] region or creates a polite live region that is removed on teardown.
- CourseInteractions.init(root) discovers [data-interaction] and parses optional JSON in data-interaction-config. It returns instances and initialization errors explicitly.
- CourseInteractions.destroyAll() tears down active instances and returns cleanup errors.

## Markup convention

Keep the lesson's static explanation meaningful without JavaScript.

~~~html
<section class="interactive-region" data-interaction="example-simulator"
         data-interaction-config='{"initialCount": 3}'
         aria-labelledby="example-simulator-title">
  <h2 id="example-simulator-title">Explore the example</h2>
  <p>The explanation remains available when scripts are unavailable.</p>
  <div class="interaction-controls">
    <button type="button" data-action="step">Step</button>
    <button type="button" data-action="reset">Reset</button>
  </div>
  <p data-interaction-status role="status" aria-live="polite">Ready.</p>
  <ol class="interaction-log"></ol>
</section>
~~~

The framework is not injected into all pages. Load its script and stylesheet only on pages with a registered component. No existing lesson opts in during Phase 1.

## Accessibility and motion

Use native controls, explicit labels, visible :focus-visible, keyboard operation, and concise live status updates. Pair diagrams with a text explanation or event log. SVG must fit its container. The CSS respects prefers-reduced-motion: reduce; component logic can query the live preference. Animation must never control simulation state. If JavaScript fails, the original lesson prose remains readable.

## Verification

Run **node --test tests/interactive-course.test.cjs**. Tests cover registration, duplicate registration, per-root idempotence and isolation, invalid lifecycle objects, listener cleanup, reset/destroy, and optional pause()/step(). The browser smoke fixture is tests/interactive-course-fixture.html; Firefox verified two isolated instances, step/reset/destroy, listener cleanup, keyboard focus-visible, reduced-motion CSS, and no teardown errors.

## Non-goals

No Anime.js, React, bundler, database, server runtime, Canvas renderer, global restyle, or lesson-wide script injection. Reconsider an animation dependency only if a prototype proves a material learning benefit over CSS/SVG.
