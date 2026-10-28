# Browser Baseline — 2026-10-29

## Environment and method

- Target: https://learn.reazromen.com/course.html
- Browser: Firefox 157.0.1 headless Linux, controlled with geckodriver 0.37.1 / WebDriver.
- Desktop viewport: 1366 × 682 CSS px.
- Mobile viewport: 390 × 844 CSS px, applied through WebDriver BiDi browsingContext.setViewport because Firefox's headless window rectangle API clamps to 500 px wide.
- Title: Open Systems Course — Reaz Romen; document language: en.
- One H1 and 203 links were present. Existing search, menu, theme and close buttons were found.
- Existing scripts site.js, sitewide.js, phase1.js and responsive-v3.js appeared in resource timing.

## Findings and limits

1. **Favicon 404:** https://learn.reazromen.com/favicon.ico returned HTTP 404 on the index and Lesson 107.
2. **Horizontal overflow:** at a real 390 × 844 CSS viewport, document.body.scrollWidth was 405 px on the index and 418 px on Lesson 107. documentElement.scrollWidth was 378 px in both. This is a confirmed mobile overflow signal that should be investigated separately.
3. **Keyboard:** real WebDriver Tab actions moved focus through course links and the active anchor matched :focus-visible. On the live page, computed outline-style was none but text-decoration was underline; the framework fixture confirmed a solid 3 px focus outline for its controls.
4. **Console:** BiDi log.entryAdded subscription captured no console events during the tested index and Lesson 107 loads. Network events separately confirmed the favicon 404; this does not establish absence of errors on every route.
5. **Reduced motion:** the emulated browser reports matchMedia('(prefers-reduced-motion: reduce)').matches as true. The framework fixture computed animation-duration as 0.00001s under the reduced-motion rule.

## HTTP baseline

An earlier Hserver probe checked 308 URLs and reported HTTP 200 for all 308: course root/index, 180 canonical lessons, 60 System Design lessons, 60 Embedded Systems & IoT lessons, and six shared assets. This is availability evidence, not browser accessibility evidence.

## Change boundary

Framework assets are not linked from existing lessons during Phase 1. No lesson content, URL, course index, companion HTML, deployment directory, or indexing policy is changed by this branch. Treat the favicon and any confirmed layout issue as pre-existing baseline findings.

## Follow-up fix on the interactive-course branch

A course-scoped mobile header rule was added to `assets/open-systems-course.css` and included by `course.html`. The Firefox 157.0.1 smoke test now checks the course index plus 25 linked lesson pages at 390×844 CSS pixels; each tested page reports body width ≤ 390 px. The original baseline widths (405 px index / 418 px Lesson 107) are historical pre-fix observations. The favicon 404 remains unresolved.
