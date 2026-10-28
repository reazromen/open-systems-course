/* Shared, dependency-free interaction lifecycle for the Open Systems Course. */
(function (global, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (global) global.CourseInteractions = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const registry = new Map();
  const mounted = new WeakMap();
  const liveInstances = new Set();
  const VERSION = '1.0.0';

  function assertElement(element) {
    if (!element || typeof element.addEventListener !== 'function' || typeof element.querySelector !== 'function') {
      throw new TypeError('An interaction root must be a DOM element.');
    }
  }
  function register(name, factory) {
    if (typeof name !== 'string' || !/^[a-z][a-z0-9-]*$/.test(name)) {
      throw new TypeError('Interaction names must be lowercase kebab-case strings.');
    }
    if (typeof factory !== 'function') throw new TypeError('An interaction factory must be a function.');
    if (registry.has(name)) throw new Error('Interaction already registered: ' + name);
    registry.set(name, factory);
    return api;
  }
  function readReducedMotion(root) {
    const view = root && root.ownerDocument && root.ownerDocument.defaultView;
    const matcher = view && view.matchMedia;
    return typeof matcher === 'function' ? matcher.call(view, '(prefers-reduced-motion: reduce)').matches : false;
  }
  function mount(root, name, config) {
    assertElement(root);
    if (!registry.has(name)) throw new Error('Unknown interaction: ' + name);
    const existing = mounted.get(root);
    if (existing) {
      if (existing.name === name) return existing;
      throw new Error('This element already hosts interaction "' + existing.name + '". Destroy it before mounting "' + name + '".');
    }
    const cleanups = [];
    let destroyed = false;
    let component;
    let statusNode = null;
    let createdStatusNode = false;
    function status(message) {
      if (!statusNode) {
        statusNode = root.querySelector('[data-interaction-status]');
        if (!statusNode && root.ownerDocument && typeof root.ownerDocument.createElement === 'function') {
          statusNode = root.ownerDocument.createElement('p');
          statusNode.className = 'interaction-status';
          statusNode.setAttribute('data-interaction-status', '');
          statusNode.setAttribute('role', 'status');
          statusNode.setAttribute('aria-live', 'polite');
          root.appendChild(statusNode);
          createdStatusNode = true;
        }
      }
      if (statusNode) statusNode.textContent = String(message == null ? '' : message);
    }
    function onCleanup(cleanup) {
      if (typeof cleanup !== 'function') throw new TypeError('Cleanup must be a function.');
      if (destroyed) { cleanup(); return cleanup; }
      cleanups.push(cleanup);
      return cleanup;
    }
    function listen(target, eventName, handler, options) {
      if (!target || typeof target.addEventListener !== 'function' || typeof target.removeEventListener !== 'function') {
        throw new TypeError('Event target must support addEventListener/removeEventListener.');
      }
      target.addEventListener(eventName, handler, options);
      onCleanup(function () { target.removeEventListener(eventName, handler, options); });
      return handler;
    }
    const context = {
      root: root,
      config: config == null ? {} : config,
      status: status,
      listen: listen,
      onCleanup: onCleanup,
      prefersReducedMotion: function () { return readReducedMotion(root); }
    };
    try {
      component = registry.get(name)(context);
      if (!component || typeof component !== 'object') throw new TypeError('Factory for "' + name + '" must return a lifecycle object.');
      if (typeof component.reset !== 'function' || typeof component.destroy !== 'function') {
        throw new TypeError('Interaction "' + name + '" must implement reset() and destroy().');
      }
    } catch (error) {
      if (component && typeof component.destroy === 'function') {
        try { component.destroy(); } catch (_) { /* Preserve the original mount error. */ }
      }
      for (let i = cleanups.length - 1; i >= 0; i -= 1) {
        try { cleanups[i](); } catch (_) { /* Continue releasing remaining resources. */ }
      }
      cleanups.length = 0;
      if (createdStatusNode && statusNode && statusNode.parentNode === root) root.removeChild(statusNode);
      throw error;
    }
    const instance = {
      name: name,
      root: root,
      reset: function () {
        if (destroyed) return false;
        component.reset();
        return true;
      },
      destroy: function () {
        if (destroyed) return false;
        destroyed = true;
        let firstError = null;
        try { component.destroy(); } catch (error) { firstError = error; }
        for (let i = cleanups.length - 1; i >= 0; i -= 1) {
          try { cleanups[i](); } catch (error) { if (!firstError) firstError = error; }
        }
        cleanups.length = 0;
        if (createdStatusNode && statusNode && statusNode.parentNode === root) root.removeChild(statusNode);
        mounted.delete(root);
        liveInstances.delete(instance);
        if (firstError) throw firstError;
        return true;
      }
    };
    if (typeof component.pause === 'function') instance.pause = function () { if (!destroyed) return component.pause(); };
    if (typeof component.step === 'function') instance.step = function () { if (!destroyed) return component.step(); };
    mounted.set(root, instance);
    liveInstances.add(instance);
    return instance;
  }
  function init(root) {
    const scope = root || (typeof document !== 'undefined' ? document : null);
    if (!scope || typeof scope.querySelectorAll !== 'function') {
      throw new TypeError('init() needs a document or an element with querySelectorAll().');
    }
    const candidates = [];
    if (typeof scope.matches === 'function' && scope.matches('[data-interaction]')) candidates.push(scope);
    scope.querySelectorAll('[data-interaction]').forEach(function (element) { candidates.push(element); });
    const instances = [];
    const errors = [];
    candidates.forEach(function (element) {
      const name = element.getAttribute('data-interaction');
      try {
        const raw = element.getAttribute('data-interaction-config');
        const config = raw ? JSON.parse(raw) : {};
        instances.push(mount(element, name, config));
      } catch (error) {
        errors.push({ element: element, name: name, error: error });
      }
    });
    return { instances: instances, errors: errors };
  }
  function destroyAll() {
    const errors = [];
    Array.from(liveInstances).forEach(function (instance) {
      try { instance.destroy(); } catch (error) { errors.push(error); }
    });
    return errors;
  }
  const api = { version: VERSION, register: register, mount: mount, init: init, destroyAll: destroyAll };
  return api;
});
