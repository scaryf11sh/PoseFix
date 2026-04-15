import "clsx";
import { enablePatches, setAutoFreeze } from "immer";
import { r as readable, w as writable, d as derived } from "./index.js";
import { browser } from "@layerstack/utils/env";
import { f as store_set, a as store_get, j as slot, u as unsubscribe_stores, k as bind_props } from "./index2.js";
import { unique, formatDate, PeriodType } from "@layerstack/utils";
import { scaleOrdinal } from "d3-scale";
import { extent } from "d3-array";
import { get, memoize } from "lodash-es";
import { g as getContext, s as setContext } from "./context.js";
import { _ as noop, Z as fallback } from "./utils2.js";
import { cls } from "@layerstack/tailwind";
import { timeYear, timeMonth, timeDay, timeHour, timeMinute, timeSecond, timeMillisecond, timeWeek } from "d3-time";
import { format } from "date-fns";
const now = () => Date.now();
const raf = {
  // don't access requestAnimationFrame eagerly outside method
  // this allows basic testing of user code without JSDOM
  // bunder will eval and remove ternary when the user's app is built
  tick: (
    /** @param {any} _ */
    (_) => noop()
  ),
  now: () => now(),
  tasks: /* @__PURE__ */ new Set()
};
function loop(callback) {
  let task;
  if (raf.tasks.size === 0) ;
  return {
    promise: new Promise((fulfill) => {
      raf.tasks.add(task = { c: callback, f: fulfill });
    }),
    abort() {
      raf.tasks.delete(task);
    }
  };
}
function linear(t) {
  return t;
}
function cubicInOut(t) {
  return t < 0.5 ? 4 * t * t * t : 0.5 * Math.pow(2 * t - 2, 3) + 1;
}
function cubicIn(t) {
  return t * t * t;
}
enablePatches();
setAutoFreeze(false);
function matchMedia(queryString) {
  if (browser) {
    const query = window.matchMedia(queryString);
    return readable(query.matches, (set) => {
      const listener = (e) => set(e.matches);
      query.addEventListener("change", listener);
      return () => query.removeEventListener("change", listener);
    });
  } else {
    return writable(true);
  }
}
const matchMediaWidth = (width) => matchMedia(`(min-width: ${width}px)`);
const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536
};
matchMediaWidth(breakpoints.sm);
matchMediaWidth(breakpoints.md);
matchMediaWidth(breakpoints.lg);
matchMediaWidth(breakpoints.xl);
matchMediaWidth(breakpoints.xxl);
matchMedia(`screen`);
matchMedia(`print`);
matchMedia(`(prefers-color-scheme: dark)`);
matchMedia(`(prefers-color-scheme: light)`);
matchMedia(`(prefers-reduced-motion: reduce)`);
matchMedia(`(orientation: landscape)`);
matchMedia(`(orientation: portrait)`);
function is_date(obj) {
  return Object.prototype.toString.call(obj) === "[object Date]";
}
function tick_spring(ctx, last_value, current_value, target_value) {
  if (typeof current_value === "number" || is_date(current_value)) {
    const delta = target_value - current_value;
    const velocity = (current_value - last_value) / (ctx.dt || 1 / 60);
    const spring2 = ctx.opts.stiffness * delta;
    const damper = ctx.opts.damping * velocity;
    const acceleration = (spring2 - damper) * ctx.inv_mass;
    const d = (velocity + acceleration) * ctx.dt;
    if (Math.abs(d) < ctx.opts.precision && Math.abs(delta) < ctx.opts.precision) {
      return target_value;
    } else {
      ctx.settled = false;
      return is_date(current_value) ? new Date(current_value.getTime() + d) : current_value + d;
    }
  } else if (Array.isArray(current_value)) {
    return current_value.map(
      (_, i) => (
        // @ts-ignore
        tick_spring(ctx, last_value[i], current_value[i], target_value[i])
      )
    );
  } else if (typeof current_value === "object") {
    const next_value = {};
    for (const k in current_value) {
      next_value[k] = tick_spring(ctx, last_value[k], current_value[k], target_value[k]);
    }
    return next_value;
  } else {
    throw new Error(`Cannot spring ${typeof current_value} values`);
  }
}
function spring(value, opts = {}) {
  const store = writable(value);
  const { stiffness = 0.15, damping = 0.8, precision = 0.01 } = opts;
  let last_time;
  let task;
  let current_token;
  let last_value = (
    /** @type {T} */
    value
  );
  let target_value = (
    /** @type {T | undefined} */
    value
  );
  let inv_mass = 1;
  let inv_mass_recovery_rate = 0;
  let cancel_task = false;
  function set(new_value, opts2 = {}) {
    target_value = new_value;
    const token = current_token = {};
    if (value == null || opts2.hard || spring2.stiffness >= 1 && spring2.damping >= 1) {
      cancel_task = true;
      last_time = raf.now();
      last_value = new_value;
      store.set(value = target_value);
      return Promise.resolve();
    } else if (opts2.soft) {
      const rate = opts2.soft === true ? 0.5 : +opts2.soft;
      inv_mass_recovery_rate = 1 / (rate * 60);
      inv_mass = 0;
    }
    if (!task) {
      last_time = raf.now();
      cancel_task = false;
      task = loop((now2) => {
        if (cancel_task) {
          cancel_task = false;
          task = null;
          return false;
        }
        inv_mass = Math.min(inv_mass + inv_mass_recovery_rate, 1);
        const elapsed = Math.min(now2 - last_time, 1e3 / 30);
        const ctx = {
          inv_mass,
          opts: spring2,
          settled: true,
          dt: elapsed * 60 / 1e3
        };
        const next_value = tick_spring(ctx, last_value, value, target_value);
        last_time = now2;
        last_value = /** @type {T} */
        value;
        store.set(value = /** @type {T} */
        next_value);
        if (ctx.settled) {
          task = null;
        }
        return !ctx.settled;
      });
    }
    return new Promise((fulfil) => {
      task.promise.then(() => {
        if (token === current_token) fulfil();
      });
    });
  }
  const spring2 = {
    set,
    update: (fn, opts2) => set(fn(
      /** @type {T} */
      target_value,
      /** @type {T} */
      value
    ), opts2),
    subscribe: store.subscribe,
    stiffness,
    damping,
    precision
  };
  return spring2;
}
function get_interpolator(a, b) {
  if (a === b || a !== a) return () => a;
  const type = typeof a;
  if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
    throw new Error("Cannot interpolate values of different type");
  }
  if (Array.isArray(a)) {
    const arr = (
      /** @type {Array<any>} */
      b.map((bi, i) => {
        return get_interpolator(
          /** @type {Array<any>} */
          a[i],
          bi
        );
      })
    );
    return (t) => arr.map((fn) => fn(t));
  }
  if (type === "object") {
    if (!a || !b) {
      throw new Error("Object cannot be null");
    }
    if (is_date(a) && is_date(b)) {
      const an = a.getTime();
      const bn = b.getTime();
      const delta = bn - an;
      return (t) => new Date(an + t * delta);
    }
    const keys = Object.keys(b);
    const interpolators = {};
    keys.forEach((key) => {
      interpolators[key] = get_interpolator(a[key], b[key]);
    });
    return (t) => {
      const result = {};
      keys.forEach((key) => {
        result[key] = interpolators[key](t);
      });
      return result;
    };
  }
  if (type === "number") {
    const delta = (
      /** @type {number} */
      b - /** @type {number} */
      a
    );
    return (t) => a + t * delta;
  }
  return () => b;
}
function tweened(value, defaults = {}) {
  const store = writable(value);
  let task;
  let target_value = value;
  function set(new_value, opts) {
    target_value = new_value;
    if (value == null) {
      store.set(value = new_value);
      return Promise.resolve();
    }
    let previous_task = task;
    let started = false;
    let {
      delay = 0,
      duration = 400,
      easing = linear,
      interpolate = get_interpolator
    } = { ...defaults, ...opts };
    if (duration === 0) {
      if (previous_task) {
        previous_task.abort();
        previous_task = null;
      }
      store.set(value = target_value);
      return Promise.resolve();
    }
    const start = raf.now() + delay;
    let fn;
    task = loop((now2) => {
      if (now2 < start) return true;
      if (!started) {
        fn = interpolate(
          /** @type {any} */
          value,
          new_value
        );
        if (typeof duration === "function")
          duration = duration(
            /** @type {any} */
            value,
            new_value
          );
        started = true;
      }
      if (previous_task) {
        previous_task.abort();
        previous_task = null;
      }
      const elapsed = now2 - start;
      if (elapsed > /** @type {number} */
      duration) {
        store.set(value = new_value);
        return false;
      }
      store.set(value = fn(easing(elapsed / duration)));
      return true;
    });
    return task.promise;
  }
  return {
    set,
    update: (fn, opts) => set(fn(
      /** @type {any} */
      target_value,
      /** @type {any} */
      value
    ), opts),
    subscribe: store.subscribe
  };
}
function motionStore(value, options) {
  if (options.spring) {
    return spring(value, options.spring === true ? void 0 : options.spring);
  } else if (options.tweened) {
    return tweened(value, options.tweened === true ? void 0 : options.tweened);
  } else {
    return writable(value);
  }
}
function resolveOptions(prop, options) {
  return {
    spring: typeof options.spring === "boolean" || options.spring == null ? options.spring : prop in options.spring ? (
      //@ts-expect-error
      options.spring[prop]
    ) : Object.keys(options.spring).some((key) => ["precision", "damping", "stiffness"].includes(key)) ? options.tweened : false,
    tweened: typeof options.tweened === "boolean" || options.tweened == null ? options.tweened : prop in options.tweened ? (
      //@ts-expect-error
      options.tweened[prop]
    ) : Object.keys(options.tweened).some((key) => ["delay", "duration", "easing"].includes(key)) ? options.tweened : false
  };
}
function motionFinishHandler() {
  let latestIndex = 0;
  const moving = writable(false);
  const handle = function(promise) {
    latestIndex += 1;
    if (!promise) {
      moving.set(false);
      return;
    }
    let thisIndex = latestIndex;
    moving.set(true);
    promise.then(() => {
      if (thisIndex === latestIndex) {
        moving.set(false);
      }
    });
  };
  return {
    subscribe: moving.subscribe,
    handle
  };
}
function accessor(prop) {
  if (Array.isArray(prop)) {
    return (d) => prop.map((p) => accessor(p)(d));
  } else if (typeof prop === "function") {
    return prop;
  } else if (typeof prop === "string" || typeof prop === "number") {
    return (d) => get(d, prop);
  } else {
    return (d) => d;
  }
}
function chartDataArray(data) {
  if (data == null) {
    return [];
  } else if (Array.isArray(data)) {
    return data;
  } else if ("nodes" in data) {
    return data.nodes;
  } else {
    return data.descendants();
  }
}
function defaultChartPadding(axis, legend) {
  if (axis === false) {
    return void 0;
  } else {
    return {
      top: axis === true || axis === "y" ? 4 : 0,
      left: axis === true || axis === "y" ? 20 : 0,
      bottom: (axis === true || axis === "x" ? 20 : 0) + (legend === true ? 32 : 0),
      right: axis === true || axis === "x" ? 4 : 0
    };
  }
}
function findRelatedData(data, original, accessor2) {
  return data.find((d) => {
    return accessor2(d)?.valueOf() === accessor2(original)?.valueOf();
  });
}
function scaleBandInvert(scale) {
  const domain = scale.domain();
  const eachBand = scale.step();
  const paddingOuter = eachBand * (scale.paddingOuter?.() ?? scale.padding());
  return function(value) {
    const index = Math.floor((value - paddingOuter / 2) / eachBand);
    return domain[Math.max(0, Math.min(index, domain.length - 1))];
  };
}
function isScaleBand(scale) {
  return typeof scale.bandwidth === "function";
}
function scaleInvert(scale, value) {
  if (isScaleBand(scale)) {
    return scaleBandInvert(scale)(value);
  } else {
    return scale.invert?.(value);
  }
}
function createScale(scale, domain, range, context) {
  const scaleCopy = scale.copy();
  if (domain) {
    scaleCopy.domain(domain);
  }
  if (typeof range === "function") {
    scaleCopy.range(range(context));
  } else {
    scaleCopy.range(range);
  }
  return scaleCopy;
}
const chartContextKey = /* @__PURE__ */ Symbol();
function chartContext() {
  return getContext(chartContextKey);
}
function setChartContext(context) {
  setContext(chartContextKey, context);
}
function ChartContext($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let addtConfig;
    let x1 = fallback($$props["x1"], void 0);
    let x1Scale = fallback($$props["x1Scale"], void 0);
    let x1Domain = fallback($$props["x1Domain"], void 0);
    let x1Range = fallback($$props["x1Range"], void 0);
    let y1 = fallback($$props["y1"], void 0);
    let y1Scale = fallback($$props["y1Scale"], void 0);
    let y1Domain = fallback($$props["y1Domain"], void 0);
    let y1Range = fallback($$props["y1Range"], void 0);
    let c = fallback($$props["c"], void 0);
    let cScale = fallback($$props["cScale"], void 0);
    let cDomain = fallback($$props["cDomain"], void 0);
    let cRange = fallback($$props["cRange"], void 0);
    const layerCakeContext = getContext("LayerCake");
    const {
      data: contextData,
      width,
      height,
      containerWidth,
      containerHeight,
      xScale,
      yScale
    } = layerCakeContext;
    const _x1 = writable(accessor(x1));
    const _x1Scale = writable(null);
    const _x1Domain = writable(x1Domain);
    const _x1Range = writable(x1Range);
    const _x1Get = writable();
    const _y1 = writable(accessor(y1));
    const _y1Scale = writable(null);
    const _y1Domain = writable(y1Domain);
    const _y1Range = writable(y1Range);
    const _y1Get = writable();
    const _c = writable(accessor(c));
    const _cScale = writable(scaleOrdinal());
    const _cDomain = writable(cDomain);
    const _cRange = writable(cRange);
    const _cGet = writable();
    let radial = fallback($$props["radial"], false);
    const _radial = writable(radial);
    const _addtConfig = writable(addtConfig);
    const config = derived([layerCakeContext.config, _addtConfig], ([$config, $addtConfig]) => {
      return { ...$config, ...$addtConfig };
    });
    const chartContext2 = {
      ...layerCakeContext,
      x1: _x1,
      x1Domain: _x1Domain,
      x1Range: _x1Range,
      x1Scale: _x1Scale,
      x1Get: _x1Get,
      y1: _y1,
      y1Domain: _y1Domain,
      y1Range: _y1Range,
      y1Scale: _y1Scale,
      y1Get: _y1Get,
      c: _c,
      cDomain: _cDomain,
      cRange: _cRange,
      cScale: _cScale,
      cGet: _cGet,
      config,
      radial: _radial
    };
    setChartContext(chartContext2);
    let onresize = fallback($$props["onresize"], void 0);
    let data = fallback($$props["data"], () => [], true);
    store_set(_x1, accessor(x1));
    store_set(_x1Domain, x1Domain ?? extent(chartDataArray(store_get($$store_subs ??= {}, "$contextData", contextData)), store_get($$store_subs ??= {}, "$_x1", _x1)));
    store_set(_x1Scale, x1Scale && x1Range ? createScale(x1Scale, store_get($$store_subs ??= {}, "$_x1Domain", _x1Domain), x1Range, {
      xScale: store_get($$store_subs ??= {}, "$xScale", xScale),
      $width: store_get($$store_subs ??= {}, "$width", width),
      $height: store_get($$store_subs ??= {}, "$height", height)
    }) : null);
    store_set(_x1Range, x1Range);
    store_set(_x1Get, (d) => store_get($$store_subs ??= {}, "$_x1Scale", _x1Scale)?.(store_get($$store_subs ??= {}, "$_x1", _x1)(d)));
    store_set(_y1, accessor(y1));
    store_set(_y1Domain, y1Domain ?? extent(chartDataArray(store_get($$store_subs ??= {}, "$contextData", contextData)), store_get($$store_subs ??= {}, "$_y1", _y1)));
    store_set(_y1Range, y1Range);
    store_set(_y1Scale, y1Scale && y1Range ? createScale(y1Scale, store_get($$store_subs ??= {}, "$_y1Domain", _y1Domain), y1Range, {
      yScale: store_get($$store_subs ??= {}, "$yScale", yScale),
      $width: store_get($$store_subs ??= {}, "$width", width),
      $height: store_get($$store_subs ??= {}, "$height", height)
    }) : null);
    store_set(_y1Get, (d) => store_get($$store_subs ??= {}, "$_y1Scale", _y1Scale)?.(store_get($$store_subs ??= {}, "$_y1", _y1)(d)));
    store_set(_c, accessor(c));
    store_set(_cDomain, cDomain ?? unique(chartDataArray(store_get($$store_subs ??= {}, "$contextData", contextData)).map(store_get($$store_subs ??= {}, "$_c", _c))));
    store_set(_cRange, cRange);
    store_set(_cScale, cRange ? createScale(cScale ?? scaleOrdinal(), store_get($$store_subs ??= {}, "$_cDomain", _cDomain), cRange, {
      $width: store_get($$store_subs ??= {}, "$width", width),
      $height: store_get($$store_subs ??= {}, "$height", height)
    }) : null);
    store_set(_cGet, (d) => store_get($$store_subs ??= {}, "$_cScale", _cScale)?.(store_get($$store_subs ??= {}, "$_c", _c)(d)));
    store_set(_radial, radial);
    addtConfig = {
      ...x1 && { x1 },
      ...x1Domain && { x1Domain },
      ...x1Range && { x1Range },
      ...x1Scale && { x1Scale },
      ...y1 && { y1 },
      ...y1Domain && { y1Domain },
      ...y1Range && { y1Range },
      ...y1Scale && { y1Scale },
      ...c && { c },
      ...cDomain && { cDomain },
      ...cRange && { cRange },
      ...cScale && { cScale }
    };
    store_set(_addtConfig, addtConfig);
    $$renderer2.push(`<!--[-->`);
    slot(
      $$renderer2,
      $$props,
      "default",
      {
        // Track when mounted since LayerCake initializes width/height with `100` until bound `clientWidth`/`clientWidth` can run
        // Added to try to pass TData downward
        // Same as `ComponentProps<Chart<TData>>` but causes circular reference
        data,
        flatData: chartContext2.data,
        config: store_get($$store_subs ??= {}, "$config", config),
        x1: store_get($$store_subs ??= {}, "$_x1", _x1),
        x1Scale: store_get($$store_subs ??= {}, "$_x1Scale", _x1Scale),
        x1Get: store_get($$store_subs ??= {}, "$_x1Get", _x1Get),
        y1: store_get($$store_subs ??= {}, "$_y1", _y1),
        y1Scale: store_get($$store_subs ??= {}, "$_y1Scale", _y1Scale),
        y1Get: store_get($$store_subs ??= {}, "$_y1Get", _y1Get),
        c: store_get($$store_subs ??= {}, "$_c", _c),
        cScale: store_get($$store_subs ??= {}, "$_cScale", _cScale),
        cGet: store_get($$store_subs ??= {}, "$_cGet", _cGet)
      },
      null
    );
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, {
      x1,
      x1Scale,
      x1Domain,
      x1Range,
      y1,
      y1Scale,
      y1Domain,
      y1Range,
      c,
      cScale,
      cDomain,
      cRange,
      radial,
      onresize,
      data
    });
  });
}
const transformContextKey = /* @__PURE__ */ Symbol();
const defaultTranslate = writable({ x: 0, y: 0 });
const defaultScale = writable(1);
const defaultContext = {
  mode: "none",
  scale: defaultScale,
  setScale: defaultScale.set,
  translate: defaultTranslate,
  setTranslate: defaultTranslate.set,
  moving: writable(false),
  dragging: writable(false),
  scrollMode: writable("none"),
  setScrollMode: () => {
  },
  reset: () => {
  },
  zoomIn: () => {
  },
  zoomOut: () => {
  },
  translateCenter: () => {
  },
  zoomTo: () => {
  }
};
function transformContext() {
  return getContext(transformContextKey) ?? defaultContext;
}
function setTransformContext(transform) {
  setContext(transformContextKey, transform);
}
function TransformContext($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let center;
    const { width, height, padding } = chartContext();
    let mode = fallback($$props["mode"], "none");
    let spring2 = fallback($$props["spring"], void 0);
    let tweened2 = fallback($$props["tweened"], void 0);
    let processTranslate = fallback($$props["processTranslate"], (x, y, deltaX, deltaY) => {
      return { x: x + deltaX, y: y + deltaY };
    });
    let disablePointer = fallback($$props["disablePointer"], false);
    let initialScrollMode = fallback($$props["initialScrollMode"], "none");
    let clickDistance = fallback($$props["clickDistance"], 10);
    let ondragstart = fallback($$props["ondragstart"], void 0);
    let ondragend = fallback($$props["ondragend"], void 0);
    let ontransform = fallback($$props["ontransform"], void 0);
    const dragging = writable(false);
    const scrollMode = writable(initialScrollMode);
    const DEFAULT_TRANSLATE = { x: 0, y: 0 };
    let initialTranslate = fallback($$props["initialTranslate"], void 0);
    const translate = motionStore(initialTranslate ?? DEFAULT_TRANSLATE, { spring: spring2, tweened: tweened2 });
    const DEFAULT_SCALE = 1;
    let initialScale = fallback($$props["initialScale"], void 0);
    const scale = motionStore(initialScale ?? DEFAULT_SCALE, { spring: spring2, tweened: tweened2 });
    function setScrollMode(mode2) {
      store_set(scrollMode, mode2);
    }
    function reset() {
      store_set(translate, initialTranslate ?? DEFAULT_TRANSLATE);
      store_set(scale, initialScale ?? DEFAULT_SCALE);
    }
    function zoomIn() {
      scaleTo(1.25, {
        x: (store_get($$store_subs ??= {}, "$width", width) + store_get($$store_subs ??= {}, "$padding", padding).left) / 2,
        y: (store_get($$store_subs ??= {}, "$height", height) + store_get($$store_subs ??= {}, "$padding", padding).top) / 2
      });
    }
    function zoomOut() {
      scaleTo(0.8, {
        x: (store_get($$store_subs ??= {}, "$width", width) + store_get($$store_subs ??= {}, "$padding", padding).left) / 2,
        y: (store_get($$store_subs ??= {}, "$height", height) + store_get($$store_subs ??= {}, "$padding", padding).top) / 2
      });
    }
    function translateCenter() {
      store_set(translate, { x: 0, y: 0 });
    }
    function zoomTo(center2, rect) {
      const newScale = rect ? store_get($$store_subs ??= {}, "$width", width) < store_get($$store_subs ??= {}, "$height", height) ? store_get($$store_subs ??= {}, "$width", width) / rect.width : store_get($$store_subs ??= {}, "$height", height) / rect.height : 1;
      store_set(translate, {
        x: store_get($$store_subs ??= {}, "$width", width) / 2 - center2.x * newScale,
        y: store_get($$store_subs ??= {}, "$height", height) / 2 - center2.y * newScale
      });
      if (rect) {
        store_set(scale, newScale);
      }
    }
    function scaleTo(value, point, options = void 0) {
      const currentScale = store_get($$store_subs ??= {}, "$scale", scale);
      const newScale = store_get($$store_subs ??= {}, "$scale", scale) * value;
      setScale(newScale, options);
      const invertTransformPoint = {
        x: (point.x - store_get($$store_subs ??= {}, "$padding", padding).left - store_get($$store_subs ??= {}, "$translate", translate).x) / currentScale,
        y: (point.y - store_get($$store_subs ??= {}, "$padding", padding).top - store_get($$store_subs ??= {}, "$translate", translate).y) / currentScale
      };
      const newTranslate = {
        x: point.x - store_get($$store_subs ??= {}, "$padding", padding).left - invertTransformPoint.x * newScale,
        y: point.y - store_get($$store_subs ??= {}, "$padding", padding).top - invertTransformPoint.y * newScale
      };
      setTranslate(newTranslate, options);
    }
    const translating = motionFinishHandler();
    const scaling = motionFinishHandler();
    const moving = derived([dragging, translating, scaling], ([dragging2, translating2, scaling2]) => dragging2 || translating2 || scaling2);
    function setTranslate(point, options) {
      translating.handle(translate.set(point, options));
    }
    function setScale(value, options) {
      scaling.handle(scale.set(value, options));
    }
    setTransformContext({
      mode,
      scale,
      setScale,
      translate,
      setTranslate,
      dragging,
      moving,
      reset,
      zoomIn,
      zoomOut,
      translateCenter,
      zoomTo,
      scrollMode,
      setScrollMode
    });
    center = {
      x: store_get($$store_subs ??= {}, "$width", width) / 2,
      y: store_get($$store_subs ??= {}, "$height", height) / 2
    };
    ({
      x: center.x - store_get($$store_subs ??= {}, "$translate", translate).x,
      y: center.y - store_get($$store_subs ??= {}, "$translate", translate).y
    });
    ontransform?.({
      scale: store_get($$store_subs ??= {}, "$scale", scale),
      translate: store_get($$store_subs ??= {}, "$translate", translate)
    });
    $$renderer2.push(`<div class="h-full"><!--[-->`);
    slot(
      $$renderer2,
      $$props,
      "default",
      {
        transform: (
          // Touch events cause pointer events to be interrupted.
          // Typically `touch-action: none` works, but doesn't appear to with SVG, but `preventDefault()` works here
          // https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events#touch-action_css_property
          {
            scale: store_get($$store_subs ??= {}, "$scale", scale),
            setScale,
            translate: store_get($$store_subs ??= {}, "$translate", translate),
            setTranslate,
            zoomTo,
            reset
          }
        )
      },
      null
    );
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, {
      mode,
      spring: spring2,
      tweened: tweened2,
      processTranslate,
      disablePointer,
      initialScrollMode,
      clickDistance,
      ondragstart,
      ondragend,
      ontransform,
      initialTranslate,
      initialScale,
      translate,
      scale,
      setScrollMode,
      reset,
      zoomIn,
      zoomOut,
      translateCenter,
      zoomTo,
      setTranslate,
      setScale
    });
  });
}
const DEFAULT_FILL = "rgb(0, 0, 0)";
const CANVAS_STYLES_ELEMENT_ID = "__layerchart_canvas_styles_id";
function getComputedStyles(canvas, { styles, classes } = {}) {
  try {
    let svg = document.getElementById(CANVAS_STYLES_ELEMENT_ID);
    if (!svg) {
      svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("id", CANVAS_STYLES_ELEMENT_ID);
      svg.style.display = "none";
      canvas.after(svg);
    }
    svg = svg;
    svg.removeAttribute("style");
    svg.removeAttribute("class");
    if (styles) {
      Object.assign(svg.style, styles);
    }
    if (classes) {
      svg.setAttribute("class", cls(classes).split(" ").filter((s) => !s.startsWith("transition-")).join(" "));
    }
    const computedStyles = window.getComputedStyle(svg);
    return computedStyles;
  } catch (e) {
    console.error("Unable to get computed styles", e);
    return {};
  }
}
function render(ctx, render2, styleOptions = {}) {
  const computedStyles = getComputedStyles(ctx.canvas, styleOptions);
  const paintOrder = computedStyles?.paintOrder === "stroke" ? ["stroke", "fill"] : ["fill", "stroke"];
  if (computedStyles?.opacity) {
    ctx.globalAlpha = Number(computedStyles?.opacity);
  }
  ctx.font = `${computedStyles.fontSize} ${computedStyles.fontFamily}`;
  if (computedStyles.textAnchor === "middle") {
    ctx.textAlign = "center";
  } else if (computedStyles.textAnchor === "end") {
    ctx.textAlign = "right";
  } else {
    ctx.textAlign = computedStyles.textAlign;
  }
  if (computedStyles.strokeDasharray.includes(",")) {
    const dashArray = computedStyles.strokeDasharray.split(",").map((s) => Number(s.replace("px", "")));
    ctx.setLineDash(dashArray);
  }
  paintOrder.forEach((attr) => {
    if (attr === "fill") {
      const fill = styleOptions.styles?.fill && (styleOptions.styles?.fill instanceof CanvasGradient || !styleOptions.styles?.fill?.includes("var")) ? styleOptions.styles.fill : computedStyles?.fill;
      if (fill && !["none", DEFAULT_FILL].includes(fill)) {
        const currentGlobalAlpha = ctx.globalAlpha;
        const fillOpacity = Number(computedStyles?.fillOpacity);
        const opacity = Number(computedStyles?.opacity);
        ctx.globalAlpha = fillOpacity * opacity;
        ctx.fillStyle = fill;
        render2.fill(ctx);
        ctx.globalAlpha = currentGlobalAlpha;
      }
    } else if (attr === "stroke") {
      const stroke = styleOptions.styles?.stroke && (styleOptions.styles?.stroke instanceof CanvasGradient || !styleOptions.styles?.stroke?.includes("var")) ? styleOptions.styles?.stroke : computedStyles?.stroke;
      if (stroke && !["none"].includes(stroke)) {
        ctx.lineWidth = typeof computedStyles?.strokeWidth === "string" ? Number(computedStyles?.strokeWidth?.replace("px", "")) : computedStyles?.strokeWidth ?? 1;
        ctx.strokeStyle = stroke;
        render2.stroke(ctx);
      }
    }
  });
}
function renderPathData(ctx, pathData, styleOptions = {}) {
  const path = new Path2D(pathData ?? "");
  render(ctx, {
    fill: (ctx2) => ctx2.fill(path),
    stroke: (ctx2) => ctx2.stroke(path)
  }, styleOptions);
}
function renderText(ctx, text, coords, styleOptions = {}) {
  if (text) {
    render(ctx, {
      fill: (ctx2) => ctx2.fillText(text.toString(), coords.x, coords.y),
      stroke: (ctx2) => ctx2.strokeText(text.toString(), coords.x, coords.y)
    }, styleOptions);
  }
}
function renderRect(ctx, coords, styleOptions = {}) {
  render(ctx, {
    fill: (ctx2) => ctx2.fillRect(coords.x, coords.y, coords.width, coords.height),
    stroke: (ctx2) => ctx2.strokeRect(coords.x, coords.y, coords.width, coords.height)
  }, styleOptions);
}
function renderCircle(ctx, coords, styleOptions = {}) {
  ctx.beginPath();
  ctx.arc(coords.cx, coords.cy, coords.r, 0, 2 * Math.PI);
  render(ctx, {
    fill: (ctx2) => {
      ctx2.fill();
    },
    stroke: (ctx2) => {
      ctx2.stroke();
    }
  }, styleOptions);
  ctx.closePath();
}
function scaleCanvas(ctx, width, height) {
  const devicePixelRatio = window.devicePixelRatio || 1;
  ctx.canvas.width = width * devicePixelRatio;
  ctx.canvas.height = height * devicePixelRatio;
  ctx.canvas.style.width = `${width}px`;
  ctx.canvas.style.height = `${height}px`;
  ctx.scale(devicePixelRatio, devicePixelRatio);
  return { width: ctx.canvas.width, height: ctx.canvas.height };
}
function _createLinearGradient(ctx, x0, y0, x1, y1, stops) {
  const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
  stops.forEach(({ offset, color }) => {
    gradient.addColorStop(offset, color);
  });
  return gradient;
}
memoize(_createLinearGradient, (ctx, x0, y0, x1, y1, stops) => {
  const key = JSON.stringify({ x0, y0, x1, y1, stops });
  return key;
});
const MEASUREMENT_ELEMENT_ID = "__text_measurement_id";
function _getStringWidth(str, style) {
  try {
    let textEl = document.getElementById(MEASUREMENT_ELEMENT_ID);
    if (!textEl) {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.style.width = "0";
      svg.style.height = "0";
      svg.style.position = "absolute";
      svg.style.top = "-100%";
      svg.style.left = "-100%";
      textEl = document.createElementNS("http://www.w3.org/2000/svg", "text");
      textEl.setAttribute("id", MEASUREMENT_ELEMENT_ID);
      svg.appendChild(textEl);
      document.body.appendChild(svg);
    }
    Object.assign(textEl.style, style);
    textEl.textContent = str;
    return textEl.getComputedTextLength();
  } catch (e) {
    return null;
  }
}
const getStringWidth = memoize(_getStringWidth, (str, style) => `${str}_${JSON.stringify(style)}`);
[
  {
    predicate: (duration) => duration == null,
    // Unknown
    interval: timeYear.every(1),
    // Better than rendering a lot of items
    format: (date) => date.toString()
  },
  {
    predicate: (duration) => duration.years > 1,
    interval: timeYear.every(1),
    format: (date) => formatDate(date, PeriodType.CalendarYear, { variant: "short" })
  },
  {
    predicate: (duration) => duration.years,
    interval: timeMonth.every(1),
    format: (date) => formatDate(date, PeriodType.Month, { variant: "short" })
  },
  {
    predicate: (duration) => duration.days > 30,
    interval: timeMonth.every(1),
    format: (date) => formatDate(date, PeriodType.Month, { variant: "short" })
  },
  {
    predicate: (duration) => duration.days,
    interval: timeDay.every(1),
    format: (date) => formatDate(date, PeriodType.Day, { variant: "short" })
  },
  {
    predicate: (duration) => duration.hours,
    interval: timeHour.every(1),
    format: (date) => format(date, "h:mm a")
  },
  {
    predicate: (duration) => duration.minutes > 10,
    interval: timeMinute.every(10),
    format: (date) => format(date, "h:mm a")
  },
  {
    predicate: (duration) => duration.minutes,
    interval: timeMinute.every(1),
    format: (date) => format(date, "h:mm a")
  },
  {
    predicate: (duration) => duration.seconds > 10,
    interval: timeSecond.every(10),
    format: (date) => format(date, "h:mm:ss")
  },
  {
    predicate: (duration) => duration.seconds,
    interval: timeSecond.every(1),
    format: (date) => format(date, "h:mm:ss")
  },
  {
    predicate: (duration) => true,
    // 0 or more milliseconds
    interval: timeMillisecond.every(100),
    format: (date) => format(date, "h:mm:ss.SSS")
  }
];
[
  {
    predicate: (duration) => duration == null,
    // Unknown
    interval: timeYear.every(1),
    // Better than rendering a lot of items
    format: (date) => date.toString()
  },
  {
    predicate: (duration) => duration.years,
    interval: timeMonth.every(1),
    format: (date) => formatDate(date, PeriodType.Month, { variant: "short" })
  },
  {
    predicate: (duration) => duration.days > 90,
    interval: timeMonth.every(1),
    format: (date) => formatDate(date, PeriodType.Month, { variant: "short" })
  },
  {
    predicate: (duration) => duration.days > 30,
    interval: timeWeek.every(1),
    format: (date) => formatDate(date, PeriodType.WeekSun, { variant: "short" })
  },
  {
    predicate: (duration) => duration.days > 7,
    interval: timeDay.every(1),
    format: (date) => formatDate(date, PeriodType.Day, { variant: "short" })
  },
  {
    predicate: (duration) => duration.days > 3,
    interval: timeHour.every(8),
    format: (date) => format(date, "h:mm a")
  },
  {
    predicate: (duration) => duration.days,
    interval: timeHour.every(1),
    format: (date) => format(date, "h:mm a")
  },
  {
    predicate: (duration) => duration.hours,
    interval: timeMinute.every(15),
    format: (date) => format(date, "h:mm a")
  },
  {
    predicate: (duration) => duration.minutes > 10,
    interval: timeMinute.every(10),
    format: (date) => format(date, "h:mm a")
  },
  {
    predicate: (duration) => duration.minutes > 2,
    interval: timeMinute.every(1),
    format: (date) => format(date, "h:mm a")
  },
  {
    predicate: (duration) => duration.minutes,
    interval: timeSecond.every(10),
    format: (date) => format(date, "h:mm:ss")
  },
  {
    predicate: (duration) => duration.seconds,
    interval: timeSecond.every(1),
    format: (date) => format(date, "h:mm:ss")
  },
  {
    predicate: (duration) => true,
    // 0 or more milliseconds
    interval: timeMillisecond.every(10),
    format: (date) => format(date, "h:mm:ss.SSS")
  }
];
export {
  ChartContext as C,
  TransformContext as T,
  renderRect as a,
  renderPathData as b,
  chartContext as c,
  accessor as d,
  cubicInOut as e,
  scaleInvert as f,
  renderCircle as g,
  getStringWidth as h,
  isScaleBand as i,
  renderText as j,
  cubicIn as k,
  chartDataArray as l,
  motionStore as m,
  defaultChartPadding as n,
  findRelatedData as o,
  resolveOptions as r,
  scaleCanvas as s,
  transformContext as t
};
