'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const CourseInteractions = require('../assets/interactive-course.js');
let sequence = 0;

class Target {
  constructor() { this.handlers = new Map(); }
  addEventListener(type, handler) {
    if (!this.handlers.has(type)) this.handlers.set(type, new Set());
    this.handlers.get(type).add(handler);
  }
  removeEventListener(type, handler) { this.handlers.get(type)?.delete(handler); }
  count(type) { return this.handlers.get(type)?.size || 0; }
}
function root() {
  const r = new Target();
  r.querySelector = () => null;
  r.querySelectorAll = () => [];
  r.ownerDocument = { defaultView: { matchMedia: () => ({ matches: false }) } };
  return r;
}
function name() { sequence += 1; return 'test-interaction-' + sequence; }

test('register validates names and prevents accidental replacement', () => {
  const n = name();
  assert.throws(() => CourseInteractions.register('Bad Name', () => ({})), /kebab-case/);
  CourseInteractions.register(n, () => ({ reset() {}, destroy() {} }));
  assert.throws(() => CourseInteractions.register(n, () => ({ reset() {}, destroy() {} })), /already registered/);
});

test('mount is idempotent per root and isolates separate instances', () => {
  const n = name();
  let constructed = 0;
  CourseInteractions.register(n, () => {
    constructed += 1;
    return { reset() {}, destroy() {}, step() {} };
  });
  const a = root(), b = root();
  const one = CourseInteractions.mount(a, n, { seed: 1 });
  const again = CourseInteractions.mount(a, n, { seed: 2 });
  const two = CourseInteractions.mount(b, n, {});
  assert.equal(one, again);
  assert.notEqual(one, two);
  assert.equal(constructed, 2);
  assert.equal(one.name, n);
  assert.equal(typeof one.step, 'function');
  one.destroy(); two.destroy();
});

test('invalid lifecycle and conflicting mounts are rejected without leaking listeners', () => {
  const n = name(), button = new Target();
  CourseInteractions.register(n, ({ listen }) => {
    listen(button, 'click', () => {});
    return { reset() {} };
  });
  assert.throws(() => CourseInteractions.mount(root(), n), /reset\(\) and destroy\(\)/);
  assert.equal(button.count('click'), 0);
  const good = name();
  CourseInteractions.register(good, () => ({ reset() {}, destroy() {} }));
  const r = root(); CourseInteractions.mount(r, good);
  assert.throws(() => CourseInteractions.mount(r, n), /already hosts interaction/);
  CourseInteractions.destroyAll();
});

test('listeners are removed on destroy and destroy is idempotent', () => {
  const n = name(), button = new Target();
  let hits = 0, destroys = 0;
  CourseInteractions.register(n, ({ listen }) => {
    listen(button, 'click', () => { hits += 1; });
    return { reset() {}, destroy() { destroys += 1; } };
  });
  const instance = CourseInteractions.mount(root(), n);
  assert.equal(button.count('click'), 1);
  for (const fn of button.handlers.get('click')) fn();
  assert.equal(hits, 1);
  assert.equal(instance.destroy(), true);
  assert.equal(instance.destroy(), false);
  assert.equal(button.count('click'), 0);
  assert.equal(destroys, 1);
  assert.equal(instance.reset(), false);
});

test('reset delegates; pause and step are exposed only when supported', () => {
  const n = name(); let resets = 0, pauses = 0, steps = 0;
  CourseInteractions.register(n, () => ({
    reset() { resets += 1; }, destroy() {},
    pause() { pauses += 1; }, step() { steps += 1; }
  }));
  const instance = CourseInteractions.mount(root(), n);
  assert.equal(instance.reset(), true); instance.pause(); instance.step();
  assert.deepEqual([resets, pauses, steps], [1, 1, 1]);
  instance.destroy();
  const n2 = name(); CourseInteractions.register(n2, () => ({ reset() {}, destroy() {} }));
  const plain = CourseInteractions.mount(root(), n2);
  assert.equal('pause' in plain, false);
  assert.equal('step' in plain, false);
  plain.destroy();
});

test('reduced-motion preference is queried dynamically', () => {
  const n = name(); let preference;
  CourseInteractions.register(n, ({ prefersReducedMotion }) => {
    preference = prefersReducedMotion;
    return { reset() {}, destroy() {} };
  });
  const r = root(); let reduce = false;
  r.ownerDocument.defaultView.matchMedia = () => ({ matches: reduce });
  const instance = CourseInteractions.mount(r, n);
  assert.equal(preference(), false);
  reduce = true;
  assert.equal(preference(), true);
  instance.destroy();
});
