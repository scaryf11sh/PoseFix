import { s as spread_props, f as store_set, a as store_get, g as attr_style, j as slot, u as unsubscribe_stores, k as bind_props, l as sanitize_props, d as attr, b as attr_class, m as clsx, c as stringify, n as sanitize_slots, o as rest_props, p as attributes, e as ensure_array_like } from "../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import { s as setContext, g as getContext, e as escape_html, i as invalid_default_snippet } from "../../../chunks/context.js";
import "clsx";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import { c as chartContext, t as transformContext, s as scaleCanvas, m as motionStore, r as resolveOptions, a as renderRect, b as renderPathData, d as accessor, i as isScaleBand, e as cubicInOut, f as scaleInvert, C as ChartContext, T as TransformContext, g as renderCircle, h as getStringWidth, j as renderText, k as cubicIn, l as chartDataArray, n as defaultChartPadding, o as findRelatedData } from "../../../chunks/ticks.js";
import { uniqueId, Logger, localPoint, sortFunc, isLiteralObject, format, greatestAbs, notNull } from "@layerstack/utils";
import { cls } from "@layerstack/tailwind";
import "@layerstack/utils/env";
import { objectId } from "@layerstack/utils/object";
import "@layerstack/utils/serialize";
import "@layerstack/utils/rollup";
import { interpolatePath } from "d3-interpolate-path";
import { o as onDestroy, t as tick } from "../../../chunks/index-server.js";
import { merge } from "lodash-es";
import { Z as fallback } from "../../../chunks/utils2.js";
import { w as writable, d as derived } from "../../../chunks/index.js";
import { InternSet, ascending, max, min, bisector, extent, range, quantile, sum } from "d3-array";
import { scaleLinear, scaleSqrt, scaleBand, scaleTime, scaleOrdinal } from "d3-scale";
import { rgb } from "d3-color";
import { quadtree } from "d3-quadtree";
import { Delaunay } from "d3-delaunay";
import { geoVoronoi } from "d3-geo-voronoi";
import { curveLinearClosed, lineRadial, line, pointRadial, curveBumpX, curveBumpY, link, arc, pie } from "d3-shape";
import { geoPath, geoTransform } from "d3-geo";
import { path } from "d3-path";
import { quantize, interpolate, interpolateRound } from "d3-interpolate";
import "@dagrejs/dagre";
import "d3-tile";
import "d3-sankey";
import { a as $format } from "../../../chunks/runtime.js";
import "@tauri-apps/plugin-sql";
import "../../../chunks/user.js";
import { E as Eye } from "../../../chunks/eye.js";
import { C as Clock } from "../../../chunks/clock.js";
import { I as Icon } from "../../../chunks/Icon.js";
import { C as Calendar } from "../../../chunks/calendar.js";
import { A as Activity } from "../../../chunks/activity.js";
import { T as Trophy } from "../../../chunks/trophy.js";
function Lightbulb($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      [
        "path",
        {
          "d": "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"
        }
      ],
      ["path", { "d": "M9 18h6" }],
      ["path", { "d": "M10 22h4" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "lightbulb" },
      /**
       * @component @name Lightbulb
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTUgMTRjLjItMSAuNy0xLjcgMS41LTIuNSAxLS45IDEuNS0yLjIgMS41LTMuNUE2IDYgMCAwIDAgNiA4YzAgMSAuMiAyLjIgMS41IDMuNS43LjcgMS4zIDEuNSAxLjUgMi41IiAvPgogIDxwYXRoIGQ9Ik05IDE4aDYiIC8+CiAgPHBhdGggZD0iTTEwIDIyaDQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/lightbulb
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      props,
      {
        iconNode,
        children: ($$renderer3) => {
          props.children?.($$renderer3);
          $$renderer3.push(`<!---->`);
        },
        $$slots: { default: true }
      }
    ]));
  });
}
const linear = (x) => x;
function fade(node, { delay = 0, duration = 400, easing = linear } = {}) {
  const o = +getComputedStyle(node).opacity;
  return {
    delay,
    duration,
    easing,
    css: (t) => `opacity: ${t * o}`
  };
}
function canBeZero(val) {
  if (val === 0) {
    return true;
  }
  return val;
}
function makeAccessor(acc) {
  if (!canBeZero(acc)) return null;
  if (Array.isArray(acc)) {
    return (d) => acc.map((k) => {
      return typeof k !== "function" ? d[k] : k(d);
    });
  } else if (typeof acc !== "function") {
    return (d) => d[acc];
  }
  return acc;
}
function filterObject(obj, comparisonObj = {}) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => {
      return value !== void 0 && comparisonObj[key] === void 0;
    })
  );
}
function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}
function calcUniques(data, fields, sortOptions = {}) {
  if (!Array.isArray(data)) {
    throw new TypeError(
      `The first argument of calcUniques() must be an array. You passed in a ${typeof data}. If you got this error using the <LayerCake> component, consider passing a flat array to the \`flatData\` prop. More info: https://layercake.graphics/guide/#flatdata`
    );
  }
  if (Array.isArray(fields) || fields === void 0 || fields === null) {
    throw new TypeError(
      "The second argument of calcUniques() must be an object with field names as keys as accessor functions as values."
    );
  }
  const uniques = {};
  const keys = Object.keys(fields);
  const kl = keys.length;
  let i;
  let j;
  let k;
  let s;
  let acc;
  let val;
  let set;
  const dl = data.length;
  for (i = 0; i < kl; i += 1) {
    set = new InternSet();
    s = keys[i];
    acc = fields[s];
    for (j = 0; j < dl; j += 1) {
      val = acc(data[j]);
      if (Array.isArray(val)) {
        const vl = val.length;
        for (k = 0; k < vl; k += 1) {
          set.add(val[k]);
        }
      } else {
        set.add(val);
      }
    }
    const results = Array.from(set);
    if (sortOptions.sort === true || sortOptions[s] === true) {
      results.sort(ascending);
    }
    uniques[s] = results;
  }
  return uniques;
}
function calcExtents(data, fields) {
  if (!Array.isArray(data)) {
    throw new TypeError(
      `The first argument of calcExtents() must be an array. You passed in a ${typeof data}. If you got this error using the <LayerCake> component, consider passing a flat array to the \`flatData\` prop. More info: https://layercake.graphics/guide/#flatdata`
    );
  }
  if (Array.isArray(fields) || fields === void 0 || fields === null) {
    throw new TypeError(
      "The second argument of calcExtents() must be an object with field names as keys as accessor functions as values."
    );
  }
  const extents = {};
  const keys = Object.keys(fields);
  const kl = keys.length;
  let i;
  let j;
  let k;
  let s;
  let min2;
  let max2;
  let acc;
  let val;
  const dl = data.length;
  for (i = 0; i < kl; i += 1) {
    s = keys[i];
    acc = fields[s];
    min2 = null;
    max2 = null;
    for (j = 0; j < dl; j += 1) {
      val = acc(data[j], j);
      if (Array.isArray(val)) {
        const vl = val.length;
        for (k = 0; k < vl; k += 1) {
          if (val[k] !== false && val[k] !== void 0 && val[k] !== null && Number.isNaN(val[k]) === false) {
            if (min2 === null || val[k] < min2) {
              min2 = val[k];
            }
            if (max2 === null || val[k] > max2) {
              max2 = val[k];
            }
          }
        }
      } else if (val !== false && val !== void 0 && val !== null && Number.isNaN(val) === false) {
        if (min2 === null || val < min2) {
          min2 = val;
        }
        if (max2 === null || val > max2) {
          max2 = val;
        }
      }
    }
    extents[s] = [min2, max2];
  }
  return extents;
}
function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((k) => {
    return arr2.includes(k);
  });
}
function isOrdinalDomain(scale) {
  if (typeof scale.bandwidth === "function") {
    return true;
  }
  if (arraysEqual(Object.keys(scale), ["domain", "range", "unknown", "copy"])) {
    return true;
  }
  return false;
}
function calcScaleExtents(flatData, getters, activeScales) {
  const scaleGroups = Object.entries(activeScales).reduce(
    (groups, [k, scaleInfo]) => {
      const domainType = isOrdinalDomain(scaleInfo.scale) === true ? "ordinal" : "other";
      if (!groups[domainType]) groups[domainType] = {};
      groups[domainType][k] = getters[k];
      return groups;
    },
    { ordinal: false, other: false }
  );
  let extents = {};
  if (scaleGroups.ordinal) {
    const sortOptions = Object.fromEntries(
      Object.entries(activeScales).map(([k, scaleInfo]) => {
        return [k, scaleInfo.sort];
      })
    );
    extents = calcUniques(flatData, scaleGroups.ordinal, sortOptions);
  }
  if (scaleGroups.other) {
    extents = { ...extents, ...calcExtents(flatData, scaleGroups.other) };
  }
  return extents;
}
function partialDomain(domain = [], directive) {
  if (Array.isArray(directive) === true) {
    return directive.map((d, i) => {
      if (d === null) {
        return domain[i];
      }
      return d;
    });
  }
  return domain;
}
function calcDomain(s) {
  return function domainCalc([$extents, $domain]) {
    if (typeof $domain === "function") {
      $domain = $domain($extents[s]);
    }
    return $extents ? partialDomain($extents[s], $domain) : $domain;
  };
}
const defaultScales = {
  x: scaleLinear,
  y: scaleLinear,
  z: scaleLinear,
  r: scaleSqrt
};
function findScaleType(scale) {
  if (scale.constant) {
    return "symlog";
  }
  if (scale.base) {
    return "log";
  }
  if (scale.exponent) {
    if (scale.exponent() === 0.5) {
      return "sqrt";
    }
    return "pow";
  }
  return "other";
}
function identity(d) {
  return d;
}
function log(sign) {
  return (x) => Math.log(sign * x);
}
function exp(sign) {
  return (x) => sign * Math.exp(x);
}
function symlog(c) {
  return (x) => Math.sign(x) * Math.log1p(Math.abs(x / c));
}
function symexp(c) {
  return (x) => Math.sign(x) * Math.expm1(Math.abs(x)) * c;
}
function pow(exponent) {
  return function powFn(x) {
    return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
  };
}
function getPadFunctions(scale) {
  const scaleType = findScaleType(scale);
  if (scaleType === "log") {
    const sign = Math.sign(scale.domain()[0]);
    return { lift: log(sign), ground: exp(sign), scaleType };
  }
  if (scaleType === "pow") {
    const exponent = 1;
    return { lift: pow(exponent), ground: pow(1 / exponent), scaleType };
  }
  if (scaleType === "sqrt") {
    const exponent = 0.5;
    return { lift: pow(exponent), ground: pow(1 / exponent), scaleType };
  }
  if (scaleType === "symlog") {
    const constant = 1;
    return { lift: symlog(constant), ground: symexp(constant), scaleType };
  }
  return { lift: identity, ground: identity, scaleType };
}
function toTitleCase(str) {
  return str.replace(/^\w/, (d) => d.toUpperCase());
}
function f(name, modifier = "") {
  return `scale${toTitleCase(modifier)}${toTitleCase(name)}`;
}
function findScaleName(scale) {
  if (typeof scale.bandwidth === "function") {
    if (typeof scale.paddingInner === "function") {
      return f("band");
    }
    return f("point");
  }
  if (arraysEqual(Object.keys(scale), ["domain", "range", "unknown", "copy"])) {
    return f("ordinal");
  }
  let modifier = "";
  if (scale.interpolator) {
    if (scale.domain().length === 3) {
      modifier = "diverging";
    } else {
      modifier = "sequential";
    }
  }
  if (scale.quantiles) {
    return f("quantile", modifier);
  }
  if (scale.thresholds) {
    return f("quantize", modifier);
  }
  if (scale.constant) {
    return f("symlog", modifier);
  }
  if (scale.base) {
    return f("log", modifier);
  }
  if (scale.exponent) {
    if (scale.exponent() === 0.5) {
      return f("sqrt", modifier);
    }
    return f("pow", modifier);
  }
  if (arraysEqual(Object.keys(scale), ["domain", "range", "invertExtent", "unknown", "copy"])) {
    return f("threshold");
  }
  if (arraysEqual(Object.keys(scale), [
    "invert",
    "range",
    "domain",
    "unknown",
    "copy",
    "ticks",
    "tickFormat",
    "nice"
  ])) {
    return f("identity");
  }
  if (arraysEqual(Object.keys(scale), [
    "invert",
    "domain",
    "range",
    "rangeRound",
    "round",
    "clamp",
    "unknown",
    "copy",
    "ticks",
    "tickFormat",
    "nice"
  ])) {
    return f("radial");
  }
  if (modifier) {
    return f(modifier);
  }
  if (scale.domain()[0] instanceof Date) {
    const d = /* @__PURE__ */ new Date();
    let s;
    d.getDay = () => s = "time";
    d.getUTCDay = () => s = "utc";
    scale.tickFormat(0, "%a")(d);
    return f(s);
  }
  return f("linear");
}
const unpaddable = ["scaleThreshold", "scaleQuantile", "scaleQuantize", "scaleSequentialQuantile"];
function padScale(scale, padding) {
  if (typeof scale.range !== "function") {
    throw new Error("Scale method `range` must be a function");
  }
  if (typeof scale.domain !== "function") {
    throw new Error("Scale method `domain` must be a function");
  }
  if (!Array.isArray(padding) || unpaddable.includes(findScaleName(scale))) {
    return scale.domain();
  }
  if (isOrdinalDomain(scale) === true) {
    return scale.domain();
  }
  const { lift, ground } = getPadFunctions(scale);
  const d0 = scale.domain()[0];
  const isTime = Object.prototype.toString.call(d0) === "[object Date]";
  const [d1, d2] = scale.domain().map((d) => {
    return isTime ? lift(d.getTime()) : lift(d);
  });
  const [r1, r2] = scale.range();
  const paddingLeft = padding[0] || 0;
  const paddingRight = padding[1] || 0;
  const step = (d2 - d1) / (Math.abs(r2 - r1) - paddingLeft - paddingRight);
  return [d1 - paddingLeft * step, paddingRight * step + d2].map((d) => {
    return isTime ? ground(new Date(d)) : ground(d);
  });
}
function calcBaseRange(s, width, height, reverse, percentRange) {
  let min2;
  let max2;
  if (percentRange === true) {
    min2 = 0;
    max2 = 100;
  } else {
    min2 = s === "r" ? 1 : 0;
    max2 = s === "y" ? height : s === "r" ? 25 : width;
  }
  return reverse === true ? [max2, min2] : [min2, max2];
}
function getDefaultRange(s, width, height, reverse, range2, percentRange) {
  return !range2 ? calcBaseRange(s, width, height, reverse, percentRange) : typeof range2 === "function" ? range2({ width, height }) : range2;
}
function createScale(s) {
  return function scaleCreator([
    $scale,
    $extents,
    $domain,
    $padding,
    $nice,
    $reverse,
    $width,
    $height,
    $range,
    $percentScale
  ]) {
    if ($extents === null) {
      return null;
    }
    const defaultRange = getDefaultRange(s, $width, $height, $reverse, $range, $percentScale);
    const scale = $scale === defaultScales[s] ? $scale() : $scale.copy();
    scale.domain($domain);
    if (!scale.interpolator || typeof scale.interpolator === "function" && scale.interpolator().name.startsWith("identity")) {
      scale.range(defaultRange);
    }
    if ($padding) {
      scale.domain(padScale(scale, $padding));
    }
    if ($nice === true || typeof $nice === "number") {
      if (typeof scale.nice === "function") {
        scale.nice(typeof $nice === "number" ? $nice : void 0);
      } else {
        console.error(
          `[Layer Cake] You set \`${s}Nice: true\` but the ${s}Scale does not have a \`.nice\` method. Ignoring...`
        );
      }
    }
    return scale;
  };
}
function createGetter([$acc, $scale]) {
  return (d, i) => {
    const val = $acc(d, i);
    if (Array.isArray(val)) {
      return val.map((v) => $scale(v));
    }
    return $scale(val);
  };
}
function getRange([$scale]) {
  if (typeof $scale === "function") {
    if (typeof $scale.range === "function") {
      return $scale.range();
    }
    console.error("[LayerCake] Your scale doesn't have a `.range` method?");
  }
  return null;
}
const indent = "    ";
function getRgb(clr) {
  const { r, g, b, opacity: o } = rgb(clr);
  if (![r, g, b].every((c) => c >= 0 && c <= 255)) {
    return false;
  }
  return { r, g, b, o };
}
function contrast({ r, g, b }) {
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.6 ? "black" : "white";
}
function printDebug(obj) {
  console.log("/********* LayerCake Debug ************/");
  console.log("Bounding box:");
  printObject(obj.boundingBox);
  console.log("Data:");
  console.log(indent, obj.data);
  if (obj.flatData) {
    console.log("flatData:");
    console.log(indent, obj.flatData);
  }
  console.log("Scales:");
  Object.keys(obj.activeGetters).forEach((g) => {
    printScale(g, obj[`${g}Scale`], obj[g]);
  });
  console.log("/************ End LayerCake Debug ***************/\n");
}
function printObject(obj) {
  Object.entries(obj).forEach(([key, value]) => {
    console.log(`${indent}${key}:`, value);
  });
}
function printScale(s, scale, acc) {
  const scaleName = findScaleName(scale);
  console.log(`${indent}${s}:`);
  console.log(`${indent}${indent}Accessor: "${acc.toString()}"`);
  console.log(`${indent}${indent}Type: ${scaleName}`);
  printValues(scale, "domain");
  printValues(scale, "range", " ");
}
function printValues(scale, method, extraSpace = "") {
  const values = scale[method]();
  const colorValues = colorizeArray(values);
  if (colorValues) {
    printColorArray(colorValues, method, values);
  } else {
    console.log(`${indent}${indent}${toTitleCase(method)}:${extraSpace}`, values);
  }
}
function printColorArray(colorValues, method, values) {
  console.log(
    `${indent}${indent}${toTitleCase(method)}:    %cArray%c(${values.length}) ` + colorValues[0] + "%c ]",
    "color: #1377e4",
    "color: #737373",
    "color: #1478e4",
    ...colorValues[1],
    "color: #1478e4"
  );
}
function colorizeArray(arr) {
  const colors = [];
  const a = arr.map((d, i) => {
    const rgbo = getRgb(d);
    if (rgbo !== false) {
      colors.push(rgbo);
      const space = i === arr.length - 1 ? " " : "";
      return `%c ${d}${space}`;
    }
    return d;
  });
  if (colors.length) {
    return [
      `%c[ ${a.join(", ")}`,
      colors.map(
        (d) => `background-color: rgba(${d.r}, ${d.g}, ${d.b}, ${d.o}); color:${contrast(d)};`
      )
    ];
  }
  return null;
}
function LayerCake($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let yReverseValue, context;
    const printDebug_debounced = debounce(printDebug, 200);
    let ssr = fallback($$props["ssr"], false);
    let pointerEvents = fallback($$props["pointerEvents"], true);
    let position = fallback($$props["position"], "relative");
    let percentRange = fallback($$props["percentRange"], false);
    let width = fallback($$props["width"], void 0);
    let height = fallback($$props["height"], void 0);
    let containerWidth = fallback($$props["containerWidth"], width || 100);
    let containerHeight = fallback($$props["containerHeight"], height || 100);
    let element = fallback($$props["element"], void 0);
    let x = fallback($$props["x"], void 0);
    let y = fallback($$props["y"], void 0);
    let z = fallback($$props["z"], void 0);
    let r = fallback($$props["r"], void 0);
    let data = fallback($$props["data"], () => [], true);
    let xDomain = fallback($$props["xDomain"], void 0);
    let yDomain = fallback($$props["yDomain"], void 0);
    let zDomain = fallback($$props["zDomain"], void 0);
    let rDomain = fallback($$props["rDomain"], void 0);
    let xNice = fallback($$props["xNice"], false);
    let yNice = fallback($$props["yNice"], false);
    let zNice = fallback($$props["zNice"], false);
    let rNice = fallback($$props["rNice"], false);
    let xPadding = fallback($$props["xPadding"], void 0);
    let yPadding = fallback($$props["yPadding"], void 0);
    let zPadding = fallback($$props["zPadding"], void 0);
    let rPadding = fallback($$props["rPadding"], void 0);
    let xScale = fallback($$props["xScale"], () => defaultScales.x, true);
    let yScale = fallback($$props["yScale"], () => defaultScales.y, true);
    let zScale = fallback($$props["zScale"], () => defaultScales.z, true);
    let rScale = fallback($$props["rScale"], () => defaultScales.r, true);
    let xRange = fallback($$props["xRange"], void 0);
    let yRange = fallback($$props["yRange"], void 0);
    let zRange = fallback($$props["zRange"], void 0);
    let rRange = fallback($$props["rRange"], void 0);
    let xReverse = fallback($$props["xReverse"], false);
    let yReverse = fallback($$props["yReverse"], void 0);
    let zReverse = fallback($$props["zReverse"], false);
    let rReverse = fallback($$props["rReverse"], false);
    let xDomainSort = fallback($$props["xDomainSort"], true);
    let yDomainSort = fallback($$props["yDomainSort"], true);
    let zDomainSort = fallback($$props["zDomainSort"], true);
    let rDomainSort = fallback($$props["rDomainSort"], true);
    let padding = fallback($$props["padding"], () => ({}), true);
    let extents = fallback($$props["extents"], () => ({}), true);
    let flatData = fallback($$props["flatData"], void 0);
    let custom = fallback($$props["custom"], () => ({}), true);
    let debug = fallback($$props["debug"], false);
    let verbose = fallback($$props["verbose"], true);
    let isMounted = false;
    const config = {};
    const _percentRange = writable(percentRange);
    const _containerWidth = writable(containerWidth);
    const _containerHeight = writable(containerHeight);
    const _extents = writable(filterObject(extents));
    const _data = writable(data);
    const _flatData = writable(flatData || data);
    const _padding = writable(padding);
    const _x = writable(makeAccessor(x));
    const _y = writable(makeAccessor(y));
    const _z = writable(makeAccessor(z));
    const _r = writable(makeAccessor(r));
    const _xDomain = writable(xDomain);
    const _yDomain = writable(yDomain);
    const _zDomain = writable(zDomain);
    const _rDomain = writable(rDomain);
    const _xNice = writable(xNice);
    const _yNice = writable(yNice);
    const _zNice = writable(zNice);
    const _rNice = writable(rNice);
    const _xReverse = writable(xReverse);
    const _yReverse = writable(yReverseValue);
    const _zReverse = writable(zReverse);
    const _rReverse = writable(rReverse);
    const _xPadding = writable(xPadding);
    const _yPadding = writable(yPadding);
    const _zPadding = writable(zPadding);
    const _rPadding = writable(rPadding);
    const _xRange = writable(xRange);
    const _yRange = writable(yRange);
    const _zRange = writable(zRange);
    const _rRange = writable(rRange);
    const _xScale = writable(xScale);
    const _yScale = writable(yScale);
    const _zScale = writable(zScale);
    const _rScale = writable(rScale);
    const _xDomainSort = writable(xDomainSort);
    const _yDomainSort = writable(yDomainSort);
    const _zDomainSort = writable(zDomainSort);
    const _rDomainSort = writable(rDomainSort);
    const _config = writable(config);
    const _custom = writable(custom);
    const activeGetters_d = derived([_x, _y, _z, _r], ([$x, $y, $z, $r]) => {
      const obj = {};
      if ($x) {
        obj.x = $x;
      }
      if ($y) {
        obj.y = $y;
      }
      if ($z) {
        obj.z = $z;
      }
      if ($r) {
        obj.r = $r;
      }
      return obj;
    });
    const padding_d = derived([_padding, _containerWidth, _containerHeight], ([$padding]) => {
      const defaultPadding = { top: 0, right: 0, bottom: 0, left: 0 };
      return Object.assign(defaultPadding, $padding);
    });
    const box_d = derived([_containerWidth, _containerHeight, padding_d], ([$containerWidth, $containerHeight, $padding]) => {
      const b = {};
      b.top = $padding.top;
      b.right = $containerWidth - $padding.right;
      b.bottom = $containerHeight - $padding.bottom;
      b.left = $padding.left;
      b.width = b.right - b.left;
      b.height = b.bottom - b.top;
      if (verbose === true) {
        if (b.width <= 0 && isMounted === true) ;
        if (b.height <= 0 && isMounted === true) ;
      }
      return b;
    });
    const width_d = derived([box_d], ([$box]) => {
      return $box.width;
    });
    const height_d = derived([box_d], ([$box]) => {
      return $box.height;
    });
    const extents_d = derived(
      [
        _flatData,
        activeGetters_d,
        _extents,
        _xScale,
        _yScale,
        _rScale,
        _zScale,
        _xDomainSort,
        _yDomainSort,
        _zDomainSort,
        _rDomainSort
      ],
      ([
        $flatData,
        $activeGetters,
        $extents,
        $_xScale,
        $_yScale,
        $_rScale,
        $_zScale,
        $_xDomainSort,
        $_yDomainSort,
        $_zDomainSort,
        $_rDomainSort
      ]) => {
        const scaleLookup = {
          x: { scale: $_xScale, sort: $_xDomainSort },
          y: { scale: $_yScale, sort: $_yDomainSort },
          r: { scale: $_rScale, sort: $_rDomainSort },
          z: { scale: $_zScale, sort: $_zDomainSort }
        };
        const getters = filterObject($activeGetters, $extents);
        const activeScales = Object.fromEntries(Object.keys(getters).map((k) => [k, scaleLookup[k]]));
        if (Object.keys(getters).length > 0) {
          const calculatedExtents = calcScaleExtents($flatData, getters, activeScales);
          return { ...calculatedExtents, ...$extents };
        } else {
          return {};
        }
      }
    );
    const xDomain_d = derived([extents_d, _xDomain], calcDomain("x"));
    const yDomain_d = derived([extents_d, _yDomain], calcDomain("y"));
    const zDomain_d = derived([extents_d, _zDomain], calcDomain("z"));
    const rDomain_d = derived([extents_d, _rDomain], calcDomain("r"));
    const xScale_d = derived(
      [
        _xScale,
        extents_d,
        xDomain_d,
        _xPadding,
        _xNice,
        _xReverse,
        width_d,
        height_d,
        _xRange,
        _percentRange
      ],
      createScale("x")
    );
    const xGet_d = derived([_x, xScale_d], createGetter);
    const yScale_d = derived(
      [
        _yScale,
        extents_d,
        yDomain_d,
        _yPadding,
        _yNice,
        _yReverse,
        width_d,
        height_d,
        _yRange,
        _percentRange
      ],
      createScale("y")
    );
    const yGet_d = derived([_y, yScale_d], createGetter);
    const zScale_d = derived(
      [
        _zScale,
        extents_d,
        zDomain_d,
        _zPadding,
        _zNice,
        _zReverse,
        width_d,
        height_d,
        _zRange,
        _percentRange
      ],
      createScale("z")
    );
    const zGet_d = derived([_z, zScale_d], createGetter);
    const rScale_d = derived(
      [
        _rScale,
        extents_d,
        rDomain_d,
        _rPadding,
        _rNice,
        _rReverse,
        width_d,
        height_d,
        _rRange,
        _percentRange
      ],
      createScale("r")
    );
    const rGet_d = derived([_r, rScale_d], createGetter);
    const xDomain_d_possibly_nice = derived(xScale_d, ($xScale_d) => $xScale_d.domain());
    const yDomain_d_possibly_nice = derived(yScale_d, ($yScale_d) => $yScale_d.domain());
    const zDomain_d_possibly_nice = derived(zScale_d, ($zScale_d) => $zScale_d.domain());
    const rDomain_d_possibly_nice = derived(rScale_d, ($rScale_d) => $rScale_d.domain());
    const xRange_d = derived([xScale_d], getRange);
    const yRange_d = derived([yScale_d], getRange);
    const zRange_d = derived([zScale_d], getRange);
    const rRange_d = derived([rScale_d], getRange);
    const aspectRatio_d = derived([width_d, height_d], ([$width, $height]) => {
      return $width / $height;
    });
    yReverseValue = typeof yReverse === "undefined" ? typeof yScale.bandwidth === "function" ? false : true : yReverse;
    if (x) config.x = x;
    if (y) config.y = y;
    if (z) config.z = z;
    if (r) config.r = r;
    if (xDomain) config.xDomain = xDomain;
    if (yDomain) config.yDomain = yDomain;
    if (zDomain) config.zDomain = zDomain;
    if (rDomain) config.rDomain = rDomain;
    if (xRange) config.xRange = xRange;
    if (yRange) config.yRange = yRange;
    if (zRange) config.zRange = zRange;
    if (rRange) config.rRange = rRange;
    store_set(_percentRange, percentRange);
    store_set(_containerWidth, containerWidth);
    store_set(_containerHeight, containerHeight);
    store_set(_extents, filterObject(extents));
    store_set(_data, data);
    store_set(_flatData, flatData || data);
    store_set(_padding, padding);
    store_set(_x, makeAccessor(x));
    store_set(_y, makeAccessor(y));
    store_set(_z, makeAccessor(z));
    store_set(_r, makeAccessor(r));
    store_set(_xDomain, xDomain);
    store_set(_yDomain, yDomain);
    store_set(_zDomain, zDomain);
    store_set(_rDomain, rDomain);
    store_set(_xNice, xNice);
    store_set(_yNice, yNice);
    store_set(_zNice, zNice);
    store_set(_rNice, rNice);
    store_set(_xReverse, xReverse);
    store_set(_yReverse, yReverseValue);
    store_set(_zReverse, zReverse);
    store_set(_rReverse, rReverse);
    store_set(_xPadding, xPadding);
    store_set(_yPadding, yPadding);
    store_set(_zPadding, zPadding);
    store_set(_rPadding, rPadding);
    store_set(_xRange, xRange);
    store_set(_yRange, yRange);
    store_set(_zRange, zRange);
    store_set(_rRange, rRange);
    store_set(_xScale, xScale);
    store_set(_yScale, yScale);
    store_set(_zScale, zScale);
    store_set(_rScale, rScale);
    store_set(_custom, custom);
    store_set(_config, config);
    context = {
      activeGetters: activeGetters_d,
      width: width_d,
      height: height_d,
      percentRange: _percentRange,
      aspectRatio: aspectRatio_d,
      containerWidth: _containerWidth,
      containerHeight: _containerHeight,
      x: _x,
      y: _y,
      z: _z,
      r: _r,
      custom: _custom,
      data: _data,
      xNice: _xNice,
      yNice: _yNice,
      zNice: _zNice,
      rNice: _rNice,
      xDomainSort: _xDomainSort,
      yDomainSort: _yDomainSort,
      zDomainSort: _zDomainSort,
      rDomainSort: _rDomainSort,
      xReverse: _xReverse,
      yReverse: _yReverse,
      zReverse: _zReverse,
      rReverse: _rReverse,
      xPadding: _xPadding,
      yPadding: _yPadding,
      zPadding: _zPadding,
      rPadding: _rPadding,
      padding: padding_d,
      flatData: _flatData,
      extents: extents_d,
      xDomain: xDomain_d_possibly_nice,
      yDomain: yDomain_d_possibly_nice,
      zDomain: zDomain_d_possibly_nice,
      rDomain: rDomain_d_possibly_nice,
      xRange: xRange_d,
      yRange: yRange_d,
      zRange: zRange_d,
      rRange: rRange_d,
      config: _config,
      xScale: xScale_d,
      xGet: xGet_d,
      yScale: yScale_d,
      yGet: yGet_d,
      zScale: zScale_d,
      zGet: zGet_d,
      rScale: rScale_d,
      rGet: rGet_d
    };
    setContext("LayerCake", context);
    if (store_get($$store_subs ??= {}, "$box_d", box_d) && debug === true && (ssr === true || typeof window !== "undefined")) {
      printDebug_debounced({
        data: store_get($$store_subs ??= {}, "$_data", _data),
        flatData: typeof flatData !== "undefined" ? store_get($$store_subs ??= {}, "$_flatData", _flatData) : null,
        boundingBox: store_get($$store_subs ??= {}, "$box_d", box_d),
        activeGetters: store_get($$store_subs ??= {}, "$activeGetters_d", activeGetters_d),
        x: config.x,
        y: config.y,
        z: config.z,
        r: config.r,
        xScale: store_get($$store_subs ??= {}, "$xScale_d", xScale_d),
        yScale: store_get($$store_subs ??= {}, "$yScale_d", yScale_d),
        zScale: store_get($$store_subs ??= {}, "$zScale_d", zScale_d),
        rScale: store_get($$store_subs ??= {}, "$rScale_d", rScale_d)
      });
    }
    if (ssr === true || typeof window !== "undefined") {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="layercake-container svelte-812kmt"${attr_style("", {
        position,
        top: position === "absolute" ? "0" : null,
        right: position === "absolute" ? "0" : null,
        bottom: position === "absolute" ? "0" : null,
        left: position === "absolute" ? "0" : null,
        "pointer-events": pointerEvents === false ? "none" : null
      })}><!--[-->`);
      slot(
        $$renderer2,
        $$props,
        "default",
        {
          element,
          width: store_get($$store_subs ??= {}, "$width_d", width_d),
          height: store_get($$store_subs ??= {}, "$height_d", height_d),
          aspectRatio: store_get($$store_subs ??= {}, "$aspectRatio_d", aspectRatio_d),
          containerWidth: store_get($$store_subs ??= {}, "$_containerWidth", _containerWidth),
          containerHeight: store_get($$store_subs ??= {}, "$_containerHeight", _containerHeight),
          activeGetters: store_get($$store_subs ??= {}, "$activeGetters_d", activeGetters_d),
          percentRange: store_get($$store_subs ??= {}, "$_percentRange", _percentRange),
          x: store_get($$store_subs ??= {}, "$_x", _x),
          y: store_get($$store_subs ??= {}, "$_y", _y),
          z: store_get($$store_subs ??= {}, "$_z", _z),
          r: store_get($$store_subs ??= {}, "$_r", _r),
          custom: store_get($$store_subs ??= {}, "$_custom", _custom),
          data: store_get($$store_subs ??= {}, "$_data", _data),
          xNice: store_get($$store_subs ??= {}, "$_xNice", _xNice),
          yNice: store_get($$store_subs ??= {}, "$_yNice", _yNice),
          zNice: store_get($$store_subs ??= {}, "$_zNice", _zNice),
          rNice: store_get($$store_subs ??= {}, "$_rNice", _rNice),
          xDomainSort: store_get($$store_subs ??= {}, "$_xDomainSort", _xDomainSort),
          yDomainSort: store_get($$store_subs ??= {}, "$_yDomainSort", _yDomainSort),
          zDomainSort: store_get($$store_subs ??= {}, "$_zDomainSort", _zDomainSort),
          rDomainSort: store_get($$store_subs ??= {}, "$_rDomainSort", _rDomainSort),
          xReverse: store_get($$store_subs ??= {}, "$_xReverse", _xReverse),
          yReverse: store_get($$store_subs ??= {}, "$_yReverse", _yReverse),
          zReverse: store_get($$store_subs ??= {}, "$_zReverse", _zReverse),
          rReverse: store_get($$store_subs ??= {}, "$_rReverse", _rReverse),
          xPadding: store_get($$store_subs ??= {}, "$_xPadding", _xPadding),
          yPadding: store_get($$store_subs ??= {}, "$_yPadding", _yPadding),
          zPadding: store_get($$store_subs ??= {}, "$_zPadding", _zPadding),
          rPadding: store_get($$store_subs ??= {}, "$_rPadding", _rPadding),
          padding: store_get($$store_subs ??= {}, "$padding_d", padding_d),
          flatData: store_get($$store_subs ??= {}, "$_flatData", _flatData),
          extents: store_get($$store_subs ??= {}, "$extents_d", extents_d),
          xDomain: store_get($$store_subs ??= {}, "$xDomain_d", xDomain_d),
          yDomain: store_get($$store_subs ??= {}, "$yDomain_d", yDomain_d),
          zDomain: store_get($$store_subs ??= {}, "$zDomain_d", zDomain_d),
          rDomain: store_get($$store_subs ??= {}, "$rDomain_d", rDomain_d),
          xRange: store_get($$store_subs ??= {}, "$xRange_d", xRange_d),
          yRange: store_get($$store_subs ??= {}, "$yRange_d", yRange_d),
          zRange: store_get($$store_subs ??= {}, "$zRange_d", zRange_d),
          rRange: store_get($$store_subs ??= {}, "$rRange_d", rRange_d),
          config: store_get($$store_subs ??= {}, "$_config", _config),
          xScale: store_get($$store_subs ??= {}, "$xScale_d", xScale_d),
          xGet: store_get($$store_subs ??= {}, "$xGet_d", xGet_d),
          yScale: store_get($$store_subs ??= {}, "$yScale_d", yScale_d),
          yGet: store_get($$store_subs ??= {}, "$yGet_d", yGet_d),
          zScale: store_get($$store_subs ??= {}, "$zScale_d", zScale_d),
          zGet: store_get($$store_subs ??= {}, "$zGet_d", zGet_d),
          rScale: store_get($$store_subs ??= {}, "$rScale_d", rScale_d),
          rGet: store_get($$store_subs ??= {}, "$rGet_d", rGet_d)
        },
        null
      );
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, {
      ssr,
      pointerEvents,
      position,
      percentRange,
      width,
      height,
      containerWidth,
      containerHeight,
      element,
      x,
      y,
      z,
      r,
      data,
      xDomain,
      yDomain,
      zDomain,
      rDomain,
      xNice,
      yNice,
      zNice,
      rNice,
      xPadding,
      yPadding,
      zPadding,
      rPadding,
      xScale,
      yScale,
      zScale,
      rScale,
      xRange,
      yRange,
      zRange,
      rRange,
      xReverse,
      yReverse,
      zReverse,
      rReverse,
      xDomainSort,
      yDomainSort,
      zDomainSort,
      rDomainSort,
      padding,
      extents,
      flatData,
      custom,
      debug,
      verbose
    });
  });
}
function raise(el) {
  if (el.nextSibling) el.parentNode.appendChild(el);
}
function uniqueStore(initialValues) {
  const store = writable(new Set(initialValues ?? []));
  return {
    ...store,
    add(value) {
      store.update((set) => {
        set.add(value);
        return set;
      });
    },
    addEach(values) {
      store.update((set) => {
        values.forEach((value) => set.add(value));
        return set;
      });
    },
    delete(value) {
      store.update((set) => {
        set.delete(value);
        return set;
      });
    },
    toggle(value) {
      store.update((set) => {
        if (set.has(value)) {
          set.delete(value);
        } else {
          set.add(value);
        }
        return set;
      });
    }
  };
}
function selectionStore(props = {}) {
  const selected = uniqueStore(props.initial ?? []);
  const all = writable(props.all ?? []);
  const single = props.single ?? false;
  const max2 = props.max;
  return derived([selected, all], ([$selected, $all]) => {
    function setSelected(values) {
      selected.update(($selected2) => {
        if (max2 == null || values.length < max2) {
          return new Set(values);
        } else {
          return $selected2;
        }
      });
    }
    function toggleSelected(value) {
      selected.update(($selected2) => {
        if ($selected2.has(value)) {
          return new Set([...$selected2].filter((v) => v != value));
        } else if (single) {
          return /* @__PURE__ */ new Set([value]);
        } else {
          if (max2 == null || $selected2.size < max2) {
            return $selected2.add(value);
          } else {
            return $selected2;
          }
        }
      });
    }
    function toggleAll() {
      let values;
      if (isAllSelected()) {
        values = [...$selected].filter((v) => !$all.includes(v));
      } else {
        values = [...$selected, ...$all];
      }
      selected.set(new Set(values));
    }
    function isSelected(value) {
      return $selected.has(value);
    }
    function isAllSelected() {
      return $all.every((v) => $selected.has(v));
    }
    function isAnySelected() {
      return $all.some((v) => $selected.has(v));
    }
    function isMaxSelected() {
      return max2 != null ? $selected.size >= max2 : false;
    }
    function isDisabled(value) {
      return !isSelected(value) && isMaxSelected();
    }
    function clear() {
      selected.set(/* @__PURE__ */ new Set());
    }
    function reset() {
      selected.set(new Set(props.initial ?? []));
    }
    const selectedArr = [...$selected.values()];
    return {
      selected: single ? selectedArr[0] ?? null : selectedArr,
      setSelected,
      toggleSelected,
      isSelected,
      isDisabled,
      toggleAll,
      isAllSelected,
      isAnySelected,
      isMaxSelected,
      clear,
      reset,
      all
    };
  });
}
const geoContextKey = /* @__PURE__ */ Symbol();
function geoContext() {
  return getContext(geoContextKey);
}
function setGeoContext(geo) {
  setContext(geoContextKey, geo);
}
function GeoContext($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let fitSizeRange;
    const { width, height } = chartContext();
    let projection = fallback($$props["projection"], void 0);
    let fitGeojson = fallback($$props["fitGeojson"], void 0);
    let fixedAspectRatio = fallback($$props["fixedAspectRatio"], void 0);
    let clipAngle = fallback($$props["clipAngle"], void 0);
    let clipExtent = fallback($$props["clipExtent"], void 0);
    let rotate = fallback($$props["rotate"], void 0);
    let scale = fallback($$props["scale"], void 0);
    let translate = fallback($$props["translate"], void 0);
    let center = fallback($$props["center"], void 0);
    let applyTransform = fallback($$props["applyTransform"], () => [], true);
    let reflectX = fallback($$props["reflectX"], void 0);
    let reflectY = fallback($$props["reflectY"], void 0);
    let geo = fallback($$props["geo"], () => writable(projection?.()), true);
    setGeoContext(geo);
    const { scale: transformScale, translate: transformTranslate } = transformContext();
    fitSizeRange = fixedAspectRatio ? [100, 100 / fixedAspectRatio] : [
      store_get($$store_subs ??= {}, "$width", width),
      store_get($$store_subs ??= {}, "$height", height)
    ];
    if (projection) {
      const _projection = projection();
      if (fitGeojson && "fitSize" in _projection) {
        _projection.fitSize(fitSizeRange, fitGeojson);
      }
      if ("scale" in _projection) {
        if (scale) {
          _projection.scale(scale);
        }
        if (applyTransform.includes("scale")) {
          _projection.scale(store_get($$store_subs ??= {}, "$transformScale", transformScale));
        }
      }
      if ("rotate" in _projection) {
        if (rotate) {
          _projection.rotate([rotate.yaw, rotate.pitch, rotate.roll]);
        }
        if (applyTransform.includes("rotate")) {
          _projection.rotate([
            store_get($$store_subs ??= {}, "$transformTranslate", transformTranslate).x,
            // yaw
            store_get($$store_subs ??= {}, "$transformTranslate", transformTranslate).y
            // pitch
            // TODO: `roll` from `transformContext`?
          ]);
        }
      }
      if ("translate" in _projection) {
        if (translate) {
          _projection.translate(translate);
        }
        if (applyTransform.includes("translate")) {
          _projection.translate([
            store_get($$store_subs ??= {}, "$transformTranslate", transformTranslate).x,
            store_get($$store_subs ??= {}, "$transformTranslate", transformTranslate).y
          ]);
        }
      }
      if (center && "center" in _projection) {
        _projection.center(center);
      }
      if (reflectX) {
        _projection.reflectX(reflectX);
      }
      if (reflectY) {
        _projection.reflectY(reflectY);
      }
      if (clipAngle && "clipAngle" in _projection) {
        _projection.clipAngle(clipAngle);
      }
      if (clipExtent && "clipExtent" in _projection) {
        _projection.clipExtent(clipExtent);
      }
      geo.set(_projection);
    }
    $$renderer2.push(`<!--[-->`);
    slot($$renderer2, $$props, "default", { projection: store_get($$store_subs ??= {}, "$geo", geo) }, null);
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, {
      projection,
      fitGeojson,
      fixedAspectRatio,
      clipAngle,
      clipExtent,
      rotate,
      scale,
      translate,
      center,
      applyTransform,
      reflectX,
      reflectY,
      geo
    });
  });
}
function Svg($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let element = fallback($$props["element"], void 0);
    let innerElement = fallback($$props["innerElement"], void 0);
    let zIndex = fallback($$props["zIndex"], void 0);
    let pointerEvents = fallback($$props["pointerEvents"], void 0);
    let viewBox = fallback($$props["viewBox"], void 0);
    let label = fallback($$props["label"], void 0);
    let labelledBy = fallback($$props["labelledBy"], void 0);
    let describedBy = fallback($$props["describedBy"], void 0);
    let title = fallback($$props["title"], void 0);
    let center = fallback($$props["center"], false);
    let ignoreTransform = fallback($$props["ignoreTransform"], false);
    const { containerWidth, containerHeight, width, height, padding } = chartContext();
    const { mode, scale, translate } = transformContext();
    let transform = "";
    setRenderContext("svg");
    if (mode === "canvas" && !ignoreTransform) {
      transform = `translate(${store_get($$store_subs ??= {}, "$translate", translate).x},${store_get($$store_subs ??= {}, "$translate", translate).y}) scale(${store_get($$store_subs ??= {}, "$scale", scale)})`;
    } else if (center) {
      transform = `translate(${center === "x" || center === true ? store_get($$store_subs ??= {}, "$width", width) / 2 : 0}, ${center === "y" || center === true ? store_get($$store_subs ??= {}, "$height", height) / 2 : 0})`;
    }
    $$renderer2.push(`<svg${attr("viewBox", viewBox)}${attr("width", store_get($$store_subs ??= {}, "$containerWidth", containerWidth))}${attr("height", store_get($$store_subs ??= {}, "$containerHeight", containerHeight))}${attr_class(clsx(cls("layercake-layout-svg", "absolute top-0 left-0 overflow-visible", pointerEvents === false && "pointer-events-none", $$sanitized_props.class)))}${attr("aria-label", label)}${attr("aria-labelledby", labelledBy)}${attr("aria-describedby", describedBy)} role="figure"${attr_style("", { "z-index": zIndex })}><!--[-->`);
    slot($$renderer2, $$props, "title", {}, () => {
      if (title) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<title>${escape_html(title)}</title>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    });
    $$renderer2.push(`<!--]--><defs><!--[-->`);
    slot($$renderer2, $$props, "defs", {}, null);
    $$renderer2.push(`<!--]--></defs><g class="layercake-layout-svg_g"${attr("transform", `translate(${stringify(store_get($$store_subs ??= {}, "$padding", padding).left)}, ${stringify(store_get($$store_subs ??= {}, "$padding", padding).top)})`)}>`);
    if (transform) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<g${attr("transform", transform)}><!--[-->`);
      slot($$renderer2, $$props, "default", { element }, null);
      $$renderer2.push(`<!--]--></g>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<!--[-->`);
      slot($$renderer2, $$props, "default", { element }, null);
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></g></svg>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, {
      element,
      innerElement,
      zIndex,
      pointerEvents,
      viewBox,
      label,
      labelledBy,
      describedBy,
      title,
      center,
      ignoreTransform
    });
  });
}
function ClipPath($$renderer, $$props) {
  const $$slots = sanitize_slots($$props);
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["id", "useId", "disabled"]);
  $$renderer.component(($$renderer2) => {
    let id = fallback($$props["id"], () => uniqueId("clipPath-"), true);
    let useId = fallback($$props["useId"], void 0);
    let disabled = fallback($$props["disabled"], false);
    $$renderer2.push(`<defs><clipPath${attributes({ id, ...$$restProps }, void 0, void 0, void 0, 3)}><!--[-->`);
    slot($$renderer2, $$props, "clip", { id }, null);
    $$renderer2.push(`<!--]-->`);
    if (useId) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<use${attr("href", `#${stringify(useId)}`)}></use>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></clipPath></defs>`);
    if ($$slots.default) {
      $$renderer2.push("<!--[-->");
      if (disabled) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {}, null);
        $$renderer2.push(`<!--]-->`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<g${attr_style("", { "clip-path": `url(#${stringify(id)})` })}><!--[-->`);
        slot($$renderer2, $$props, "default", { id, url: `url(#${stringify(id)})`, useId }, null);
        $$renderer2.push(`<!--]--></g>`);
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { id, useId, disabled });
  });
}
const canvasContextKey = /* @__PURE__ */ Symbol();
function getCanvasContext() {
  return getContext(canvasContextKey);
}
function setCanvasContext(context) {
  setContext(canvasContextKey, context);
}
function Canvas($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const { width, height, containerWidth, containerHeight, padding } = chartContext();
    let element = fallback($$props["element"], void 0);
    let context = fallback($$props["context"], void 0);
    let willReadFrequently = fallback($$props["willReadFrequently"], false);
    let zIndex = fallback($$props["zIndex"], void 0);
    let pointerEvents = fallback($$props["pointerEvents"], void 0);
    let fallback$1 = fallback($$props["fallback"], "");
    let label = fallback($$props["label"], void 0);
    let labelledBy = fallback($$props["labelledBy"], void 0);
    let describedBy = fallback($$props["describedBy"], void 0);
    let center = fallback($$props["center"], false);
    let ignoreTransform = fallback($$props["ignoreTransform"], false);
    let debug = fallback($$props["debug"], false);
    new Logger("Canvas");
    let components = /* @__PURE__ */ new Map();
    let pendingInvalidation = false;
    let frameId;
    const { mode, scale, translate, dragging, moving } = transformContext();
    onDestroy(() => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    });
    function update() {
      if (!context) return;
      scaleCanvas(context, store_get($$store_subs ??= {}, "$containerWidth", containerWidth), store_get($$store_subs ??= {}, "$containerHeight", containerHeight));
      context.clearRect(0, 0, store_get($$store_subs ??= {}, "$containerWidth", containerWidth), store_get($$store_subs ??= {}, "$containerHeight", containerHeight));
      context.translate(store_get($$store_subs ??= {}, "$padding", padding).left ?? 0, store_get($$store_subs ??= {}, "$padding", padding).top ?? 0);
      if (center) {
        const newTranslate = {
          x: center === "x" || center === true ? store_get($$store_subs ??= {}, "$width", width) / 2 : 0,
          y: center === "y" || center === true ? store_get($$store_subs ??= {}, "$height", height) / 2 : 0
        };
        context.translate(newTranslate.x, newTranslate.y);
      } else if (mode === "canvas" && !ignoreTransform) {
        context.translate(store_get($$store_subs ??= {}, "$translate", translate).x, store_get($$store_subs ??= {}, "$translate", translate).y);
        context.scale(store_get($$store_subs ??= {}, "$scale", scale), store_get($$store_subs ??= {}, "$scale", scale));
      }
      components.forEach((c) => {
        if (c.retainState) {
          c.render(context);
        } else {
          context.save();
          c.render(context);
          context.restore();
        }
        store_get($$store_subs ??= {}, "$moving", moving);
        c.events && Object.values(c.events).filter((d) => d).length > 0;
      });
      pendingInvalidation = false;
    }
    const canvasContext = {
      register(component) {
        const key = /* @__PURE__ */ Symbol();
        components.set(key, component);
        this.invalidate();
        return () => {
          components.delete(key);
          this.invalidate();
        };
      },
      invalidate() {
        if (pendingInvalidation) return;
        pendingInvalidation = true;
        frameId = requestAnimationFrame(update);
      }
    };
    setCanvasContext(canvasContext);
    setRenderContext("canvas");
    {
      store_get($$store_subs ??= {}, "$containerWidth", containerWidth), store_get($$store_subs ??= {}, "$containerHeight", containerHeight) && store_get($$store_subs ??= {}, "$dragging", dragging);
      canvasContext.invalidate();
    }
    $$renderer2.push(`<canvas${attr_class(clsx(cls("layercake-layout-canvas", "absolute top-0 left-0 w-full h-full", pointerEvents === false && "pointer-events-none", $$sanitized_props.class)))}${attr("aria-label", label)}${attr("aria-labelledby", labelledBy)}${attr("aria-describedby", describedBy)}${attr_style("", { "z-index": zIndex })}><!--[-->`);
    slot($$renderer2, $$props, "fallback", {}, () => {
      $$renderer2.push(`${escape_html(fallback$1 || "")}`);
    });
    $$renderer2.push(`<!--]--></canvas> <canvas${attr_class(clsx(cls("layerchart-hitcanvas", "absolute top-0 left-0 w-full h-full", "pointer-events-none", "border border-danger", !debug && "opacity-0")))}></canvas> <!--[-->`);
    slot($$renderer2, $$props, "default", { element, context }, null);
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, {
      element,
      context,
      willReadFrequently,
      zIndex,
      pointerEvents,
      fallback: fallback$1,
      label,
      labelledBy,
      describedBy,
      center,
      ignoreTransform,
      debug
    });
  });
}
function Rect($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "element",
    "x",
    "initialX",
    "y",
    "initialY",
    "width",
    "initialWidth",
    "height",
    "initialHeight",
    "fill",
    "fillOpacity",
    "stroke",
    "strokeWidth",
    "class",
    "onclick",
    "ondblclick",
    "onpointerenter",
    "onpointermove",
    "onpointerleave",
    "onpointerover",
    "onpointerout",
    "spring",
    "tweened"
  ]);
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let fillKey, strokeKey;
    let element = fallback($$props["element"], void 0);
    let x = fallback($$props["x"], 0);
    let initialX = fallback($$props["initialX"], x);
    let y = fallback($$props["y"], 0);
    let initialY = fallback($$props["initialY"], y);
    let width = $$props["width"];
    let initialWidth = fallback($$props["initialWidth"], width);
    let height = $$props["height"];
    let initialHeight = fallback($$props["initialHeight"], height);
    let fill = fallback($$props["fill"], void 0);
    let fillOpacity = fallback($$props["fillOpacity"], void 0);
    let stroke = fallback($$props["stroke"], void 0);
    let strokeWidth = fallback($$props["strokeWidth"], void 0);
    let className = fallback($$props["class"], void 0);
    let onclick = fallback($$props["onclick"], void 0);
    let ondblclick = fallback($$props["ondblclick"], void 0);
    let onpointerenter = fallback($$props["onpointerenter"], void 0);
    let onpointermove = fallback($$props["onpointermove"], void 0);
    let onpointerleave = fallback($$props["onpointerleave"], void 0);
    let onpointerover = fallback($$props["onpointerover"], void 0);
    let onpointerout = fallback($$props["onpointerout"], void 0);
    let spring = fallback($$props["spring"], void 0);
    let tweened = fallback($$props["tweened"], void 0);
    let tweened_x = motionStore(initialX, resolveOptions("x", { spring, tweened }));
    let tweened_y = motionStore(initialY, resolveOptions("y", { spring, tweened }));
    let tweened_width = motionStore(initialWidth, resolveOptions("width", { spring, tweened }));
    let tweened_height = motionStore(initialHeight, resolveOptions("height", { spring, tweened }));
    const renderContext = getRenderContext();
    const canvasContext = getCanvasContext();
    function render(ctx, styleOverrides) {
      renderRect(
        ctx,
        {
          x: store_get($$store_subs ??= {}, "$tweened_x", tweened_x),
          y: store_get($$store_subs ??= {}, "$tweened_y", tweened_y),
          width: store_get($$store_subs ??= {}, "$tweened_width", tweened_width),
          height: store_get($$store_subs ??= {}, "$tweened_height", tweened_height)
        },
        styleOverrides ? merge({ styles: { strokeWidth } }, styleOverrides) : {
          styles: { fill, fillOpacity, stroke, strokeWidth },
          classes: className
        }
      );
    }
    let canvasUnregister;
    onDestroy(() => {
      if (renderContext === "canvas") {
        canvasUnregister();
      }
    });
    tick().then(() => {
      tweened_x.set(x);
      tweened_y.set(y);
      tweened_width.set(width);
      tweened_height.set(height);
    });
    fillKey = fill && typeof fill === "object" ? objectId(fill) : fill;
    strokeKey = stroke && typeof stroke === "object" ? objectId(stroke) : stroke;
    if (renderContext === "canvas") {
      store_get($$store_subs ??= {}, "$tweened_x", tweened_x) && store_get($$store_subs ??= {}, "$tweened_y", tweened_y) && store_get($$store_subs ??= {}, "$tweened_width", tweened_width) && store_get($$store_subs ??= {}, "$tweened_height", tweened_height) && fillKey && strokeKey && strokeWidth && className;
      canvasContext.invalidate();
    }
    if (renderContext === "canvas") {
      canvasUnregister = canvasContext.register({
        name: "Rect",
        render,
        events: {
          click: onclick,
          dblclick: ondblclick,
          pointerenter: onpointerenter,
          pointermove: onpointermove,
          pointerleave: onpointerleave,
          pointerover: onpointerover,
          pointerout: onpointerout
        }
      });
    }
    if (renderContext === "svg") {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<rect${attributes(
        {
          x: store_get($$store_subs ??= {}, "$tweened_x", tweened_x),
          y: store_get($$store_subs ??= {}, "$tweened_y", tweened_y),
          width: store_get($$store_subs ??= {}, "$tweened_width", tweened_width),
          height: store_get($$store_subs ??= {}, "$tweened_height", tweened_height),
          fill,
          "fill-opacity": fillOpacity,
          stroke,
          "stroke-width": strokeWidth,
          class: clsx(cls(fill == null && "fill-surface-content", className)),
          ...$$restProps
        },
        void 0,
        void 0,
        void 0,
        3
      )}></rect>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, {
      element,
      x,
      initialX,
      y,
      initialY,
      width,
      initialWidth,
      height,
      initialHeight,
      fill,
      fillOpacity,
      stroke,
      strokeWidth,
      class: className,
      onclick,
      ondblclick,
      onpointerenter,
      onpointermove,
      onpointerleave,
      onpointerover,
      onpointerout,
      spring,
      tweened
    });
  });
}
function RectClipPath($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "id",
    "x",
    "y",
    "width",
    "height",
    "spring",
    "tweened",
    "disabled"
  ]);
  $$renderer.component(($$renderer2) => {
    let id = fallback($$props["id"], () => uniqueId("clipPath-"), true);
    let x = fallback($$props["x"], 0);
    let y = fallback($$props["y"], 0);
    let width = $$props["width"];
    let height = $$props["height"];
    let spring = fallback($$props["spring"], void 0);
    let tweened = fallback($$props["tweened"], void 0);
    let disabled = fallback($$props["disabled"], false);
    ClipPath($$renderer2, {
      id,
      disabled,
      children: invalid_default_snippet,
      $$slots: {
        default: ($$renderer3, { url }) => {
          $$renderer3.push(`<!--[-->`);
          slot($$renderer3, $$props, "default", { id, url }, null);
          $$renderer3.push(`<!--]-->`);
        },
        clip: ($$renderer3) => {
          Rect($$renderer3, spread_props([
            { slot: "clip", x, y, width, height, spring, tweened },
            $$restProps
          ]));
        }
      }
    });
    bind_props($$props, { id, x, y, width, height, spring, tweened, disabled });
  });
}
function ChartClipPath($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["full", "disabled"]);
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const { width, height, padding } = chartContext();
    let full = fallback($$props["full"], false);
    let disabled = fallback($$props["disabled"], false);
    RectClipPath($$renderer2, spread_props([
      {
        x: full && store_get($$store_subs ??= {}, "$padding", padding).left ? -store_get($$store_subs ??= {}, "$padding", padding).left : 0,
        y: full && store_get($$store_subs ??= {}, "$padding", padding).top ? -store_get($$store_subs ??= {}, "$padding", padding).top : 0,
        width: store_get($$store_subs ??= {}, "$width", width) + (full ? (store_get($$store_subs ??= {}, "$padding", padding)?.left ?? 0) + (store_get($$store_subs ??= {}, "$padding", padding)?.right ?? 0) : 0),
        height: store_get($$store_subs ??= {}, "$height", height) + (full ? (store_get($$store_subs ??= {}, "$padding", padding)?.top ?? 0) + (store_get($$store_subs ??= {}, "$padding", padding)?.bottom ?? 0) : 0),
        disabled
      },
      $$restProps,
      {
        children: ($$renderer3) => {
          $$renderer3.push(`<!--[-->`);
          slot($$renderer3, $$props, "default", {}, null);
          $$renderer3.push(`<!--]-->`);
        },
        $$slots: { default: true }
      }
    ]));
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { full, disabled });
  });
}
function geoCurvePath(projection, curve, context) {
  const pathContext = path();
  const geoPath$1 = geoPath(projection, curveContext(curve(pathContext)));
  const fn = (object) => {
    geoPath$1(object);
    return context === void 0 ? pathContext + "" : void 0;
  };
  Object.setPrototypeOf(fn, geoPath$1);
  return fn;
}
function curveContext(curve) {
  return {
    beginPath() {
    },
    moveTo(x, y) {
      curve.lineStart();
      curve.point(x, y);
    },
    arc(x, y, radius, startAngle, endAngle, anticlockwise) {
    },
    lineTo(x, y) {
      curve.point(x, y);
    },
    closePath() {
      curve.lineEnd();
    }
  };
}
function geoFitObjectTransform(projection, size, object) {
  const newProjection = projection.fitSize(size, object);
  const translate = newProjection.translate();
  return { translate: { x: translate[0], y: translate[1] }, scale: newProjection.scale() };
}
function GeoPath($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "geojson",
    "fill",
    "stroke",
    "strokeWidth",
    "tooltip",
    "onclick",
    "onpointerenter",
    "onpointermove",
    "onpointerleave",
    "onpointerdown",
    "ontouchmove",
    "curve",
    "class",
    "geoTransform"
  ]);
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let _projection, geoPath2;
    let geojson = fallback($$props["geojson"], void 0);
    let fill = fallback($$props["fill"], void 0);
    let stroke = fallback($$props["stroke"], void 0);
    let strokeWidth = fallback($$props["strokeWidth"], void 0);
    let tooltip = fallback($$props["tooltip"], void 0);
    let onclick = fallback($$props["onclick"], void 0);
    let onpointerenter = fallback($$props["onpointerenter"], void 0);
    let onpointermove = fallback($$props["onpointermove"], void 0);
    let onpointerleave = fallback($$props["onpointerleave"], void 0);
    let onpointerdown = fallback($$props["onpointerdown"], void 0);
    let ontouchmove = fallback($$props["ontouchmove"], void 0);
    let curve = fallback($$props["curve"], curveLinearClosed);
    let className = fallback($$props["class"], void 0);
    const geo = geoContext();
    let geoTransform$1 = fallback($$props["geoTransform"], void 0);
    const renderContext = getRenderContext();
    const canvasContext = getCanvasContext();
    function render(ctx, styleOverrides) {
      if (geojson) {
        const pathData = geoPath2(geojson);
        renderPathData(ctx, pathData, styleOverrides ? merge({ styles: { strokeWidth } }, styleOverrides) : { styles: { fill, stroke, strokeWidth }, classes: className });
      }
    }
    function _onClick(e) {
      onclick?.(e, geoPath2);
    }
    function _onPointerEnter(e) {
      onpointerenter?.(e);
      tooltip?.show(e, geojson);
    }
    function _onPointerMove(e) {
      onpointermove?.(e);
      tooltip?.show(e, geojson);
    }
    function _onPointerLeave(e) {
      onpointerleave?.(e);
      tooltip?.hide();
    }
    let canvasUnregister;
    onDestroy(() => {
      if (renderContext === "canvas") {
        canvasUnregister();
      }
    });
    _projection = geoTransform$1 ? geoTransform(geoTransform$1(store_get($$store_subs ??= {}, "$geo", geo))) : store_get($$store_subs ??= {}, "$geo", geo);
    geoPath2 = geoCurvePath(_projection, curve);
    {
      geoPath2 = geoCurvePath(_projection, curve);
    }
    fill && typeof fill === "object" ? objectId(fill) : fill;
    stroke && typeof stroke === "object" ? objectId(stroke) : stroke;
    if (renderContext === "canvas") {
      canvasContext.invalidate();
    }
    if (renderContext === "canvas") {
      canvasUnregister = canvasContext.register({
        name: "GeoPath",
        render,
        events: {
          click: _onClick,
          pointerenter: _onPointerEnter,
          pointermove: _onPointerMove,
          pointerleave: _onPointerLeave,
          pointerdown: onpointerdown,
          touchmove: ontouchmove
        }
      });
    }
    $$renderer2.push(`<!--[-->`);
    slot($$renderer2, $$props, "default", { geoPath: geoPath2 }, () => {
      if (renderContext === "svg") {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<path${attributes(
          {
            ...$$restProps,
            d: geojson ? geoPath2(geojson) : "",
            fill,
            stroke,
            "stroke-width": strokeWidth,
            class: clsx(cls(fill == null && "fill-transparent", className))
          },
          void 0,
          void 0,
          void 0,
          3
        )}></path>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    });
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, {
      geojson,
      fill,
      stroke,
      strokeWidth,
      tooltip,
      onclick,
      onpointerenter,
      onpointermove,
      onpointerleave,
      onpointerdown,
      ontouchmove,
      curve,
      class: className,
      geoTransform: geoTransform$1
    });
  });
}
function Group($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "x",
    "initialX",
    "y",
    "initialY",
    "center",
    "preventTouchMove",
    "onclick",
    "ondblclick",
    "onpointerenter",
    "onpointermove",
    "onpointerleave",
    "onpointerdown",
    "spring",
    "tweened"
  ]);
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const { width, height } = chartContext();
    let x = fallback($$props["x"], void 0);
    let initialX = fallback($$props["initialX"], x);
    let y = fallback($$props["y"], void 0);
    let initialY = fallback($$props["initialY"], y);
    let center = fallback($$props["center"], false);
    let preventTouchMove = fallback($$props["preventTouchMove"], false);
    let onclick = fallback($$props["onclick"], void 0);
    let ondblclick = fallback($$props["ondblclick"], void 0);
    let onpointerenter = fallback($$props["onpointerenter"], void 0);
    let onpointermove = fallback($$props["onpointermove"], void 0);
    let onpointerleave = fallback($$props["onpointerleave"], void 0);
    let onpointerdown = fallback($$props["onpointerdown"], void 0);
    let spring = fallback($$props["spring"], void 0);
    let tweened = fallback($$props["tweened"], void 0);
    let tweened_x = motionStore(initialX, { spring, tweened });
    let tweened_y = motionStore(initialY, { spring, tweened });
    let transform = void 0;
    const renderContext = getRenderContext();
    const canvasContext = getCanvasContext();
    function render(ctx) {
      ctx.translate(store_get($$store_subs ??= {}, "$tweened_x", tweened_x) ?? 0, store_get($$store_subs ??= {}, "$tweened_y", tweened_y) ?? 0);
    }
    let canvasUnregister;
    onDestroy(() => {
      if (renderContext === "canvas") {
        canvasUnregister();
      }
    });
    tick().then(() => {
      tweened_x.set(x ?? (center === "x" || center === true ? store_get($$store_subs ??= {}, "$width", width) / 2 : 0));
      tweened_y.set(y ?? (center === "y" || center === true ? store_get($$store_subs ??= {}, "$height", height) / 2 : 0));
    });
    if (center || x != null || y != null) {
      transform = `translate(${store_get($$store_subs ??= {}, "$tweened_x", tweened_x) ?? 0}px, ${store_get($$store_subs ??= {}, "$tweened_y", tweened_y) ?? 0}px)`;
    }
    if (renderContext === "canvas") {
      store_get($$store_subs ??= {}, "$tweened_x", tweened_x) && store_get($$store_subs ??= {}, "$tweened_y", tweened_y);
      canvasContext.invalidate();
    }
    if (renderContext === "canvas") {
      canvasUnregister = canvasContext.register({
        name: "Group",
        render,
        retainState: true,
        events: {
          click: onclick,
          dblclick: ondblclick,
          pointerenter: onpointerenter,
          pointermove: onpointermove,
          pointerleave: onpointerleave,
          pointerdown: onpointerdown
        }
      });
    }
    if (renderContext === "canvas") {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<!--[-->`);
      slot($$renderer2, $$props, "default", {}, null);
      $$renderer2.push(`<!--]-->`);
    } else if (renderContext === "svg") {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<g${attributes({ ...$$restProps }, void 0, void 0, { transform }, 3)}><!--[-->`);
      slot($$renderer2, $$props, "default", {}, null);
      $$renderer2.push(`<!--]--></g>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div${attributes(
        {
          ...$$restProps,
          class: clsx(cls("absolute", $$restProps.class))
        },
        void 0,
        void 0,
        { transform }
      )}><!--[-->`);
      slot($$renderer2, $$props, "default", {}, null);
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, {
      x,
      initialX,
      y,
      initialY,
      center,
      preventTouchMove,
      onclick,
      ondblclick,
      onpointerenter,
      onpointermove,
      onpointerleave,
      onpointerdown,
      spring,
      tweened
    });
  });
}
function Marker($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "type",
    "id",
    "size",
    "markerWidth",
    "markerHeight",
    "markerUnits",
    "orient",
    "refX",
    "refY",
    "viewBox"
  ]);
  $$renderer.component(($$renderer2) => {
    let type = fallback($$props["type"], void 0);
    let id = fallback($$props["id"], () => uniqueId("marker-"), true);
    let size = fallback($$props["size"], 10);
    let markerWidth = fallback($$props["markerWidth"], size);
    let markerHeight = fallback($$props["markerHeight"], size);
    let markerUnits = fallback($$props["markerUnits"], "userSpaceOnUse");
    let orient = fallback($$props["orient"], "auto-start-reverse");
    let refX = fallback($$props["refX"], () => ["arrow", "triangle"].includes(type ?? "") ? 9 : 5, true);
    let refY = fallback($$props["refY"], 5);
    let viewBox = fallback($$props["viewBox"], "0 0 10 10");
    $$renderer2.push(`<defs><marker${attributes(
      {
        id,
        markerWidth,
        markerHeight,
        markerUnits,
        orient,
        refX,
        refY,
        viewBox,
        ...$$restProps,
        class: clsx(cls(
          "overflow-visible",
          // stroke
          $$sanitized_props.stroke == null && (["arrow", "circle-stroke", "line"].includes(type ?? "") ? "stroke-[context-stroke]" : type === "circle" ? "stroke-surface-100" : "stroke-none"),
          // extra stroke attrs
          "[stroke-linecap:round] [stroke-linejoin:round]",
          //fill
          $$sanitized_props.fill == null && (["triangle", "dot", "circle"].includes(type ?? "") ? "fill-[context-stroke]" : type === "circle-stroke" ? "fill-surface-100" : "fill-none"),
          $$sanitized_props.class
        ))
      },
      void 0,
      void 0,
      void 0,
      3
    )}><!--[-->`);
    slot($$renderer2, $$props, "default", {}, () => {
      if (type === "triangle") {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<path d="M 0 0 L 10 5 L 0 10 z"></path>`);
      } else if (type === "arrow") {
        $$renderer2.push("<!--[1-->");
        $$renderer2.push(`<polyline points="0 0, 10 5, 0 10"></polyline>`);
      } else if (type === "circle" || type === "circle-stroke" || type === "dot") {
        $$renderer2.push("<!--[2-->");
        $$renderer2.push(`<circle${attr("cx", 5)}${attr("cy", 5)}${attr("r", 5)}></circle>`);
      } else if (type === "line") {
        $$renderer2.push("<!--[3-->");
        $$renderer2.push(`<polyline points="5 0, 5 10"></polyline>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    });
    $$renderer2.push(`<!--]--></marker></defs>`);
    bind_props($$props, {
      type,
      id,
      size,
      markerWidth,
      markerHeight,
      markerUnits,
      orient,
      refX,
      refY,
      viewBox
    });
  });
}
function flattenPathData(pathData, yOverride = 0) {
  let result = pathData;
  result = result.replace(/([MLTQCSAZ])(-?\d*\.?\d+),(-?\d*\.?\d+)/g, (match, command, x, y) => {
    return `${command}${x},${yOverride}`;
  });
  result = result.replace(/([v])(-?\d*\.?\d+)/g, (match, command, l) => {
    return `${command}${0}`;
  });
  return result;
}
function Spline($$renderer, $$props) {
  const $$slots = sanitize_slots($$props);
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "data",
    "pathData",
    "x",
    "y",
    "tweened",
    "draw",
    "curve",
    "defined",
    "fill",
    "stroke",
    "strokeWidth",
    "opacity",
    "class",
    "onclick",
    "onpointerenter",
    "onpointermove",
    "onpointerleave",
    "onpointerdown",
    "ontouchmove",
    "onpointerover",
    "onpointerout",
    "marker",
    "markerStart",
    "markerMid",
    "markerEnd"
  ]);
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let markerStartId, markerMidId, markerEndId, xAccessor, yAccessor, xOffset, yOffset, tweened_d, fillKey, strokeKey, endPoint;
    const {
      data: contextData,
      xScale,
      yScale,
      x: contextX,
      y: contextY,
      yRange,
      radial,
      config
    } = chartContext();
    let data = fallback($$props["data"], void 0);
    let pathData = fallback($$props["pathData"], void 0);
    let x = fallback($$props["x"], void 0);
    let y = fallback($$props["y"], void 0);
    let tweened = fallback($$props["tweened"], void 0);
    let draw = fallback($$props["draw"], void 0);
    let curve = fallback($$props["curve"], void 0);
    let defined = fallback($$props["defined"], void 0);
    let fill = fallback($$props["fill"], void 0);
    let stroke = fallback($$props["stroke"], void 0);
    let strokeWidth = fallback($$props["strokeWidth"], void 0);
    let opacity = fallback($$props["opacity"], void 0);
    let className = fallback($$props["class"], void 0);
    let onclick = fallback($$props["onclick"], void 0);
    let onpointerenter = fallback($$props["onpointerenter"], void 0);
    let onpointermove = fallback($$props["onpointermove"], void 0);
    let onpointerleave = fallback($$props["onpointerleave"], void 0);
    let onpointerdown = fallback($$props["onpointerdown"], void 0);
    let ontouchmove = fallback($$props["ontouchmove"], void 0);
    let onpointerover = fallback($$props["onpointerover"], void 0);
    let onpointerout = fallback($$props["onpointerout"], void 0);
    let marker = fallback($$props["marker"], void 0);
    let markerStart = fallback($$props["markerStart"], marker);
    let markerMid = fallback($$props["markerMid"], marker);
    let markerEnd = fallback($$props["markerEnd"], marker);
    function getScaleValue(data2, scale, accessor2) {
      let value = accessor2(data2);
      if (Array.isArray(value)) {
        value = max(value);
      }
      if (scale.domain().length) {
        return scale(value);
      } else {
        return value;
      }
    }
    function defaultPathData() {
      if (!tweenedOptions) {
        return "";
      } else if (pathData) {
        return flattenPathData(pathData, Math.min(store_get($$store_subs ??= {}, "$yScale", yScale)(0), store_get($$store_subs ??= {}, "$yRange", yRange)[0]));
      } else if (store_get($$store_subs ??= {}, "$config", config).x) {
        const path2 = store_get($$store_subs ??= {}, "$radial", radial) ? lineRadial().angle((d2) => store_get($$store_subs ??= {}, "$xScale", xScale)(xAccessor(d2))).radius((d2) => Math.min(store_get($$store_subs ??= {}, "$yScale", yScale)(0), store_get($$store_subs ??= {}, "$yRange", yRange)[0])) : line().x((d2) => store_get($$store_subs ??= {}, "$xScale", xScale)(xAccessor(d2)) + xOffset).y((d2) => Math.min(store_get($$store_subs ??= {}, "$yScale", yScale)(0), store_get($$store_subs ??= {}, "$yRange", yRange)[0]));
        path2.defined(defined ?? ((d2) => xAccessor(d2) != null && yAccessor(d2) != null));
        if (curve) path2.curve(curve);
        return path2(data ?? store_get($$store_subs ??= {}, "$contextData", contextData));
      }
    }
    let d = "";
    const tweenedOptions = tweened ? {
      interpolate: interpolatePath,
      ...typeof tweened === "object" ? tweened : null
    } : false;
    const renderContext = getRenderContext();
    const canvasContext = getCanvasContext();
    function render(ctx, styleOverrides) {
      renderPathData(ctx, store_get($$store_subs ??= {}, "$tweened_d", tweened_d), styleOverrides ? merge({ styles: { strokeWidth } }, styleOverrides) : {
        styles: { fill, stroke, strokeWidth, opacity },
        classes: className
      });
    }
    let canvasUnregister;
    onDestroy(() => {
      if (renderContext === "canvas") {
        canvasUnregister();
      }
    });
    let pathEl = void 0;
    const startPoint = writable(void 0);
    markerStartId = markerStart || $$slots["markerStart"] ? uniqueId("marker-") : "";
    markerMidId = markerMid || $$slots["markerMid"] ? uniqueId("marker-") : "";
    markerEndId = markerEnd || $$slots["markerEnd"] ? uniqueId("marker-") : "";
    xAccessor = x ? accessor(x) : store_get($$store_subs ??= {}, "$contextX", contextX);
    yAccessor = y ? accessor(y) : store_get($$store_subs ??= {}, "$contextY", contextY);
    xOffset = isScaleBand(store_get($$store_subs ??= {}, "$xScale", xScale)) ? store_get($$store_subs ??= {}, "$xScale", xScale).bandwidth() / 2 : 0;
    yOffset = isScaleBand(store_get($$store_subs ??= {}, "$yScale", yScale)) ? store_get($$store_subs ??= {}, "$yScale", yScale).bandwidth() / 2 : 0;
    tweened_d = motionStore(defaultPathData(), { tweened: tweenedOptions });
    {
      const path2 = store_get($$store_subs ??= {}, "$radial", radial) ? lineRadial().angle((d2) => getScaleValue(d2, store_get($$store_subs ??= {}, "$xScale", xScale), xAccessor)).radius((d2) => getScaleValue(d2, store_get($$store_subs ??= {}, "$yScale", yScale), yAccessor)) : line().x((d2) => getScaleValue(d2, store_get($$store_subs ??= {}, "$xScale", xScale), xAccessor) + xOffset).y((d2) => getScaleValue(d2, store_get($$store_subs ??= {}, "$yScale", yScale), yAccessor) + yOffset);
      path2.defined(defined ?? ((d2) => xAccessor(d2) != null && yAccessor(d2) != null));
      if (curve) path2.curve(curve);
      d = pathData ?? path2(data ?? store_get($$store_subs ??= {}, "$contextData", contextData)) ?? "";
      tweened_d.set(d);
    }
    if (draw) {
      store_get($$store_subs ??= {}, "$tweened_d", tweened_d);
    }
    fillKey = fill && typeof fill === "object" ? objectId(fill) : fill;
    strokeKey = stroke && typeof stroke === "object" ? objectId(stroke) : stroke;
    if (renderContext === "canvas") {
      store_get($$store_subs ??= {}, "$tweened_d", tweened_d) && fillKey && strokeKey && strokeWidth && className;
      canvasContext.invalidate();
    }
    if (renderContext === "canvas") {
      canvasUnregister = canvasContext.register({
        name: "Spline",
        render,
        events: {
          click: onclick,
          pointerenter: onpointerenter,
          pointermove: onpointermove,
          pointerleave: onpointerleave,
          pointerdown: onpointerdown,
          pointerover: onpointerover,
          pointerout: onpointerout,
          touchmove: ontouchmove
        }
      });
    }
    endPoint = motionStore(void 0, {
      tweened: draw ? {
        duration: typeof draw === "object" && draw.duration || 800,
        easing: typeof draw === "object" && draw.easing || cubicInOut,
        interpolate(a, b) {
          return (t) => {
            const totalLength = 0;
            const point = pathEl?.getPointAtLength(totalLength * t);
            return point;
          };
        }
      } : false
    });
    {
      if ($$slots.start || $$slots.end) {
        tick().then(() => {
        });
      }
    }
    if (renderContext === "svg") {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<!---->`);
      {
        $$renderer2.push(`<path${attributes(
          {
            d: store_get($$store_subs ??= {}, "$tweened_d", tweened_d),
            ...$$restProps,
            class: clsx(cls("path-line", !fill && "fill-none", !stroke && "stroke-surface-content", className)),
            fill,
            stroke,
            "stroke-width": strokeWidth,
            opacity,
            "marker-start": markerStartId ? `url(#${markerStartId})` : void 0,
            "marker-mid": markerMidId ? `url(#${markerMidId})` : void 0,
            "marker-end": markerEndId ? `url(#${markerEndId})` : void 0
          },
          void 0,
          void 0,
          void 0,
          3
        )}></path><!--[-->`);
        slot($$renderer2, $$props, "markerStart", { id: markerStartId }, () => {
          if (markerStart) {
            $$renderer2.push("<!--[-->");
            Marker($$renderer2, spread_props([
              {
                id: markerStartId,
                type: typeof markerStart === "string" ? markerStart : void 0
              },
              typeof markerStart === "object" ? markerStart : null
            ]));
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]-->`);
        });
        $$renderer2.push(`<!--]--><!--[-->`);
        slot($$renderer2, $$props, "markerMid", { id: markerMidId }, () => {
          if (markerMid) {
            $$renderer2.push("<!--[-->");
            Marker($$renderer2, spread_props([
              {
                id: markerMidId,
                type: typeof markerMid === "string" ? markerMid : void 0
              },
              typeof markerMid === "object" ? markerMid : null
            ]));
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]-->`);
        });
        $$renderer2.push(`<!--]--><!--[-->`);
        slot($$renderer2, $$props, "markerEnd", { id: markerEndId }, () => {
          if (markerEnd) {
            $$renderer2.push("<!--[-->");
            Marker($$renderer2, spread_props([
              {
                id: markerEndId,
                type: typeof markerEnd === "string" ? markerEnd : void 0
              },
              typeof markerEnd === "object" ? markerEnd : null
            ]));
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]-->`);
        });
        $$renderer2.push(`<!--]-->`);
        if ($$slots.start && store_get($$store_subs ??= {}, "$startPoint", startPoint)) {
          $$renderer2.push("<!--[-->");
          Group($$renderer2, {
            x: store_get($$store_subs ??= {}, "$startPoint", startPoint).x,
            y: store_get($$store_subs ??= {}, "$startPoint", startPoint).y,
            children: ($$renderer3) => {
              $$renderer3.push(`<!--[-->`);
              slot(
                $$renderer3,
                $$props,
                "start",
                {
                  point: store_get($$store_subs ??= {}, "$startPoint", startPoint)
                },
                null
              );
              $$renderer3.push(`<!--]-->`);
            },
            $$slots: { default: true }
          });
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]-->`);
        if ($$slots.end && store_get($$store_subs ??= {}, "$endPoint", endPoint)) {
          $$renderer2.push("<!--[-->");
          Group($$renderer2, {
            x: store_get($$store_subs ??= {}, "$endPoint", endPoint).x,
            y: store_get($$store_subs ??= {}, "$endPoint", endPoint).y,
            children: ($$renderer3) => {
              $$renderer3.push(`<!--[-->`);
              slot(
                $$renderer3,
                $$props,
                "end",
                {
                  point: store_get($$store_subs ??= {}, "$endPoint", endPoint)
                },
                null
              );
              $$renderer3.push(`<!--]-->`);
            },
            $$slots: { default: true }
          });
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, {
      data,
      pathData,
      x,
      y,
      tweened,
      draw,
      curve,
      defined,
      fill,
      stroke,
      strokeWidth,
      opacity,
      class: className,
      onclick,
      onpointerenter,
      onpointermove,
      onpointerleave,
      onpointerdown,
      ontouchmove,
      onpointerover,
      onpointerout,
      marker,
      markerStart,
      markerMid,
      markerEnd
    });
  });
}
function Voronoi($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "data",
    "classes",
    "onclick",
    "onpointerenter",
    "onpointermove",
    "onpointerleave",
    "onpointerdown"
  ]);
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let points, boundWidth, boundHeight;
    const {
      flatData,
      xGet,
      yGet,
      x: xContext,
      y: yContext,
      width,
      height,
      radial
    } = chartContext();
    const geo = geoContext();
    let data = fallback($$props["data"], void 0);
    let classes = fallback($$props["classes"], () => ({}), true);
    let onclick = fallback($$props["onclick"], void 0);
    let onpointerenter = fallback($$props["onpointerenter"], void 0);
    let onpointermove = fallback($$props["onpointermove"], void 0);
    let onpointerleave = fallback($$props["onpointerleave"], void 0);
    let onpointerdown = fallback($$props["onpointerdown"], void 0);
    points = (data ?? store_get($$store_subs ??= {}, "$flatData", flatData)).map((d) => {
      const xValue = store_get($$store_subs ??= {}, "$geo", geo) ? store_get($$store_subs ??= {}, "$xContext", xContext)(d) : store_get($$store_subs ??= {}, "$xGet", xGet)(d);
      const yValue = store_get($$store_subs ??= {}, "$geo", geo) ? store_get($$store_subs ??= {}, "$yContext", yContext)(d) : store_get($$store_subs ??= {}, "$yGet", yGet)(d);
      const x = Array.isArray(xValue) ? min(xValue) : xValue;
      const y = Array.isArray(yValue) ? min(yValue) : yValue;
      let point;
      if (store_get($$store_subs ??= {}, "$radial", radial)) {
        const radialPoint = pointRadial(x, y);
        point = [
          radialPoint[0] + store_get($$store_subs ??= {}, "$width", width) / 2,
          radialPoint[1] + store_get($$store_subs ??= {}, "$height", height) / 2
        ];
      } else {
        point = [x, y];
      }
      point.data = d;
      return point;
    });
    boundWidth = Math.max(store_get($$store_subs ??= {}, "$width", width), 0);
    boundHeight = Math.max(store_get($$store_subs ??= {}, "$height", height), 0);
    $$renderer2.push(`<g${attributes(
      {
        ...$$restProps,
        class: clsx(cls(classes.root, $$sanitized_props.class))
      },
      void 0,
      void 0,
      void 0,
      3
    )}>`);
    if (store_get($$store_subs ??= {}, "$geo", geo)) {
      $$renderer2.push("<!--[-->");
      const polygons = geoVoronoi().polygons(points);
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(polygons.features);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let feature = each_array[$$index];
        GeoPath($$renderer2, {
          geojson: feature,
          class: cls("fill-transparent stroke-transparent", classes.path),
          onclick: (e) => onclick?.(e, { data: feature.properties.site.data, feature }),
          onpointerenter: (e) => onpointerenter?.(e, { data: feature.properties.site.data, feature }),
          onpointermove: (e) => onpointermove?.(e, { data: feature.properties.site.data, feature }),
          onpointerdown: (e) => onpointerdown?.(e, { data: feature.properties.site.data, feature }),
          onpointerleave,
          ontouchmove: (e) => {
            e.preventDefault();
          }
        });
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[!-->");
      const voronoi = Delaunay.from(points).voronoi([0, 0, boundWidth, boundHeight]);
      $$renderer2.push(`<!--[-->`);
      const each_array_1 = ensure_array_like(points);
      for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
        let point = each_array_1[i];
        const pathData = voronoi.renderCell(i);
        if (pathData) {
          $$renderer2.push("<!--[-->");
          Spline($$renderer2, {
            pathData,
            class: cls("fill-transparent stroke-transparent", classes.path),
            onclick: (e) => onclick?.(e, { data: point.data, point }),
            onpointerenter: (e) => onpointerenter?.(e, { data: point.data, point }),
            onpointermove: (e) => onpointermove?.(e, { data: point.data, point }),
            onpointerleave,
            onpointerdown: (e) => onpointerdown?.(e, { data: point.data, point }),
            ontouchmove: (e) => {
              e.preventDefault();
            }
          });
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></g>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, {
      data,
      classes,
      onclick,
      onpointerenter,
      onpointermove,
      onpointerleave,
      onpointerdown
    });
  });
}
function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}
function cartesianToPolar(x, y) {
  let radians = Math.atan2(y, x);
  radians += Math.PI / 2;
  if (radians < 0) {
    radians += 2 * Math.PI;
  }
  return {
    radius: Math.sqrt(x ** 2 + y ** 2),
    radians
  };
}
function quadtreeRects(quadtree2, showLeaves = true) {
  const rects = [];
  quadtree2.visit((node, x0, y0, x1, y1) => {
    if (showLeaves || Array.isArray(node)) {
      rects.push({ x: x0, y: y0, width: x1 - x0, height: y1 - y0 });
    }
  });
  return rects;
}
const tooltipContextKey = /* @__PURE__ */ Symbol();
const defaultContext = writable({
  x: 0,
  y: 0,
  data: null,
  show: () => {
  },
  hide: () => {
  },
  mode: "manual"
});
function tooltipContext() {
  return getContext(tooltipContextKey) ?? defaultContext;
}
function setTooltipContext(tooltip) {
  setContext(tooltipContextKey, tooltip);
}
function TooltipContext($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let bisectX, bisectY, triggerPointerEvents;
    const {
      flatData,
      x,
      xScale,
      xGet,
      xRange,
      y,
      yScale,
      yGet,
      yRange,
      width,
      height,
      containerWidth,
      containerHeight,
      padding,
      radial
    } = chartContext();
    let mode = fallback($$props["mode"], "manual");
    let findTooltipData = fallback($$props["findTooltipData"], "closest");
    let raiseTarget = fallback($$props["raiseTarget"], false);
    let locked = fallback($$props["locked"], false);
    let radius = fallback($$props["radius"], Infinity);
    let debug = fallback($$props["debug"], false);
    let onclick = fallback($$props["onclick"], () => {
    });
    let tooltip = fallback(
      $$props["tooltip"],
      () => writable({
        x: 0,
        y: 0,
        data: null,
        show: showTooltip,
        hide: hideTooltip,
        mode
      }),
      true
    );
    setTooltipContext(tooltip);
    let hideDelay = fallback($$props["hideDelay"], 0);
    let hideTimeoutId;
    let tooltipContextNode;
    function findData(previousValue, currentValue, valueAtPoint, accessor2) {
      switch (findTooltipData) {
        case "closest":
          if (currentValue === void 0) {
            return previousValue;
          } else if (previousValue === void 0) {
            return currentValue;
          } else {
            return Number(valueAtPoint) - Number(accessor2(previousValue)) > Number(accessor2(currentValue)) - Number(valueAtPoint) ? currentValue : previousValue;
          }
        case "left":
          return previousValue;
        case "right":
        default:
          return currentValue;
      }
    }
    function showTooltip(e, tooltipData) {
      if (hideTimeoutId) {
        clearTimeout(hideTimeoutId);
      }
      if (locked) {
        return;
      }
      const containerNode = e.target.closest(".layercake-container");
      const point = localPoint(e, containerNode);
      if (tooltipData == null && // mode !== 'manual' but support annotations
      (point.x < tooltipContextNode.offsetLeft || point.x > tooltipContextNode.offsetLeft + tooltipContextNode.offsetWidth || point.y < tooltipContextNode.offsetTop || point.y > tooltipContextNode.offsetTop + tooltipContextNode.offsetHeight)) {
        hideTooltip();
        return;
      }
      if (tooltipData == null) {
        switch (mode) {
          case "bisect-x": {
            let xValueAtPoint;
            if (store_get($$store_subs ??= {}, "$radial", radial)) {
              const { radians } = cartesianToPolar(point.x - store_get($$store_subs ??= {}, "$width", width) / 2, point.y - store_get($$store_subs ??= {}, "$height", height) / 2);
              xValueAtPoint = scaleInvert(store_get($$store_subs ??= {}, "$xScale", xScale), radians);
            } else {
              xValueAtPoint = scaleInvert(store_get($$store_subs ??= {}, "$xScale", xScale), point.x - store_get($$store_subs ??= {}, "$padding", padding).left);
            }
            const index = bisectX(store_get($$store_subs ??= {}, "$flatData", flatData), xValueAtPoint, 1);
            const previousValue = store_get($$store_subs ??= {}, "$flatData", flatData)[index - 1];
            const currentValue = store_get($$store_subs ??= {}, "$flatData", flatData)[index];
            tooltipData = findData(previousValue, currentValue, xValueAtPoint, store_get($$store_subs ??= {}, "$x", x));
            break;
          }
          case "bisect-y": {
            const yValueAtPoint = scaleInvert(store_get($$store_subs ??= {}, "$yScale", yScale), point.y - store_get($$store_subs ??= {}, "$padding", padding).top);
            const index = bisectY(store_get($$store_subs ??= {}, "$flatData", flatData), yValueAtPoint, 1);
            const previousValue = store_get($$store_subs ??= {}, "$flatData", flatData)[index - 1];
            const currentValue = store_get($$store_subs ??= {}, "$flatData", flatData)[index];
            tooltipData = findData(previousValue, currentValue, yValueAtPoint, store_get($$store_subs ??= {}, "$y", y));
            break;
          }
          case "bisect-band": {
            const xValueAtPoint = scaleInvert(store_get($$store_subs ??= {}, "$xScale", xScale), point.x);
            const yValueAtPoint = scaleInvert(store_get($$store_subs ??= {}, "$yScale", yScale), point.y);
            if (isScaleBand(store_get($$store_subs ??= {}, "$xScale", xScale))) {
              const bandData = store_get($$store_subs ??= {}, "$flatData", flatData).filter((d) => store_get($$store_subs ??= {}, "$x", x)(d) === xValueAtPoint).sort(sortFunc(store_get($$store_subs ??= {}, "$y", y)));
              const index = bisectY(bandData, yValueAtPoint, 1);
              const previousValue = bandData[index - 1];
              const currentValue = bandData[index];
              tooltipData = findData(previousValue, currentValue, yValueAtPoint, store_get($$store_subs ??= {}, "$y", y));
            } else if (isScaleBand(store_get($$store_subs ??= {}, "$yScale", yScale))) {
              const bandData = store_get($$store_subs ??= {}, "$flatData", flatData).filter((d) => store_get($$store_subs ??= {}, "$y", y)(d) === yValueAtPoint).sort(sortFunc(store_get($$store_subs ??= {}, "$x", x)));
              const index = bisectX(bandData, xValueAtPoint, 1);
              const previousValue = bandData[index - 1];
              const currentValue = bandData[index];
              tooltipData = findData(previousValue, currentValue, xValueAtPoint, store_get($$store_subs ??= {}, "$x", x));
            } else ;
            break;
          }
          case "quadtree": {
            tooltipData = quadtree$1.find(point.x, point.y, radius);
            break;
          }
        }
      }
      if (tooltipData) {
        if (raiseTarget) {
          raise(e.target);
        }
        store_set(tooltip, {
          ...store_get($$store_subs ??= {}, "$tooltip", tooltip),
          x: point.x,
          y: point.y,
          data: tooltipData
        });
      } else {
        hideTooltip();
      }
    }
    function hideTooltip() {
      if (locked) {
        return;
      }
      hideTimeoutId = setTimeout(
        () => {
          {
            store_set(tooltip, {
              ...store_get($$store_subs ??= {}, "$tooltip", tooltip),
              data: null
            });
          }
        },
        hideDelay
      );
    }
    let quadtree$1;
    let rects = [];
    bisectX = bisector((d) => {
      const value = store_get($$store_subs ??= {}, "$x", x)(d);
      if (Array.isArray(value)) {
        return value[0];
      } else {
        return value;
      }
    }).left;
    bisectY = bisector((d) => {
      const value = store_get($$store_subs ??= {}, "$y", y)(d);
      if (Array.isArray(value)) {
        return value[0];
      } else {
        return value;
      }
    }).left;
    if (mode === "quadtree") {
      quadtree$1 = quadtree().extent([
        [0, 0],
        [
          store_get($$store_subs ??= {}, "$width", width),
          store_get($$store_subs ??= {}, "$height", height)
        ]
      ]).x((d) => {
        const value = store_get($$store_subs ??= {}, "$xGet", xGet)(d);
        if (Array.isArray(value)) {
          return min(value);
        } else {
          return value;
        }
      }).y((d) => {
        const value = store_get($$store_subs ??= {}, "$yGet", yGet)(d);
        if (Array.isArray(value)) {
          return min(value);
        } else {
          return value;
        }
      }).addAll(store_get($$store_subs ??= {}, "$flatData", flatData));
    }
    if (mode === "bounds" || mode === "band") {
      rects = store_get($$store_subs ??= {}, "$flatData", flatData).map((d) => {
        const xValue = store_get($$store_subs ??= {}, "$xGet", xGet)(d);
        const yValue = store_get($$store_subs ??= {}, "$yGet", yGet)(d);
        const x2 = Array.isArray(xValue) ? xValue[0] : xValue;
        const y2 = Array.isArray(yValue) ? yValue[0] : yValue;
        const xOffset = isScaleBand(store_get($$store_subs ??= {}, "$xScale", xScale)) ? store_get($$store_subs ??= {}, "$xScale", xScale).padding() * store_get($$store_subs ??= {}, "$xScale", xScale).step() / 2 : 0;
        const yOffset = isScaleBand(store_get($$store_subs ??= {}, "$yScale", yScale)) ? store_get($$store_subs ??= {}, "$yScale", yScale).padding() * store_get($$store_subs ??= {}, "$yScale", yScale).step() / 2 : 0;
        const fullWidth = max(store_get($$store_subs ??= {}, "$xRange", xRange)) - min(store_get($$store_subs ??= {}, "$xRange", xRange));
        const fullHeight = max(store_get($$store_subs ??= {}, "$yRange", yRange)) - min(store_get($$store_subs ??= {}, "$yRange", yRange));
        if (mode === "band") {
          return {
            x: isScaleBand(store_get($$store_subs ??= {}, "$xScale", xScale)) ? x2 - xOffset : min(store_get($$store_subs ??= {}, "$xRange", xRange)),
            y: isScaleBand(store_get($$store_subs ??= {}, "$yScale", yScale)) ? y2 - yOffset : min(store_get($$store_subs ??= {}, "$yRange", yRange)),
            width: isScaleBand(store_get($$store_subs ??= {}, "$xScale", xScale)) ? store_get($$store_subs ??= {}, "$xScale", xScale).step() : fullWidth,
            height: isScaleBand(store_get($$store_subs ??= {}, "$yScale", yScale)) ? store_get($$store_subs ??= {}, "$yScale", yScale).step() : fullHeight,
            data: d
          };
        } else if (mode === "bounds") {
          return {
            x: isScaleBand(store_get($$store_subs ??= {}, "$xScale", xScale)) || Array.isArray(xValue) ? x2 - xOffset : min(store_get($$store_subs ??= {}, "$xRange", xRange)),
            // y: isScaleBand($yScale) || Array.isArray(yValue) ? y - yOffset : min($yRange),
            y: y2 - yOffset,
            width: Array.isArray(xValue) ? xValue[1] - xValue[0] : isScaleBand(store_get($$store_subs ??= {}, "$xScale", xScale)) ? store_get($$store_subs ??= {}, "$xScale", xScale).step() : min(store_get($$store_subs ??= {}, "$xRange", xRange)) + x2,
            height: Array.isArray(yValue) ? yValue[1] - yValue[0] : isScaleBand(store_get($$store_subs ??= {}, "$yScale", yScale)) ? store_get($$store_subs ??= {}, "$yScale", yScale).step() : (
              // @ts-expect-error
              max(store_get($$store_subs ??= {}, "$yRange", yRange)) - y2
            ),
            data: d
          };
        }
      }).sort(sortFunc("x"));
    }
    triggerPointerEvents = ["bisect-x", "bisect-y", "bisect-band", "quadtree"].includes(mode);
    $$renderer2.push(`<div${attr_class(clsx(cls("TooltipContext absolute touch-none", debug && triggerPointerEvents && "bg-danger/10 outline outline-danger")))}${attr_style("", {
      top: `${stringify(store_get($$store_subs ??= {}, "$padding", padding).top)}px`,
      left: `${stringify(store_get($$store_subs ??= {}, "$padding", padding).left)}px`,
      width: `${stringify(store_get($$store_subs ??= {}, "$width", width))}px`,
      height: `${stringify(store_get($$store_subs ??= {}, "$height", height))}px`
    })}><div class="absolute"${attr_style("", {
      top: `-${stringify(
        // Ignore clicks without data (triggered from Legend clicks, for example)
        store_get($$store_subs ??= {}, "$padding", padding).top ?? 0
      )}px`,
      left: `-${stringify(store_get($$store_subs ??= {}, "$padding", padding).left ?? 0)}px`,
      width: `${stringify(store_get($$store_subs ??= {}, "$containerWidth", containerWidth))}px`,
      height: `${stringify(store_get($$store_subs ??= {}, "$containerHeight", containerHeight))}px`
    })}><!--[-->`);
    slot(
      $$renderer2,
      $$props,
      "default",
      {
        tooltip: store_get($$store_subs ??= {}, "$tooltip", tooltip)
      },
      null
    );
    $$renderer2.push(`<!--]--> `);
    if (mode === "voronoi") {
      $$renderer2.push("<!--[-->");
      Svg($$renderer2, {
        children: ($$renderer3) => {
          Voronoi($$renderer3, {
            onpointerenter: (e, { data }) => {
              showTooltip(e, data);
            },
            onpointermove: (e, { data }) => {
              showTooltip(e, data);
            },
            onpointerleave: hideTooltip,
            onpointerdown: (e) => {
              if (e.target?.hasPointerCapture(e.pointerId)) {
                e.target.releasePointerCapture(e.pointerId);
              }
            },
            onclick: (e, { data }) => {
              onclick(e, { data });
            },
            classes: { path: cls(debug && "fill-danger/10 stroke-danger") }
          });
        },
        $$slots: { default: true }
      });
    } else if (mode === "bounds" || mode === "band") {
      $$renderer2.push("<!--[1-->");
      Svg($$renderer2, {
        children: ($$renderer3) => {
          $$renderer3.push(`<g class="tooltip-rects"><!--[-->`);
          const each_array = ensure_array_like(rects);
          for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
            let rect = each_array[$$index];
            $$renderer3.push(`<rect${attr("x", rect.x)}${attr("y", rect.y)}${attr("width", rect.width)}${attr("height", rect.height)}${attr_class(clsx(cls(debug ? "fill-danger/10 stroke-danger" : "fill-transparent")))}></rect>`);
          }
          $$renderer3.push(`<!--]--></g>`);
        },
        $$slots: { default: true }
      });
    } else if (mode === "quadtree" && debug) {
      $$renderer2.push("<!--[2-->");
      Svg($$renderer2, {
        pointerEvents: false,
        children: ($$renderer3) => {
          ChartClipPath($$renderer3, {
            children: ($$renderer4) => {
              $$renderer4.push(`<g class="tooltip-quadtree"><!--[-->`);
              const each_array_1 = ensure_array_like(quadtreeRects(quadtree$1, false));
              for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
                let rect = each_array_1[$$index_1];
                $$renderer4.push(`<rect${attr("x", rect.x)}${attr("y", rect.y)}${attr("width", rect.width)}${attr("height", rect.height)}${attr_class(clsx(cls(debug ? "fill-danger/10 stroke-danger" : "fill-transparent")))}></rect>`);
              }
              $$renderer4.push(`<!--]--></g>`);
            },
            $$slots: { default: true }
          });
        },
        $$slots: { default: true }
      });
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, {
      mode,
      findTooltipData,
      raiseTarget,
      locked,
      radius,
      debug,
      onclick,
      tooltip,
      hideDelay
    });
  });
}
const brushContextKey = /* @__PURE__ */ Symbol();
function setBrushContext(brush) {
  setContext(brushContextKey, brush);
}
function BrushContext($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let xDomainMin, xDomainMax, yDomainMin, yDomainMax, top, bottom, left, right, _range;
    const {
      xScale,
      yScale,
      width,
      height,
      padding,
      containerWidth,
      containerHeight,
      config
    } = chartContext();
    let axis = fallback($$props["axis"], "x");
    let handleSize = fallback($$props["handleSize"], 5);
    let resetOnEnd = fallback($$props["resetOnEnd"], false);
    let xDomain = fallback($$props["xDomain"], () => store_get($$store_subs ??= {}, "$xScale", xScale).domain(), true);
    let yDomain = fallback($$props["yDomain"], () => store_get($$store_subs ??= {}, "$yScale", yScale).domain(), true);
    let mode = fallback($$props["mode"], "integrated");
    let disabled = fallback($$props["disabled"], false);
    const originalXDomain = store_get($$store_subs ??= {}, "$config", config).xDomain;
    const originalYDomain = store_get($$store_subs ??= {}, "$config", config).yDomain;
    let range2 = fallback($$props["range"], void 0);
    let handle = fallback($$props["handle"], void 0);
    let classes = fallback($$props["classes"], () => ({}), true);
    let onchange = fallback($$props["onchange"], () => {
    });
    let onbrushstart = fallback($$props["onbrushstart"], () => {
    });
    let onbrushend = fallback($$props["onbrushend"], () => {
    });
    let onreset = fallback($$props["onreset"], () => {
    });
    let brush = fallback(
      $$props["brush"],
      () => writable({
        xDomain: null,
        yDomain: null,
        isActive: false,
        range: { x: 0, y: 0, width: 0, height: 0 },
        handleSize: 0
      }),
      true
    );
    setBrushContext(brush);
    new Logger("BrushContext");
    let isActive = false;
    [xDomainMin, xDomainMax] = extent(store_get($$store_subs ??= {}, "$xScale", xScale).domain());
    [yDomainMin, yDomainMax] = extent(store_get($$store_subs ??= {}, "$yScale", yScale).domain());
    top = store_get($$store_subs ??= {}, "$yScale", yScale)(yDomain?.[1]);
    bottom = store_get($$store_subs ??= {}, "$yScale", yScale)(yDomain?.[0]);
    left = store_get($$store_subs ??= {}, "$xScale", xScale)(xDomain?.[0]);
    right = store_get($$store_subs ??= {}, "$xScale", xScale)(xDomain?.[1]);
    _range = {
      x: axis === "both" || axis === "x" ? left : 0,
      y: axis === "both" || axis === "y" ? top : 0,
      width: axis === "both" || axis === "x" ? right - left : store_get($$store_subs ??= {}, "$width", width),
      height: axis === "both" || axis === "y" ? bottom - top : store_get($$store_subs ??= {}, "$height", height)
    };
    if (mode === "separated") {
      const isXAxisActive = xDomain?.[0]?.valueOf() !== originalXDomain?.[0]?.valueOf() || xDomain?.[1]?.valueOf() !== originalXDomain?.[1]?.valueOf();
      const isYAxisActive = yDomain?.[0]?.valueOf() !== originalYDomain?.[0]?.valueOf() || yDomain?.[1]?.valueOf() !== originalYDomain?.[1]?.valueOf();
      isActive = axis === "x" ? isXAxisActive : axis == "y" ? isYAxisActive : isXAxisActive || isYAxisActive;
    }
    store_set(brush, { xDomain, yDomain, isActive, range: _range, handleSize });
    if (disabled) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<!--[-->`);
      slot($$renderer2, $$props, "default", {}, null);
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div${attr_class(clsx(cls("BrushContext absolute touch-none")))}${attr_style("", {
        top: `${stringify(store_get($$store_subs ??= {}, "$padding", padding).top)}px`,
        left: `${stringify(store_get($$store_subs ??= {}, "$padding", padding).left)}px`,
        width: `${stringify(store_get($$store_subs ??= {}, "$width", width))}px`,
        height: `${stringify(store_get($$store_subs ??= {}, "$height", height))}px`
      })}><div class="absolute"${attr_style("", {
        top: `-${stringify(store_get($$store_subs ??= {}, "$padding", padding).top ?? 0)}px`,
        left: `-${stringify(store_get($$store_subs ??= {}, "$padding", padding).left ?? 0)}px`,
        width: `${stringify(store_get($$store_subs ??= {}, "$containerWidth", containerWidth))}px`,
        height: `${stringify(store_get($$store_subs ??= {}, "$containerHeight", containerHeight))}px`
      })}><!--[-->`);
      slot($$renderer2, $$props, "default", { brush: store_get($$store_subs ??= {}, "$brush", brush) }, null);
      $$renderer2.push(`<!--]--></div> `);
      if (isActive) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div${attributes(
          {
            ...range2,
            class: clsx(cls("range", "absolute bg-surface-content/10 cursor-move select-none", "z-10", classes.range, range2?.class))
          },
          void 0,
          void 0,
          {
            left: `${stringify(_range.x)}px`,
            top: `${stringify(_range.y)}px`,
            width: `${stringify(_range.width)}px`,
            height: `${stringify(_range.height)}px`
          }
        )}></div> `);
        if (axis === "both" || axis === "y") {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div${attributes(
            {
              ...handle,
              class: clsx(cls("handle top", "cursor-ns-resize select-none", "range absolute", "z-10", classes.handle, handle?.class))
            },
            void 0,
            void 0,
            {
              left: `${stringify(_range.x)}px`,
              top: `${stringify(_range.y)}px`,
              width: `${stringify(_range.width)}px`,
              height: `${stringify(handleSize)}px`
            }
          )}></div> <div${attributes(
            {
              ...handle,
              class: clsx(cls("handle bottom", "cursor-ns-resize select-none", "range absolute", "z-10", classes.handle, handle?.class))
            },
            void 0,
            void 0,
            {
              left: `${stringify(_range.x)}px`,
              top: `${stringify(bottom - handleSize)}px`,
              width: `${stringify(_range.width)}px`,
              height: `${stringify(handleSize)}px`
            }
          )}></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (axis === "both" || axis === "x") {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div${attributes(
            {
              ...handle,
              class: clsx(cls("handle left", "cursor-ew-resize select-none", "range absolute", "z-10", classes.handle, handle?.class))
            },
            void 0,
            void 0,
            {
              left: `${stringify(_range.x)}px`,
              top: `${stringify(_range.y)}px`,
              width: `${stringify(handleSize)}px`,
              height: `${stringify(_range.height)}px`
            }
          )}></div> <div${attributes(
            {
              ...handle,
              class: clsx(cls("handle right", "cursor-ew-resize select-none", "range absolute", "z-10", classes.handle, handle?.class))
            },
            void 0,
            void 0,
            {
              left: `${stringify(right - handleSize + 1)}px`,
              top: `${stringify(_range.y)}px`,
              width: `${stringify(handleSize)}px`,
              height: `${stringify(_range.height)}px`
            }
          )}></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]-->`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, {
      axis,
      handleSize,
      resetOnEnd,
      xDomain,
      yDomain,
      mode,
      disabled,
      range: range2,
      handle,
      classes,
      onchange,
      onbrushstart,
      onbrushend,
      onreset,
      brush
    });
  });
}
const renderContextKey = /* @__PURE__ */ Symbol();
function getRenderContext() {
  return getContext(renderContextKey);
}
function setRenderContext(context) {
  setContext(renderContextKey, context);
}
function Chart($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "data",
    "x",
    "xRange",
    "y",
    "yScale",
    "yRange",
    "x1",
    "x1Scale",
    "x1Domain",
    "x1Range",
    "y1",
    "y1Scale",
    "y1Domain",
    "y1Range",
    "c",
    "cScale",
    "cDomain",
    "cRange",
    "xBaseline",
    "yBaseline",
    "radial",
    "geo",
    "geoProjection",
    "tooltip",
    "tooltipContext",
    "transform",
    "transformContext",
    "brush",
    "brushContext",
    "onresize",
    "ondragstart",
    "ondragend",
    "ontransform"
  ]);
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let yReverse, _x, _y, _yRange;
    let data = fallback($$props["data"], () => [], true);
    let x = fallback($$props["x"], void 0);
    let xRange = fallback($$props["xRange"], void 0);
    let y = fallback($$props["y"], void 0);
    let yScale = fallback($$props["yScale"], void 0);
    let yRange = fallback($$props["yRange"], void 0);
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
    let xBaseline = fallback($$props["xBaseline"], null);
    let xDomain = void 0;
    let yBaseline = fallback($$props["yBaseline"], null);
    let yDomain = void 0;
    let radial = fallback($$props["radial"], false);
    let geo = fallback($$props["geo"], void 0);
    let geoProjection = fallback($$props["geoProjection"], void 0);
    let tooltip = fallback($$props["tooltip"], void 0);
    let tooltipContext2 = fallback($$props["tooltipContext"], void 0);
    let transform = fallback($$props["transform"], void 0);
    let transformContext2 = fallback($$props["transformContext"], void 0);
    let brush = fallback($$props["brush"], void 0);
    let brushContext = fallback($$props["brushContext"], void 0);
    let onresize = fallback($$props["onresize"], void 0);
    let ondragstart = fallback($$props["ondragstart"], void 0);
    let ondragend = fallback($$props["ondragend"], void 0);
    let ontransform = fallback($$props["ontransform"], void 0);
    if (xBaseline != null && Array.isArray(data)) {
      const xValues = data.flatMap(accessor(x));
      xDomain = [min([xBaseline, ...xValues]), max([xBaseline, ...xValues])];
    }
    if (yBaseline != null && Array.isArray(data)) {
      const yValues = data.flatMap(accessor(y));
      yDomain = [min([yBaseline, ...yValues]), max([yBaseline, ...yValues])];
    }
    yReverse = yScale ? !isScaleBand(yScale) : true;
    _x = x;
    _y = y;
    _yRange = yRange ?? (radial ? ({ height }) => [0, height / 2] : void 0);
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      LayerCake($$renderer3, spread_props([
        {
          data,
          x: _x,
          xDomain,
          xRange: xRange ?? (radial ? [0, 2 * Math.PI] : void 0),
          y: _y,
          yScale,
          yDomain,
          yRange: _yRange,
          yReverse,
          xDomainSort: false,
          yDomainSort: false,
          zDomainSort: false,
          rDomainSort: false
        },
        $$restProps,
        {
          children: invalid_default_snippet,
          $$slots: {
            default: ($$renderer4, {
              aspectRatio,
              containerHeight,
              containerWidth,
              height,
              width,
              element,
              x: x2,
              xScale,
              xGet,
              y: y2,
              yScale: yScale2,
              yGet,
              z,
              zScale,
              zGet,
              r,
              rScale,
              rGet,
              padding
            }) => {
              const initialTransform = geo?.applyTransform?.includes("translate") && geo?.fitGeojson && geo?.projection ? geoFitObjectTransform(geo.projection(), [width, height], geo.fitGeojson) : void 0;
              ChartContext($$renderer4, {
                data,
                radial,
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
                onresize,
                children: invalid_default_snippet,
                $$slots: {
                  default: ($$renderer5, {
                    data: data2,
                    flatData,
                    config,
                    x1: x12,
                    x1Scale: x1Scale2,
                    x1Get,
                    y1: y12,
                    y1Scale: y1Scale2,
                    y1Get,
                    c: c2,
                    cScale: cScale2,
                    cGet
                  }) => {
                    $$renderer5.push(`<!---->`);
                    {
                      TransformContext($$renderer5, spread_props([
                        {
                          mode: transform?.mode ?? geo?.applyTransform?.length ? "manual" : "none",
                          initialTranslate: initialTransform?.translate,
                          initialScale: initialTransform?.scale,
                          processTranslate: geo ? (x3, y3, deltaX, deltaY) => {
                            if (geo.applyTransform?.includes("rotate")) {
                              const projectionScale = store_get($$store_subs ??= {}, "$geoProjection", geoProjection).scale();
                              const sensitivity = 75;
                              return {
                                x: x3 + deltaX * (sensitivity / projectionScale),
                                y: y3 + deltaY * (sensitivity / projectionScale) * -1
                              };
                            } else {
                              return { x: x3 + deltaX, y: y3 + deltaY };
                            }
                          } : void 0
                        },
                        transform,
                        {
                          ondragstart,
                          ontransform,
                          ondragend,
                          children: invalid_default_snippet,
                          $$slots: {
                            default: ($$renderer6, { transform: _transform }) => {
                              GeoContext($$renderer6, spread_props([
                                geo,
                                {
                                  get geo() {
                                    return geoProjection;
                                  },
                                  set geo($$value) {
                                    geoProjection = $$value;
                                    $$settled = false;
                                  },
                                  children: invalid_default_snippet,
                                  $$slots: {
                                    default: ($$renderer7, { projection }) => {
                                      const brushProps = typeof brush === "object" ? brush : { disabled: !brush };
                                      BrushContext($$renderer7, spread_props([
                                        brushProps,
                                        {
                                          get brush() {
                                            return brushContext;
                                          },
                                          set brush($$value) {
                                            brushContext = $$value;
                                            $$settled = false;
                                          },
                                          children: invalid_default_snippet,
                                          $$slots: {
                                            default: ($$renderer8, { brush: brush2 }) => {
                                              const tooltipProps = typeof tooltip === "object" ? tooltip : {};
                                              TooltipContext($$renderer8, spread_props([
                                                tooltipProps,
                                                {
                                                  get tooltip() {
                                                    return tooltipContext2;
                                                  },
                                                  set tooltip($$value) {
                                                    tooltipContext2 = $$value;
                                                    $$settled = false;
                                                  },
                                                  children: invalid_default_snippet,
                                                  $$slots: {
                                                    default: ($$renderer9, { tooltip: tooltip2 }) => {
                                                      $$renderer9.push(`<!--[-->`);
                                                      slot(
                                                        $$renderer9,
                                                        $$props,
                                                        "default",
                                                        {
                                                          aspectRatio,
                                                          containerHeight,
                                                          containerWidth,
                                                          height,
                                                          width,
                                                          element,
                                                          projection,
                                                          transform: _transform,
                                                          tooltip: tooltip2,
                                                          brush: brush2,
                                                          x: x2,
                                                          xScale,
                                                          xGet,
                                                          y: y2,
                                                          yScale: yScale2,
                                                          yGet,
                                                          z,
                                                          zScale,
                                                          zGet,
                                                          r,
                                                          rScale,
                                                          rGet,
                                                          x1: x12,
                                                          x1Scale: x1Scale2,
                                                          x1Get,
                                                          y1: y12,
                                                          y1Scale: y1Scale2,
                                                          y1Get,
                                                          c: c2,
                                                          cScale: cScale2,
                                                          cGet,
                                                          padding,
                                                          data: data2,
                                                          flatData,
                                                          config
                                                        },
                                                        null
                                                      );
                                                      $$renderer9.push(`<!--]-->`);
                                                    }
                                                  }
                                                }
                                              ]));
                                            }
                                          }
                                        }
                                      ]));
                                    }
                                  }
                                }
                              ]));
                            }
                          }
                        }
                      ]));
                    }
                    $$renderer5.push(`<!---->`);
                  }
                }
              });
            }
          }
        }
      ]));
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, {
      data,
      x,
      xRange,
      y,
      yScale,
      yRange,
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
      xBaseline,
      yBaseline,
      radial,
      geo,
      geoProjection,
      tooltip,
      tooltipContext: tooltipContext2,
      transform,
      transformContext: transformContext2,
      brush,
      brushContext,
      onresize,
      ondragstart,
      ondragend,
      ontransform
    });
  });
}
function Line($$renderer, $$props) {
  const $$slots = sanitize_slots($$props);
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "x1",
    "initialX1",
    "y1",
    "initialY1",
    "x2",
    "initialX2",
    "y2",
    "initialY2",
    "fill",
    "stroke",
    "strokeWidth",
    "class",
    "onclick",
    "onpointerenter",
    "onpointermove",
    "onpointerleave",
    "marker",
    "markerStart",
    "markerEnd",
    "spring",
    "tweened"
  ]);
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let markerStartId, markerEndId, fillKey, strokeKey;
    let x1 = $$props["x1"];
    let initialX1 = fallback($$props["initialX1"], x1);
    let y1 = $$props["y1"];
    let initialY1 = fallback($$props["initialY1"], y1);
    let x2 = $$props["x2"];
    let initialX2 = fallback($$props["initialX2"], x2);
    let y2 = $$props["y2"];
    let initialY2 = fallback($$props["initialY2"], y2);
    let fill = fallback($$props["fill"], void 0);
    let stroke = fallback($$props["stroke"], void 0);
    let strokeWidth = fallback($$props["strokeWidth"], void 0);
    let className = fallback($$props["class"], void 0);
    let onclick = fallback($$props["onclick"], void 0);
    let onpointerenter = fallback($$props["onpointerenter"], void 0);
    let onpointermove = fallback($$props["onpointermove"], void 0);
    let onpointerleave = fallback($$props["onpointerleave"], void 0);
    let marker = fallback($$props["marker"], void 0);
    let markerStart = fallback($$props["markerStart"], marker);
    let markerEnd = fallback($$props["markerEnd"], marker);
    let spring = fallback($$props["spring"], void 0);
    let tweened = fallback($$props["tweened"], void 0);
    let tweened_x1 = motionStore(initialX1, { spring, tweened });
    let tweened_y1 = motionStore(initialY1, { spring, tweened });
    let tweened_x2 = motionStore(initialX2, { spring, tweened });
    let tweened_y2 = motionStore(initialY2, { spring, tweened });
    const renderContext = getRenderContext();
    const canvasContext = getCanvasContext();
    function render(ctx, styleOverrides) {
      const pathData = `M ${store_get($$store_subs ??= {}, "$tweened_x1", tweened_x1)},${store_get($$store_subs ??= {}, "$tweened_y1", tweened_y1)} L ${store_get($$store_subs ??= {}, "$tweened_x2", tweened_x2)},${store_get($$store_subs ??= {}, "$tweened_y2", tweened_y2)}`;
      renderPathData(ctx, pathData, styleOverrides ? merge({ styles: { strokeWidth } }, styleOverrides) : { styles: { fill, stroke, strokeWidth }, classes: className });
    }
    let canvasUnregister;
    onDestroy(() => {
      if (renderContext === "canvas") {
        canvasUnregister();
      }
    });
    markerStartId = markerStart || $$slots["markerStart"] ? uniqueId("marker-") : "";
    markerEndId = markerEnd || $$slots["markerEnd"] ? uniqueId("marker-") : "";
    tick().then(() => {
      tweened_x1.set(x1);
      tweened_y1.set(y1);
      tweened_x2.set(x2);
      tweened_y2.set(y2);
    });
    fillKey = fill && typeof fill === "object" ? objectId(fill) : fill;
    strokeKey = stroke && typeof stroke === "object" ? objectId(stroke) : stroke;
    if (renderContext === "canvas") {
      store_get($$store_subs ??= {}, "$tweened_x1", tweened_x1) && store_get($$store_subs ??= {}, "$tweened_y1", tweened_y1) && store_get($$store_subs ??= {}, "$tweened_x2", tweened_x2) && store_get($$store_subs ??= {}, "$tweened_y2", tweened_y2) && fillKey && strokeKey && strokeWidth && className;
      canvasContext.invalidate();
    }
    if (renderContext === "canvas") {
      canvasUnregister = canvasContext.register({
        name: "Line",
        render,
        events: {
          click: onclick,
          pointerenter: onpointerenter,
          pointermove: onpointermove,
          pointerleave: onpointerleave
        }
      });
    }
    if (renderContext === "svg") {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<line${attributes(
        {
          x1: store_get($$store_subs ??= {}, "$tweened_x1", tweened_x1),
          y1: store_get($$store_subs ??= {}, "$tweened_y1", tweened_y1),
          x2: store_get($$store_subs ??= {}, "$tweened_x2", tweened_x2),
          y2: store_get($$store_subs ??= {}, "$tweened_y2", tweened_y2),
          fill,
          stroke,
          "stroke-width": strokeWidth,
          "marker-start": markerStartId ? `url(#${markerStartId})` : void 0,
          "marker-end": markerEndId ? `url(#${markerEndId})` : void 0,
          class: clsx(cls(stroke === void 0 && "stroke-surface-content", className)),
          ...$$restProps
        },
        void 0,
        void 0,
        void 0,
        3
      )}></line><!--[-->`);
      slot($$renderer2, $$props, "markerStart", { id: markerStartId }, () => {
        if (markerStart) {
          $$renderer2.push("<!--[-->");
          Marker($$renderer2, spread_props([
            {
              id: markerStartId,
              type: typeof markerStart === "string" ? markerStart : void 0
            },
            typeof markerStart === "object" ? markerStart : null
          ]));
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]-->`);
      });
      $$renderer2.push(`<!--]--><!--[-->`);
      slot($$renderer2, $$props, "markerEnd", { id: markerEndId }, () => {
        Marker($$renderer2, spread_props([
          {
            id: markerEndId,
            type: typeof markerEnd === "string" ? markerEnd : void 0
          },
          typeof markerEnd === "object" ? markerEnd : null
        ]));
      });
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, {
      x1,
      initialX1,
      y1,
      initialY1,
      x2,
      initialX2,
      y2,
      initialY2,
      fill,
      stroke,
      strokeWidth,
      class: className,
      onclick,
      onpointerenter,
      onpointermove,
      onpointerleave,
      marker,
      markerStart,
      markerEnd,
      spring,
      tweened
    });
  });
}
function Circle($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "cx",
    "initialCx",
    "cy",
    "initialCy",
    "r",
    "initialR",
    "spring",
    "tweened",
    "fill",
    "fillOpacity",
    "stroke",
    "strokeWidth",
    "class",
    "onclick",
    "onpointerdown",
    "onpointerenter",
    "onpointermove",
    "onpointerleave"
  ]);
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let fillKey, strokeKey;
    let cx = fallback($$props["cx"], 0);
    let initialCx = fallback($$props["initialCx"], cx);
    let cy = fallback($$props["cy"], 0);
    let initialCy = fallback($$props["initialCy"], cy);
    let r = fallback($$props["r"], 1);
    let initialR = fallback($$props["initialR"], r);
    let spring = fallback($$props["spring"], void 0);
    let tweened = fallback($$props["tweened"], void 0);
    let fill = fallback($$props["fill"], void 0);
    let fillOpacity = fallback($$props["fillOpacity"], void 0);
    let stroke = fallback($$props["stroke"], void 0);
    let strokeWidth = fallback($$props["strokeWidth"], void 0);
    let className = fallback($$props["class"], void 0);
    let onclick = fallback($$props["onclick"], void 0);
    let onpointerdown = fallback($$props["onpointerdown"], void 0);
    let onpointerenter = fallback($$props["onpointerenter"], void 0);
    let onpointermove = fallback($$props["onpointermove"], void 0);
    let onpointerleave = fallback($$props["onpointerleave"], void 0);
    let tweened_cx = motionStore(initialCx, { spring, tweened });
    let tweened_cy = motionStore(initialCy, { spring, tweened });
    let tweened_r = motionStore(initialR, { spring, tweened });
    const renderContext = getRenderContext();
    const canvasContext = getCanvasContext();
    function render(ctx, styleOverrides) {
      renderCircle(
        ctx,
        {
          cx: store_get($$store_subs ??= {}, "$tweened_cx", tweened_cx),
          cy: store_get($$store_subs ??= {}, "$tweened_cy", tweened_cy),
          r: store_get($$store_subs ??= {}, "$tweened_r", tweened_r)
        },
        styleOverrides ? merge({ styles: { strokeWidth } }, styleOverrides) : {
          styles: { fill, fillOpacity, stroke, strokeWidth },
          classes: className
        }
      );
    }
    let canvasUnregister;
    onDestroy(() => {
      if (renderContext === "canvas") {
        canvasUnregister();
      }
    });
    tick().then(() => {
      tweened_cx.set(cx);
      tweened_cy.set(cy);
      tweened_r.set(r);
    });
    fillKey = fill && typeof fill === "object" ? objectId(fill) : fill;
    strokeKey = stroke && typeof stroke === "object" ? objectId(stroke) : stroke;
    if (renderContext === "canvas") {
      store_get($$store_subs ??= {}, "$tweened_cx", tweened_cx) && store_get($$store_subs ??= {}, "$tweened_cy", tweened_cy) && store_get($$store_subs ??= {}, "$tweened_r", tweened_r) && fillKey && fillOpacity && strokeKey && strokeWidth && className;
      canvasContext.invalidate();
    }
    if (renderContext === "canvas") {
      canvasUnregister = canvasContext.register({
        name: "Circle",
        render,
        events: {
          click: onclick,
          pointerdown: onpointerdown,
          pointerenter: onpointerenter,
          pointermove: onpointermove,
          pointerleave: onpointerleave
        }
      });
    }
    if (renderContext === "svg") {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<circle${attributes(
        {
          cx: store_get($$store_subs ??= {}, "$tweened_cx", tweened_cx),
          cy: store_get($$store_subs ??= {}, "$tweened_cy", tweened_cy),
          r: store_get($$store_subs ??= {}, "$tweened_r", tweened_r),
          fill,
          "fill-opacity": fillOpacity,
          stroke,
          "stroke-width": strokeWidth,
          class: clsx(cls(fill == null && "fill-surface-content", className)),
          ...$$restProps
        },
        void 0,
        void 0,
        void 0,
        3
      )}></circle>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, {
      cx,
      initialCx,
      cy,
      initialCy,
      r,
      initialR,
      spring,
      tweened,
      fill,
      fillOpacity,
      stroke,
      strokeWidth,
      class: className,
      onclick,
      onpointerdown,
      onpointerenter,
      onpointermove,
      onpointerleave
    });
  });
}
function Rule($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["x", "xOffset", "y", "yOffset"]);
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let xRangeMin, xRangeMax, yRangeMin, yRangeMax, showRule;
    const { xScale, yScale, xRange, yRange, radial } = chartContext();
    let x = fallback($$props["x"], false);
    let xOffset = fallback($$props["xOffset"], 0);
    let y = fallback($$props["y"], false);
    let yOffset = fallback($$props["yOffset"], 0);
    [xRangeMin, xRangeMax] = extent(store_get($$store_subs ??= {}, "$xRange", xRange));
    [yRangeMin, yRangeMax] = extent(store_get($$store_subs ??= {}, "$yRange", yRange));
    showRule = (value, axis) => {
      switch (typeof value) {
        case "boolean":
          return value;
        case "string":
          return true;
        default:
          if (axis === "x") {
            return store_get($$store_subs ??= {}, "$xScale", xScale)(value) >= xRangeMin && store_get($$store_subs ??= {}, "$xScale", xScale)(value) <= xRangeMax;
          } else {
            return store_get($$store_subs ??= {}, "$yScale", yScale)(value) >= yRangeMin && store_get($$store_subs ??= {}, "$yScale", yScale)(value) <= yRangeMax;
          }
      }
    };
    $$renderer2.push(`<g class="rule">`);
    if (showRule(x, "x")) {
      $$renderer2.push("<!--[-->");
      const xCoord = x === true || x === "left" ? xRangeMin : x === "right" ? xRangeMax : store_get($$store_subs ??= {}, "$xScale", xScale)(x) + xOffset;
      if (store_get($$store_subs ??= {}, "$radial", radial)) {
        $$renderer2.push("<!--[-->");
        const [x1, y1] = pointRadial(xCoord, Number(yRangeMin));
        const [x2, y2] = pointRadial(xCoord, Number(yRangeMax));
        Line($$renderer2, spread_props([
          { x1, y1, x2, y2 },
          $$restProps,
          {
            class: cls("stroke-surface-content/10", $$sanitized_props.class)
          }
        ]));
      } else {
        $$renderer2.push("<!--[!-->");
        Line($$renderer2, spread_props([
          {
            x1: xCoord,
            x2: xCoord,
            y1: store_get($$store_subs ??= {}, "$yRange", yRange)[0] || 0,
            y2: store_get($$store_subs ??= {}, "$yRange", yRange)[1] || 0
          },
          $$restProps,
          {
            class: cls("stroke-surface-content/50", $$sanitized_props.class)
          }
        ]));
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
    if (showRule(y, "y")) {
      $$renderer2.push("<!--[-->");
      if (store_get($$store_subs ??= {}, "$radial", radial)) {
        $$renderer2.push("<!--[-->");
        Circle($$renderer2, {
          r: y === true || y === "bottom" ? yRangeMax : y === "top" ? yRangeMin : store_get($$store_subs ??= {}, "$yScale", yScale)(y) + yOffset,
          class: cls("fill-none stroke-surface-content/50", $$sanitized_props.class)
        });
      } else {
        $$renderer2.push("<!--[!-->");
        Line($$renderer2, spread_props([
          {
            x1: store_get($$store_subs ??= {}, "$xRange", xRange)[0] || 0,
            x2: store_get($$store_subs ??= {}, "$xRange", xRange)[1] || 0,
            y1: y === true || y === "bottom" ? yRangeMax : y === "top" ? yRangeMin : store_get($$store_subs ??= {}, "$yScale", yScale)(y) + yOffset,
            y2: y === true || y === "bottom" ? yRangeMax : y === "top" ? yRangeMin : store_get($$store_subs ??= {}, "$yScale", yScale)(y) + yOffset
          },
          $$restProps,
          {
            class: cls("stroke-surface-content/50", $$sanitized_props.class)
          }
        ]));
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></g>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { x, xOffset, y, yOffset });
  });
}
function Text($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "value",
    "width",
    "x",
    "initialX",
    "y",
    "initialY",
    "dx",
    "dy",
    "lineHeight",
    "capHeight",
    "scaleToFit",
    "textAnchor",
    "verticalAnchor",
    "rotate",
    "fill",
    "fillOpacity",
    "stroke",
    "strokeWidth",
    "class",
    "spring",
    "tweened"
  ]);
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let words, lines, rotateTransform, transform, fillKey, strokeKey;
    let value = fallback($$props["value"], 0);
    let width = fallback($$props["width"], void 0);
    let x = fallback($$props["x"], 0);
    let initialX = fallback($$props["initialX"], x);
    let y = fallback($$props["y"], 0);
    let initialY = fallback($$props["initialY"], y);
    let dx = fallback($$props["dx"], 0);
    let dy = fallback($$props["dy"], 0);
    let lineHeight = fallback($$props["lineHeight"], "1em");
    let capHeight = fallback($$props["capHeight"], "0.71em");
    let scaleToFit = fallback($$props["scaleToFit"], false);
    let textAnchor = fallback($$props["textAnchor"], "start");
    let verticalAnchor = fallback($$props["verticalAnchor"], "end");
    let rotate = fallback($$props["rotate"], void 0);
    let fill = fallback($$props["fill"], void 0);
    let fillOpacity = fallback($$props["fillOpacity"], void 0);
    let stroke = fallback($$props["stroke"], void 0);
    let strokeWidth = fallback($$props["strokeWidth"], void 0);
    let className = fallback($$props["class"], void 0);
    let wordsByLines = [];
    let wordsWithWidth = [];
    let spaceWidth = 0;
    let style = void 0;
    function getPixelValue(cssValue) {
      if (typeof cssValue === "number") {
        return cssValue;
      }
      const [match, value2, units] = cssValue.match(/([\d.]+)(\D+)/);
      const number = Number(value2);
      switch (units) {
        case "px":
          return number;
        case "em":
        case "rem":
          return number * 16;
        default:
          return 0;
      }
    }
    let startDy = 0;
    let scaleTransform = "";
    function isValidXOrY(xOrY) {
      return (
        // number that is not NaN or Infinity
        typeof xOrY === "number" && Number.isFinite(xOrY) || // for percentage
        typeof xOrY === "string"
      );
    }
    let spring = fallback($$props["spring"], void 0);
    let tweened = fallback($$props["tweened"], void 0);
    let tweened_x = motionStore(initialX, { spring, tweened });
    let tweened_y = motionStore(initialY, { spring, tweened });
    const renderContext = getRenderContext();
    const canvasContext = getCanvasContext();
    function render(ctx, styleOverrides) {
      wordsByLines.forEach((line2, index) => {
        renderText(
          ctx,
          line2.words.join(" "),
          {
            x: getPixelValue(store_get($$store_subs ??= {}, "$tweened_x", tweened_x)) + getPixelValue(dx),
            y: getPixelValue(store_get($$store_subs ??= {}, "$tweened_y", tweened_y)) + getPixelValue(dy) + (index === 0 ? startDy : getPixelValue(lineHeight))
          },
          styleOverrides ? merge({ styles: { strokeWidth } }, styleOverrides) : {
            styles: {
              fill,
              fillOpacity,
              stroke,
              strokeWidth,
              paintOrder: "stroke",
              textAnchor
            },
            classes: cls(fill === void 0 && "fill-surface-content", className)
          }
        );
      });
    }
    let canvasUnregister;
    onDestroy(() => {
      if (renderContext === "canvas") {
        canvasUnregister();
      }
    });
    words = value != null ? value.toString().split(/(?:(?!\u00A0+)\s+)/) : [];
    wordsWithWidth = words.map((word) => ({ word, width: getStringWidth(word, style) || 0 }));
    spaceWidth = getStringWidth(" ", style) || 0;
    wordsByLines = wordsWithWidth.reduce(
      (result, item) => {
        const currentLine = result[result.length - 1];
        if (currentLine && (width == null || scaleToFit || (currentLine.width || 0) + item.width + spaceWidth < width)) {
          currentLine.words.push(item.word);
          currentLine.width = currentLine.width || 0;
          currentLine.width += item.width + spaceWidth;
        } else {
          const newLine = { words: [item.word], width: item.width };
          result.push(newLine);
        }
        return result;
      },
      []
    );
    lines = wordsByLines.length;
    if (verticalAnchor === "start") {
      startDy = getPixelValue(capHeight);
    } else if (verticalAnchor === "middle") {
      startDy = (lines - 1) / 2 * -getPixelValue(lineHeight) + getPixelValue(capHeight) / 2;
    } else {
      startDy = (lines - 1) * -getPixelValue(lineHeight);
    }
    if (scaleToFit && lines > 0 && typeof x == "number" && typeof y == "number" && typeof width == "number") {
      const lineWidth = wordsByLines[0].width || 1;
      const sx = width / lineWidth;
      const sy = sx;
      const originX = x - sx * x;
      const originY = y - sy * y;
      scaleTransform = `matrix(${sx}, 0, 0, ${sy}, ${originX}, ${originY})`;
    } else {
      scaleTransform = "";
    }
    rotateTransform = rotate ? `rotate(${rotate}, ${x}, ${y})` : "";
    transform = `${scaleTransform} ${rotateTransform}`;
    tick().then(() => {
      tweened_x.set(x);
      tweened_y.set(y);
    });
    fillKey = fill && typeof fill === "object" ? objectId(fill) : fill;
    strokeKey = stroke && typeof stroke === "object" ? objectId(stroke) : stroke;
    if (renderContext === "canvas") {
      value && store_get($$store_subs ??= {}, "$tweened_x", tweened_x) && store_get($$store_subs ??= {}, "$tweened_y", tweened_y) && fillKey && strokeKey && strokeWidth && className;
      canvasContext.invalidate();
    }
    if (renderContext === "canvas") {
      canvasUnregister = canvasContext.register({ name: "Text", render });
    }
    if (renderContext === "svg") {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<svg${attr("x", dx)}${attr("y", dy)} class="overflow-visible [paint-order:stroke]">`);
      if (isValidXOrY(x) && isValidXOrY(y)) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<text${attributes(
          {
            x: store_get($$store_subs ??= {}, "$tweened_x", tweened_x),
            y: store_get($$store_subs ??= {}, "$tweened_y", tweened_y),
            transform,
            "text-anchor": textAnchor,
            ...$$restProps,
            fill,
            "fill-opacity": fillOpacity,
            stroke,
            "stroke-width": strokeWidth,
            class: clsx(cls(fill === void 0 && "fill-surface-content", className))
          },
          void 0,
          void 0,
          void 0,
          3
        )}><!--[-->`);
        const each_array = ensure_array_like(wordsByLines);
        for (let index = 0, $$length = each_array.length; index < $$length; index++) {
          let line2 = each_array[index];
          $$renderer2.push(`<tspan${attr("x", store_get($$store_subs ??= {}, "$tweened_x", tweened_x))}${attr("dy", index === 0 ? startDy : lineHeight)}>${escape_html(line2.words.join(" "))}</tspan>`);
        }
        $$renderer2.push(`<!--]--></text>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></svg>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, {
      value,
      width,
      x,
      initialX,
      y,
      initialY,
      dx,
      dy,
      lineHeight,
      capHeight,
      scaleToFit,
      textAnchor,
      verticalAnchor,
      rotate,
      fill,
      fillOpacity,
      stroke,
      strokeWidth,
      class: className,
      spring,
      tweened
    });
  });
}
function Axis($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let orientation, _scale, tickVals, resolvedLabelProps;
    const { xScale, yScale, xRange, yRange, width, height, padding } = chartContext();
    let placement = $$props["placement"];
    let label = fallback($$props["label"], "");
    let labelPlacement = fallback($$props["labelPlacement"], "middle");
    let labelProps = fallback($$props["labelProps"], void 0);
    let rule = fallback($$props["rule"], false);
    let grid = fallback($$props["grid"], false);
    let ticks = fallback($$props["ticks"], void 0);
    let tickLength = fallback($$props["tickLength"], 4);
    let format$1 = fallback($$props["format"], void 0);
    let tickLabelProps = fallback($$props["tickLabelProps"], void 0);
    let spring = fallback($$props["spring"], void 0);
    let tweened = fallback($$props["tweened"], void 0);
    let transitionIn = fallback($$props["transitionIn"], tweened ? fade : () => {
      return {};
    });
    let transitionInParams = fallback($$props["transitionInParams"], () => ({ easing: cubicIn }), true);
    let scale = fallback($$props["scale"], void 0);
    let classes = fallback($$props["classes"], () => ({}), true);
    function getCoords(tick2, xRange2, yRange2) {
      const [xRangeMin, xRangeMax] = extent(xRange2);
      const [yRangeMin, yRangeMax] = extent(yRange2);
      switch (placement) {
        case "top":
          return {
            x: _scale(tick2) + (isScaleBand(_scale) ? _scale.bandwidth() / 2 : 0),
            y: yRangeMin
          };
        case "bottom":
          return {
            x: _scale(tick2) + (isScaleBand(_scale) ? _scale.bandwidth() / 2 : 0),
            y: yRangeMax
          };
        case "left":
          return {
            x: xRangeMin,
            y: _scale(tick2) + (isScaleBand(_scale) ? _scale.bandwidth() / 2 : 0)
          };
        case "right":
          return {
            x: xRangeMax,
            y: _scale(tick2) + (isScaleBand(_scale) ? _scale.bandwidth() / 2 : 0)
          };
        case "angle":
          return { x: _scale(tick2), y: yRangeMax };
        case "radius":
          return { x: xRangeMin, y: _scale(tick2) };
      }
    }
    function getDefaultTickLabelProps(tick2) {
      switch (placement) {
        case "top":
          return {
            textAnchor: "middle",
            verticalAnchor: "end",
            dy: -tickLength - 2
            // manually adjusted until Text supports custom styles
          };
        case "bottom":
          return {
            textAnchor: "middle",
            verticalAnchor: "start",
            dy: tickLength
            // manually adjusted until Text supports custom styles
          };
        case "left":
          return {
            textAnchor: "end",
            verticalAnchor: "middle",
            dx: -tickLength,
            dy: -2
            // manually adjusted until Text supports custom styles
          };
        case "right":
          return {
            textAnchor: "start",
            verticalAnchor: "middle",
            dx: tickLength,
            dy: -2
            // manually adjusted until Text supports custom styles
          };
        case "angle":
          const xValue = _scale(tick2);
          return {
            textAnchor: xValue === 0 || Math.abs(xValue - Math.PI) < 0.01 || // ~180deg
            Math.abs(xValue - Math.PI * 2) < 0.01 ? (
              // ~360deg
              // ~360deg
              "middle"
            ) : xValue > Math.PI ? "end" : "start",
            verticalAnchor: "middle",
            dx: Math.sin(xValue) * (tickLength + 2),
            dy: -Math.cos(xValue) * (tickLength + 4)
            // manually adjusted until Text supports custom styles
          };
        case "radius":
          return {
            textAnchor: "middle",
            verticalAnchor: "middle",
            dx: 2,
            dy: -2
            // manually adjusted until Text supports custom styles
          };
      }
    }
    orientation = placement === "angle" ? "angle" : placement === "radius" ? "radius" : ["top", "bottom"].includes(placement) ? "horizontal" : "vertical";
    _scale = scale ?? (["horizontal", "angle"].includes(orientation) ? store_get($$store_subs ??= {}, "$xScale", xScale) : store_get($$store_subs ??= {}, "$yScale", yScale));
    tickVals = Array.isArray(ticks) ? ticks : typeof ticks === "function" ? ticks(_scale) : isLiteralObject(ticks) ? _scale.ticks(ticks.interval) : isScaleBand(_scale) ? ticks ? _scale.domain().filter((v, i) => i % ticks === 0) : _scale.domain() : _scale.ticks(ticks ?? (placement === "left" || placement === "right" ? 4 : void 0));
    resolvedLabelProps = {
      value: label,
      x: placement === "left" || orientation === "horizontal" && labelPlacement === "start" ? -store_get($$store_subs ??= {}, "$padding", padding).left : placement === "right" || orientation === "horizontal" && labelPlacement === "end" ? store_get($$store_subs ??= {}, "$width", width) + store_get($$store_subs ??= {}, "$padding", padding).right : store_get($$store_subs ??= {}, "$width", width) / 2,
      y: placement === "top" || orientation === "vertical" && labelPlacement === "start" ? -store_get($$store_subs ??= {}, "$padding", padding).top : orientation === "vertical" && labelPlacement === "middle" ? store_get($$store_subs ??= {}, "$height", height) / 2 : placement === "bottom" || labelPlacement === "end" ? store_get($$store_subs ??= {}, "$height", height) + store_get($$store_subs ??= {}, "$padding", padding).bottom : 0,
      textAnchor: labelPlacement === "middle" ? "middle" : placement === "right" || orientation === "horizontal" && labelPlacement === "end" ? "end" : "start",
      verticalAnchor: placement === "top" || orientation === "vertical" && labelPlacement === "start" || placement === "left" && labelPlacement === "middle" ? "start" : "end",
      rotate: orientation === "vertical" && labelPlacement === "middle" ? -90 : 0,
      capHeight: ".5rem",
      // text-[10px]
      ...labelProps,
      class: cls("label text-[10px] stroke-surface-100 [stroke-width:2px] font-light", classes.label, labelProps?.class)
    };
    $$renderer2.push(`<g${attr_class(clsx(cls("Axis placement-{placement}", classes.root, $$sanitized_props.class)))}>`);
    if (rule !== false) {
      $$renderer2.push("<!--[-->");
      const ruleProps = typeof rule === "object" ? rule : null;
      Rule($$renderer2, spread_props([
        {
          x: placement === "left" || placement === "right" ? placement : placement === "angle",
          y: placement === "top" || placement === "bottom" ? placement : placement === "radius",
          tweened,
          spring
        },
        ruleProps,
        {
          class: cls("rule stroke-surface-content/50", classes.rule, ruleProps?.class)
        }
      ]));
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
    if (label) {
      $$renderer2.push("<!--[-->");
      Text($$renderer2, spread_props([resolvedLabelProps]));
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--><!--[-->`);
    const each_array = ensure_array_like(tickVals);
    for (let index = 0, $$length = each_array.length; index < $$length; index++) {
      let tick2 = each_array[index];
      const tickCoords = getCoords(tick2, store_get($$store_subs ??= {}, "$xRange", xRange), store_get($$store_subs ??= {}, "$yRange", yRange));
      const [radialTickCoordsX, radialTickCoordsY] = pointRadial(tickCoords.x, tickCoords.y);
      const [radialTickMarkCoordsX, radialTickMarkCoordsY] = pointRadial(tickCoords.x, tickCoords.y + tickLength);
      const resolvedTickLabelProps = {
        x: orientation === "angle" ? radialTickCoordsX : tickCoords.x,
        y: orientation === "angle" ? radialTickCoordsY : tickCoords.y,
        value: format(tick2, format$1 ?? _scale.tickFormat?.() ?? ((v) => v)),
        ...getDefaultTickLabelProps(tick2),
        tweened,
        spring,
        ...tickLabelProps,
        class: cls("tickLabel text-[10px] stroke-surface-100 [stroke-width:2px] font-light", classes.tickLabel, tickLabelProps?.class)
      };
      $$renderer2.push(`<g>`);
      if (grid !== false) {
        $$renderer2.push("<!--[-->");
        const ruleProps = typeof grid === "object" ? grid : null;
        Rule($$renderer2, spread_props([
          {
            x: orientation === "horizontal" || orientation === "angle" ? tick2 : false,
            y: orientation === "vertical" || orientation === "radius" ? tick2 : false,
            tweened,
            spring
          },
          ruleProps,
          {
            class: cls("grid stroke-surface-content/10", classes.rule, ruleProps?.class)
          }
        ]));
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
      if (orientation === "horizontal") {
        $$renderer2.push("<!--[-->");
        Line($$renderer2, {
          x1: tickCoords.x,
          y1: tickCoords.y,
          x2: tickCoords.x,
          y2: tickCoords.y + (placement === "top" ? -tickLength : tickLength),
          tweened,
          spring,
          class: cls("tick stroke-surface-content/50", classes.tick)
        });
      } else if (orientation === "vertical") {
        $$renderer2.push("<!--[1-->");
        Line($$renderer2, {
          x1: tickCoords.x,
          y1: tickCoords.y,
          x2: tickCoords.x + (placement === "left" ? -tickLength : tickLength),
          y2: tickCoords.y,
          tweened,
          spring,
          class: cls("tick stroke-surface-content/50", classes.tick)
        });
      } else if (orientation === "angle") {
        $$renderer2.push("<!--[2-->");
        Line($$renderer2, {
          x1: radialTickCoordsX,
          y1: radialTickCoordsY,
          x2: radialTickMarkCoordsX,
          y2: radialTickMarkCoordsY,
          tweened,
          spring,
          class: cls("tick stroke-surface-content/50", classes.tick)
        });
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--><!--[-->`);
      slot($$renderer2, $$props, "tickLabel", { labelProps: resolvedTickLabelProps, index }, () => {
        Text($$renderer2, spread_props([resolvedTickLabelProps]));
      });
      $$renderer2.push(`<!--]--></g>`);
    }
    $$renderer2.push(`<!--]--></g>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, {
      placement,
      label,
      labelPlacement,
      labelProps,
      rule,
      grid,
      ticks,
      tickLength,
      format: format$1,
      tickLabelProps,
      spring,
      tweened,
      transitionIn,
      transitionInParams,
      scale,
      classes
    });
  });
}
function Grid($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let xTickVals, yTickVals, xBandOffset, yBandOffset;
    const { xScale, yScale, radial } = chartContext();
    let x = fallback($$props["x"], false);
    let y = fallback($$props["y"], false);
    let xTicks = fallback($$props["xTicks"], void 0);
    let yTicks = fallback($$props["yTicks"], () => !isScaleBand(store_get($$store_subs ??= {}, "$yScale", yScale)) ? 4 : void 0, true);
    let bandAlign = fallback($$props["bandAlign"], "center");
    let radialY = fallback($$props["radialY"], "circle");
    let spring = fallback($$props["spring"], void 0);
    let tweened = fallback($$props["tweened"], void 0);
    let transitionIn = fallback($$props["transitionIn"], tweened ? fade : () => {
      return {};
    });
    let transitionInParams = fallback($$props["transitionInParams"], () => ({ easing: cubicIn }), true);
    let classes = fallback($$props["classes"], () => ({}), true);
    function getTickVals(scale, ticks) {
      return Array.isArray(ticks) ? ticks : typeof ticks === "function" ? ticks(scale) : isScaleBand(scale) ? ticks ? scale.domain().filter((v, i) => i % ticks === 0) : scale.domain() : scale.ticks?.(ticks);
    }
    xTickVals = getTickVals(store_get($$store_subs ??= {}, "$xScale", xScale), xTicks);
    yTickVals = getTickVals(store_get($$store_subs ??= {}, "$yScale", yScale), yTicks);
    xBandOffset = isScaleBand(store_get($$store_subs ??= {}, "$xScale", xScale)) ? bandAlign === "between" ? -(store_get($$store_subs ??= {}, "$xScale", xScale).padding() * store_get($$store_subs ??= {}, "$xScale", xScale).step()) / 2 : (
      // before
      store_get($$store_subs ??= {}, "$xScale", xScale).step() / 2 - store_get($$store_subs ??= {}, "$xScale", xScale).padding() * store_get($$store_subs ??= {}, "$xScale", xScale).step() / 2
    ) : (
      // center
      0
    );
    yBandOffset = isScaleBand(store_get($$store_subs ??= {}, "$yScale", yScale)) ? bandAlign === "between" ? -(store_get($$store_subs ??= {}, "$yScale", yScale).padding() * store_get($$store_subs ??= {}, "$yScale", yScale).step()) / 2 : (
      // before
      store_get($$store_subs ??= {}, "$yScale", yScale).step() / 2 - store_get($$store_subs ??= {}, "$yScale", yScale).padding() * store_get($$store_subs ??= {}, "$yScale", yScale).step() / 2
    ) : (
      // center
      0
    );
    $$renderer2.push(`<g${attr_class(clsx(cls("Grid", classes.root, $$sanitized_props.class)))}>`);
    if (x) {
      $$renderer2.push("<!--[-->");
      const splineProps = typeof x === "object" ? x : null;
      $$renderer2.push(`<g><!--[-->`);
      const each_array = ensure_array_like(xTickVals);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let x2 = each_array[$$index];
        if (store_get($$store_subs ??= {}, "$radial", radial)) {
          $$renderer2.push("<!--[-->");
          Spline($$renderer2, spread_props([
            {
              data: yTickVals.map((y2) => ({ x: x2, y: y2 })),
              x: "x",
              y: "y",
              xOffset: xBandOffset,
              curve: curveLinearClosed,
              tweened,
              spring
            },
            splineProps,
            {
              class: cls("stroke-surface-content/10", classes.line, splineProps?.class)
            }
          ]));
        } else {
          $$renderer2.push("<!--[!-->");
          Rule($$renderer2, spread_props([
            { x: x2, xOffset: xBandOffset, tweened, spring },
            splineProps,
            {
              class: cls("stroke-surface-content/10", classes.line, splineProps?.class)
            }
          ]));
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]-->`);
      if (isScaleBand(store_get($$store_subs ??= {}, "$xScale", xScale)) && bandAlign === "between" && !store_get($$store_subs ??= {}, "$radial", radial) && xTickVals.length) {
        $$renderer2.push("<!--[-->");
        Rule($$renderer2, spread_props([
          {
            x: xTickVals[xTickVals.length - 1],
            xOffset: xBandOffset + store_get($$store_subs ??= {}, "$xScale", xScale).step(),
            tweened,
            spring
          },
          splineProps,
          {
            class: cls("stroke-surface-content/10", classes.line, splineProps?.class)
          }
        ]));
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></g>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
    if (y) {
      $$renderer2.push("<!--[-->");
      const splineProps = typeof y === "object" ? y : null;
      $$renderer2.push(`<g><!--[-->`);
      const each_array_1 = ensure_array_like(yTickVals);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let y2 = each_array_1[$$index_1];
        if (store_get($$store_subs ??= {}, "$radial", radial)) {
          $$renderer2.push("<!--[-->");
          if (radialY === "circle") {
            $$renderer2.push("<!--[-->");
            Circle($$renderer2, spread_props([
              {
                r: store_get($$store_subs ??= {}, "$yScale", yScale)(y2),
                tweened,
                spring
              },
              splineProps,
              {
                class: cls("fill-none stroke-surface-content/10", classes.line, splineProps?.class)
              }
            ]));
          } else {
            $$renderer2.push("<!--[!-->");
            Spline($$renderer2, spread_props([
              {
                data: xTickVals.map((x2) => ({ x: x2, y: y2 })),
                x: "x",
                y: "y",
                yOffset: yBandOffset,
                tweened,
                spring,
                curve: curveLinearClosed
              },
              splineProps,
              {
                class: cls("stroke-surface-content/10", classes.line, splineProps?.class)
              }
            ]));
          }
          $$renderer2.push(`<!--]-->`);
        } else {
          $$renderer2.push("<!--[!-->");
          Rule($$renderer2, spread_props([
            { y: y2, yOffset: yBandOffset, tweened, spring },
            splineProps,
            {
              class: cls("stroke-surface-content/10", classes.line, splineProps?.class)
            }
          ]));
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]-->`);
      if (isScaleBand(store_get($$store_subs ??= {}, "$yScale", yScale)) && bandAlign === "between" && !store_get($$store_subs ??= {}, "$radial", radial) && yTickVals.length) {
        $$renderer2.push("<!--[-->");
        Rule($$renderer2, spread_props([
          {
            y: yTickVals[yTickVals.length - 1],
            yOffset: yBandOffset + store_get($$store_subs ??= {}, "$yScale", yScale).step(),
            tweened,
            spring
          },
          splineProps,
          {
            class: cls("stroke-surface-content/10", classes.line, splineProps?.class)
          }
        ]));
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></g>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></g>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, {
      x,
      y,
      xTicks,
      yTicks,
      bandAlign,
      radialY,
      spring,
      tweened,
      transitionIn,
      transitionInParams,
      classes
    });
  });
}
function createDimensionGetter(context, options) {
  const { xScale, yScale, x: xAccessor, y: yAccessor, x1: x1Accessor, y1: y1Accessor, x1Scale, y1Scale } = context;
  return derived([xScale, x1Scale, yScale, y1Scale, xAccessor, yAccessor, x1Accessor, y1Accessor], ([$xScale, $x1Scale, $yScale, $y1Scale, $xAccessor, $yAccessor, $x1Accessor, $y1Accessor]) => {
    const insets = resolveInsets(options?.insets);
    const [minXDomain, maxXDomain] = $xScale.domain();
    const [minYDomain, maxYDomain] = $yScale.domain();
    const _x = accessor(options?.x ?? $xAccessor);
    const _y = accessor(options?.y ?? $yAccessor);
    const _x1 = accessor(options?.x1 ?? $x1Accessor);
    const _y1 = accessor(options?.y1 ?? $y1Accessor);
    return function getter(item) {
      if (isScaleBand($yScale)) {
        const y = firstValue($yScale(_y(item)) ?? 0) + ($y1Scale ? $y1Scale(_y1(item)) : 0) + insets.top;
        const height = Math.max(0, $yScale.bandwidth ? ($y1Scale ? $y1Scale.bandwidth?.() ?? 0 : $yScale.bandwidth()) - insets.bottom - insets.top : 0);
        const xValue = _x(item);
        let left = 0;
        let right = 0;
        if (Array.isArray(xValue)) {
          left = min(xValue);
          right = max(xValue);
        } else if (xValue == null) {
          left = 0;
          right = 0;
        } else if (xValue > 0) {
          left = max([0, minXDomain]);
          right = xValue;
        } else {
          left = xValue;
          right = min([0, maxXDomain]);
        }
        const x = $xScale(left) + insets.left;
        const width = Math.max(0, $xScale(right) - $xScale(left) - insets.left - insets.right);
        return { x, y, width, height };
      } else {
        const x = firstValue($xScale(_x(item))) + ($x1Scale ? $x1Scale(_x1(item)) : 0) + insets.left;
        const width = Math.max(0, $xScale.bandwidth ? ($x1Scale ? $x1Scale.bandwidth?.() ?? 0 : $xScale.bandwidth()) - insets.left - insets.right : 0);
        const yValue = _y(item);
        let top = 0;
        let bottom = 0;
        if (Array.isArray(yValue)) {
          top = max(yValue);
          bottom = min(yValue);
        } else if (yValue == null) {
          top = 0;
          bottom = 0;
        } else if (yValue > 0) {
          top = yValue;
          bottom = max([0, minYDomain]);
        } else {
          top = min([0, maxYDomain]);
          bottom = yValue;
        }
        const y = $yScale(top) + insets.top;
        const height = $yScale(bottom) - $yScale(top) - insets.bottom - insets.top;
        return { x, y, width, height };
      }
    };
  });
}
function firstValue(value) {
  return Array.isArray(value) ? value[0] : value;
}
function resolveInsets(insets) {
  const all = insets?.all ?? 0;
  const x = insets?.x ?? all;
  const y = insets?.y ?? all;
  const left = insets?.left ?? x;
  const right = insets?.right ?? x;
  const top = insets?.top ?? y;
  const bottom = insets?.bottom ?? y;
  return { left, right, bottom, top };
}
function Bar($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "bar",
    "x",
    "y",
    "x1",
    "y1",
    "fill",
    "stroke",
    "strokeWidth",
    "radius",
    "rounded",
    "insets",
    "onclick",
    "onpointerenter",
    "onpointermove",
    "onpointerleave",
    "spring",
    "tweened"
  ]);
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let getDimensions, dimensions, isVertical, valueAccessor, value, resolvedValue, _rounded, topLeft, topRight, bottomLeft, bottomRight, width, height, diameter, pathData;
    const { x: xContext, y: yContext, xScale } = chartContext();
    let bar = $$props["bar"];
    let x = fallback($$props["x"], () => store_get($$store_subs ??= {}, "$xContext", xContext), true);
    let y = fallback($$props["y"], () => store_get($$store_subs ??= {}, "$yContext", yContext), true);
    let x1 = fallback($$props["x1"], void 0);
    let y1 = fallback($$props["y1"], void 0);
    let fill = fallback($$props["fill"], void 0);
    let stroke = fallback($$props["stroke"], "black");
    let strokeWidth = fallback($$props["strokeWidth"], 0);
    let radius = fallback($$props["radius"], 0);
    let rounded = fallback($$props["rounded"], "all");
    let insets = fallback($$props["insets"], void 0);
    let onclick = fallback($$props["onclick"], void 0);
    let onpointerenter = fallback($$props["onpointerenter"], void 0);
    let onpointermove = fallback($$props["onpointermove"], void 0);
    let onpointerleave = fallback($$props["onpointerleave"], void 0);
    let spring = fallback($$props["spring"], void 0);
    let tweened = fallback($$props["tweened"], void 0);
    getRenderContext();
    getCanvasContext();
    if (stroke === null || stroke === void 0) stroke = "black";
    getDimensions = createDimensionGetter(chartContext(), { x, y, x1, y1, insets });
    dimensions = store_get($$store_subs ??= {}, "$getDimensions", getDimensions)(bar) ?? { x: 0, y: 0, width: 0, height: 0 };
    isVertical = isScaleBand(store_get($$store_subs ??= {}, "$xScale", xScale));
    valueAccessor = accessor(isVertical ? y : x);
    value = valueAccessor(bar);
    resolvedValue = Array.isArray(value) ? greatestAbs(value) : value;
    _rounded = rounded === "edge" ? isVertical ? resolvedValue >= 0 ? "top" : "bottom" : resolvedValue >= 0 ? "right" : "left" : rounded;
    topLeft = ["all", "top", "left", "top-left"].includes(_rounded);
    topRight = ["all", "top", "right", "top-right"].includes(_rounded);
    bottomLeft = ["all", "bottom", "left", "bottom-left"].includes(_rounded);
    bottomRight = ["all", "bottom", "right", "bottom-right"].includes(_rounded);
    width = dimensions.width;
    height = dimensions.height;
    diameter = 2 * radius;
    pathData = `M${dimensions.x + radius},${dimensions.y} h${width - diameter}
      ${topRight ? `a${radius},${radius} 0 0 1 ${radius},${radius}` : `h${radius}v${radius}`}
      v${height - diameter}
      ${bottomRight ? `a${radius},${radius} 0 0 1 ${-radius},${radius}` : `v${radius}h${-radius}`}
      h${diameter - width}
      ${bottomLeft ? `a${radius},${radius} 0 0 1 ${-radius},${-radius}` : `h${-radius}v${-radius}`}
      v${diameter - height}
      ${topLeft ? `a${radius},${radius} 0 0 1 ${radius},${-radius}` : `v${-radius}h${radius}`}
      z`.split("\n").join("");
    if (_rounded === "all" || _rounded === "none" || radius === 0) {
      $$renderer2.push("<!--[-->");
      Rect($$renderer2, spread_props([
        {
          fill,
          spring,
          tweened,
          stroke,
          strokeWidth,
          rx: _rounded === "none" ? 0 : radius,
          onclick,
          onpointerenter,
          onpointermove,
          onpointerleave
        },
        dimensions,
        $$restProps
      ]));
    } else {
      $$renderer2.push("<!--[!-->");
      Spline($$renderer2, spread_props([
        {
          pathData,
          fill,
          spring,
          tweened,
          stroke,
          strokeWidth,
          onclick,
          onpointerenter,
          onpointermove,
          onpointerleave
        },
        $$restProps
      ]));
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, {
      bar,
      x,
      y,
      x1,
      y1,
      fill,
      stroke,
      strokeWidth,
      radius,
      rounded,
      insets,
      onclick,
      onpointerenter,
      onpointermove,
      onpointerleave,
      spring,
      tweened
    });
  });
}
function asAny(x) {
  return x;
}
function Highlight($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let highlightData;
    const {
      data: contextData,
      flatData,
      x: xContext,
      xDomain,
      xScale,
      xRange,
      y: yContext,
      yDomain,
      yScale,
      yRange,
      cGet,
      config,
      radial
    } = chartContext();
    const tooltip = tooltipContext();
    let data = fallback($$props["data"], void 0);
    let x = fallback($$props["x"], () => store_get($$store_subs ??= {}, "$xContext", xContext), true);
    let y = fallback($$props["y"], () => store_get($$store_subs ??= {}, "$yContext", yContext), true);
    let axis = fallback($$props["axis"], void 0);
    let points = fallback($$props["points"], false);
    let lines = fallback($$props["lines"], false);
    let area = fallback($$props["area"], false);
    let bar = fallback($$props["bar"], false);
    let motion = fallback($$props["motion"], true);
    let onareaclick = fallback($$props["onareaclick"], void 0);
    let onbarclick = fallback($$props["onbarclick"], void 0);
    let onpointclick = fallback($$props["onpointclick"], void 0);
    let onpointenter = fallback($$props["onpointenter"], void 0);
    let onpointleave = fallback($$props["onpointleave"], void 0);
    const _x = accessor(x);
    const _y = accessor(y);
    let _points = [];
    let _lines = [];
    let _area = { x: 0, y: 0, width: 0, height: 0 };
    highlightData = data ?? store_get($$store_subs ??= {}, "$tooltip", tooltip).data;
    if (highlightData) {
      const xValue = _x(highlightData);
      const xCoord = Array.isArray(xValue) ? xValue.map((v) => store_get($$store_subs ??= {}, "$xScale", xScale)(v)) : store_get($$store_subs ??= {}, "$xScale", xScale)(xValue);
      const xOffset = isScaleBand(store_get($$store_subs ??= {}, "$xScale", xScale)) && !store_get($$store_subs ??= {}, "$radial", radial) ? store_get($$store_subs ??= {}, "$xScale", xScale).bandwidth() / 2 : 0;
      const yValue = _y(highlightData);
      const yCoord = Array.isArray(yValue) ? yValue.map((v) => store_get($$store_subs ??= {}, "$yScale", yScale)(v)) : store_get($$store_subs ??= {}, "$yScale", yScale)(yValue);
      const yOffset = isScaleBand(store_get($$store_subs ??= {}, "$yScale", yScale)) && !store_get($$store_subs ??= {}, "$radial", radial) ? store_get($$store_subs ??= {}, "$yScale", yScale).bandwidth() / 2 : 0;
      _lines = [];
      const defaultAxis = isScaleBand(store_get($$store_subs ??= {}, "$yScale", yScale)) ? "y" : "x";
      if (axis == null) {
        axis = defaultAxis;
      }
      if (axis === "x" || axis === "both") {
        if (Array.isArray(xCoord)) {
          _lines = [
            ..._lines,
            ...xCoord.filter(notNull).map((xItem, i) => ({
              x1: xItem + xOffset,
              y1: min(store_get($$store_subs ??= {}, "$yRange", yRange)),
              x2: xItem + xOffset,
              y2: max(store_get($$store_subs ??= {}, "$yRange", yRange))
            }))
          ];
        } else if (xCoord) {
          _lines = [
            ..._lines,
            {
              x1: xCoord + xOffset,
              y1: min(store_get($$store_subs ??= {}, "$yRange", yRange)),
              x2: xCoord + xOffset,
              y2: max(store_get($$store_subs ??= {}, "$yRange", yRange))
            }
          ];
        }
        if (Array.isArray(xCoord)) {
          _area.width = max(xCoord) - min(xCoord);
        } else if (isScaleBand(store_get($$store_subs ??= {}, "$xScale", xScale))) {
          _area.width = store_get($$store_subs ??= {}, "$xScale", xScale).step();
        } else {
          const index = store_get($$store_subs ??= {}, "$flatData", flatData).findIndex((d) => Number(_x(d)) === Number(_x(highlightData)));
          const isLastPoint = index + 1 === store_get($$store_subs ??= {}, "$flatData", flatData).length;
          const nextDataPoint = isLastPoint ? max(store_get($$store_subs ??= {}, "$xDomain", xDomain)) : _x(store_get($$store_subs ??= {}, "$flatData", flatData)[index + 1]);
          _area.width = (store_get($$store_subs ??= {}, "$xScale", xScale)(nextDataPoint) ?? 0) - (xCoord ?? 0);
        }
        _area.x = (Array.isArray(xCoord) ? min(xCoord) : xCoord) - (isScaleBand(store_get($$store_subs ??= {}, "$xScale", xScale)) ? store_get($$store_subs ??= {}, "$xScale", xScale).padding() * store_get($$store_subs ??= {}, "$xScale", xScale).step() / 2 : 0);
        if (axis === "x") {
          _area.height = max(store_get($$store_subs ??= {}, "$yRange", yRange));
        }
      }
      if (axis === "y" || axis === "both") {
        if (Array.isArray(yCoord)) {
          _lines = [
            ..._lines,
            ...yCoord.filter(notNull).map((yItem, i) => ({
              x1: min(store_get($$store_subs ??= {}, "$xRange", xRange)),
              y1: yItem + yOffset,
              x2: max(store_get($$store_subs ??= {}, "$xRange", xRange)),
              y2: yItem + yOffset
            }))
          ];
        } else if (yCoord) {
          _lines = [
            ..._lines,
            {
              x1: min(store_get($$store_subs ??= {}, "$xRange", xRange)),
              y1: yCoord + yOffset,
              x2: max(store_get($$store_subs ??= {}, "$xRange", xRange)),
              y2: yCoord + yOffset
            }
          ];
        }
        if (Array.isArray(yCoord)) {
          _area.height = max(yCoord) - min(yCoord);
        } else if (isScaleBand(store_get($$store_subs ??= {}, "$yScale", yScale))) {
          _area.height = store_get($$store_subs ??= {}, "$yScale", yScale).step();
        } else {
          const index = store_get($$store_subs ??= {}, "$flatData", flatData).findIndex((d) => Number(_x(d)) === Number(_x(highlightData)));
          const isLastPoint = index + 1 === store_get($$store_subs ??= {}, "$flatData", flatData).length;
          const nextDataPoint = isLastPoint ? max(store_get($$store_subs ??= {}, "$yDomain", yDomain)) : _x(store_get($$store_subs ??= {}, "$flatData", flatData)[index + 1]);
          _area.height = (store_get($$store_subs ??= {}, "$yScale", yScale)(nextDataPoint) ?? 0) - (yCoord ?? 0);
        }
        _area.y = (Array.isArray(yCoord) ? min(yCoord) : yCoord) - (isScaleBand(store_get($$store_subs ??= {}, "$yScale", yScale)) ? store_get($$store_subs ??= {}, "$yScale", yScale).padding() * store_get($$store_subs ??= {}, "$yScale", yScale).step() / 2 : 0);
        if (axis === "y") {
          _area.width = max(store_get($$store_subs ??= {}, "$xRange", xRange));
        }
      }
      if (Array.isArray(xCoord)) {
        if (Array.isArray(highlightData)) {
          const highlightSeriesPoint = highlightData;
          if (Array.isArray(store_get($$store_subs ??= {}, "$contextData", contextData))) {
            const seriesPointsData = store_get($$store_subs ??= {}, "$contextData", contextData).map((series) => {
              return {
                series,
                point: series.find((d) => _y(d) === _y(highlightSeriesPoint))
              };
            }).filter((d) => d.point);
            _points = seriesPointsData.map((seriesPoint, i) => {
              return {
                x: store_get($$store_subs ??= {}, "$xScale", xScale)(seriesPoint.point[1]) + xOffset,
                y: yCoord + yOffset,
                fill: store_get($$store_subs ??= {}, "$config", config).c ? store_get($$store_subs ??= {}, "$cGet", cGet)(seriesPoint.series) : null,
                data: { x: seriesPoint.point[1], y: yValue }
              };
            });
          }
        } else {
          _points = xCoord.filter(notNull).map((xItem, i) => {
            const $key = store_get($$store_subs ??= {}, "$config", config).x[i];
            return {
              x: xItem + xOffset,
              y: yCoord + yOffset,
              // TODO: is there a better way to expose the series key/value?
              fill: store_get($$store_subs ??= {}, "$config", config).c ? store_get($$store_subs ??= {}, "$cGet", cGet)({ ...highlightData, $key }) : null,
              data: {
                x: xValue,
                // TODO: use highlightData[$key]?
                y: yValue
              }
            };
          });
        }
      } else if (Array.isArray(yCoord)) {
        if (Array.isArray(highlightData)) {
          const highlightSeriesPoint = highlightData;
          if (Array.isArray(store_get($$store_subs ??= {}, "$contextData", contextData))) {
            const seriesPointsData = store_get($$store_subs ??= {}, "$contextData", contextData).map((series) => {
              return {
                series,
                point: series.find((d) => _x(d) === _x(highlightSeriesPoint))
              };
            }).filter((d) => d.point);
            _points = seriesPointsData.map((seriesPoint, i) => ({
              x: xCoord + xOffset,
              y: store_get($$store_subs ??= {}, "$yScale", yScale)(seriesPoint.point[1]) + yOffset,
              fill: store_get($$store_subs ??= {}, "$config", config).c ? store_get($$store_subs ??= {}, "$cGet", cGet)(seriesPoint.series) : null,
              data: { x: xValue, y: seriesPoint.point[1] }
            }));
          }
        } else {
          _points = yCoord.filter(notNull).map((yItem, i) => {
            const $key = store_get($$store_subs ??= {}, "$config", config).y[i];
            return {
              x: xCoord + xOffset,
              y: yItem + yOffset,
              // TODO: is there a better way to expose the series key/value?
              fill: store_get($$store_subs ??= {}, "$config", config).c ? store_get($$store_subs ??= {}, "$cGet", cGet)({ ...highlightData, $key }) : null,
              data: {
                x: xValue,
                y: yValue
                // TODO: use highlightData[$key] ?
              }
            };
          });
        }
      } else if (xCoord != null && yCoord != null) {
        _points = [
          {
            x: xCoord + xOffset,
            y: yCoord + yOffset,
            fill: store_get($$store_subs ??= {}, "$config", config).c ? store_get($$store_subs ??= {}, "$cGet", cGet)(highlightData) : null,
            data: { x: xValue, y: yValue }
          }
        ];
      } else {
        _points = [];
      }
      if (store_get($$store_subs ??= {}, "$radial", radial)) {
        _points = _points.map((p) => {
          const [x2, y2] = pointRadial(p.x, p.y);
          return { ...p, x: x2, y: y2 };
        });
        _lines = _lines.map((l) => {
          const [x1, y1] = pointRadial(l.x1, l.y1);
          const [x2, y2] = pointRadial(l.x2, l.y2);
          return { ...l, x1, y1, x2, y2 };
        });
      }
    }
    if (highlightData) {
      $$renderer2.push("<!--[-->");
      if (area) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "area", { area: _area }, () => {
          Rect($$renderer2, spread_props([
            { spring: motion },
            _area,
            typeof area === "object" ? area : null,
            {
              class: cls(!area.fill && "fill-surface-content/5", typeof area === "object" ? area.class : null),
              onclick: onareaclick && ((e) => onareaclick(e, { data: highlightData }))
            }
          ]));
        });
        $$renderer2.push(`<!--]-->`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (bar) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "bar", { bar }, () => {
          Bar($$renderer2, spread_props([
            { spring: motion, bar: highlightData },
            typeof bar === "object" ? bar : null,
            {
              class: cls(!bar.fill && "fill-primary", typeof bar === "object" ? bar.class : null),
              onclick: onbarclick && ((e) => onbarclick(e, { data: highlightData }))
            }
          ]));
        });
        $$renderer2.push(`<!--]-->`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (lines) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "lines", { lines: _lines }, () => {
          $$renderer2.push(`<!--[-->`);
          const each_array = ensure_array_like(_lines);
          for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
            let line2 = each_array[$$index];
            Line($$renderer2, spread_props([
              {
                spring: motion,
                x1: line2.x1,
                y1: line2.y1,
                x2: line2.x2,
                y2: line2.y2
              },
              typeof lines === "object" ? lines : null,
              {
                class: cls("stroke-surface-content/20 stroke-2 [stroke-dasharray:2,2] pointer-events-none", typeof lines === "object" ? lines.class : null)
              }
            ]));
          }
          $$renderer2.push(`<!--]-->`);
        });
        $$renderer2.push(`<!--]-->`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (points) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "points", { points: _points }, () => {
          $$renderer2.push(`<!--[-->`);
          const each_array_1 = ensure_array_like(_points);
          for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
            let point = each_array_1[$$index_1];
            Circle($$renderer2, spread_props([
              {
                spring: motion,
                cx: point.x,
                cy: point.y,
                fill: point.fill,
                r: 4,
                strokeWidth: 6
              },
              typeof points === "object" ? points : null,
              {
                class: cls("stroke-white [paint-order:stroke] drop-shadow", !point.fill && (typeof points === "boolean" || !points.fill) && "fill-primary", typeof points === "object" ? points.class : null),
                onpointerdown: onpointclick && ((e) => {
                  e.stopPropagation();
                }),
                onclick: onpointclick && ((e) => onpointclick(e, { point, data: highlightData })),
                onpointerenter: onpointenter && ((e) => {
                  if (onpointclick) {
                    asAny(e.target).style.cursor = "pointer";
                  }
                  onpointenter(e, { point, data: highlightData });
                }),
                onpointerleave: onpointleave && ((e) => {
                  if (onpointclick) {
                    asAny(e.target).style.cursor = "default";
                  }
                  onpointleave(e, { point, data: highlightData });
                })
              }
            ]));
          }
          $$renderer2.push(`<!--]-->`);
        });
        $$renderer2.push(`<!--]-->`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, {
      data,
      x,
      y,
      axis,
      points,
      lines,
      area,
      bar,
      motion,
      onareaclick,
      onbarclick,
      onpointclick,
      onpointenter,
      onpointleave
    });
  });
}
function Link($$renderer, $$props) {
  const $$slots = sanitize_slots($$props);
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "data",
    "sankey",
    "source",
    "target",
    "orientation",
    "x",
    "y",
    "curve",
    "onclick",
    "onpointerenter",
    "onpointermove",
    "onpointerleave",
    "onpointerover",
    "onpointerout",
    "marker",
    "markerStart",
    "markerMid",
    "markerEnd",
    "tweened"
  ]);
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let markerStartId, markerMidId, markerEndId, tweened_d;
    let data = fallback($$props["data"], void 0);
    let sankey = fallback($$props["sankey"], false);
    let source = fallback($$props["source"], sankey ? (d) => [d.source.x1, d.y0] : (d) => d.source);
    let target = fallback($$props["target"], sankey ? (d) => [d.target.x0, d.y1] : (d) => d.target);
    let orientation = fallback($$props["orientation"], sankey ? "horizontal" : "vertical");
    let x = fallback($$props["x"], (d) => sankey ? d[0] : orientation === "horizontal" ? d.y : d.x);
    let y = fallback($$props["y"], (d) => sankey ? d[1] : orientation === "horizontal" ? d.x : d.y);
    let curve = fallback($$props["curve"], orientation === "horizontal" ? curveBumpX : curveBumpY);
    let onclick = fallback($$props["onclick"], void 0);
    let onpointerenter = fallback($$props["onpointerenter"], void 0);
    let onpointermove = fallback($$props["onpointermove"], void 0);
    let onpointerleave = fallback($$props["onpointerleave"], void 0);
    let onpointerover = fallback($$props["onpointerover"], void 0);
    let onpointerout = fallback($$props["onpointerout"], void 0);
    let marker = fallback($$props["marker"], void 0);
    let markerStart = fallback($$props["markerStart"], marker);
    let markerMid = fallback($$props["markerMid"], marker);
    let markerEnd = fallback($$props["markerEnd"], marker);
    let tweened = fallback($$props["tweened"], void 0);
    const tweenedOptions = tweened ? {
      interpolate: interpolatePath,
      ...typeof tweened === "object" ? tweened : null
    } : false;
    markerStartId = markerStart || $$slots["markerStart"] ? uniqueId("marker-") : "";
    markerMidId = markerMid || $$slots["markerMid"] ? uniqueId("marker-") : "";
    markerEndId = markerEnd || $$slots["markerEnd"] ? uniqueId("marker-") : "";
    tweened_d = motionStore("", { tweened: tweenedOptions });
    {
      const link$1 = link(curve).source(source).target(target).x(x).y(y);
      const d = link$1(data) ?? "";
      tweened_d.set(d);
    }
    Spline($$renderer2, spread_props([
      {
        class: "path-link",
        pathData: store_get($$store_subs ??= {}, "$tweened_d", tweened_d),
        fill: "none",
        "marker-start": markerStartId ? `url(#${markerStartId})` : void 0,
        "marker-mid": markerMidId ? `url(#${markerMidId})` : void 0,
        "marker-end": markerEndId ? `url(#${markerEndId})` : void 0,
        onclick,
        onpointerenter,
        onpointermove,
        onpointerleave,
        onpointerover,
        onpointerout
      },
      $$restProps
    ]));
    $$renderer2.push(`<!----> <!--[-->`);
    slot($$renderer2, $$props, "markerStart", { id: markerStartId }, () => {
      if (markerStart) {
        $$renderer2.push("<!--[-->");
        Marker($$renderer2, spread_props([
          {
            id: markerStartId,
            type: typeof markerStart === "string" ? markerStart : void 0
          },
          typeof markerStart === "object" ? markerStart : null
        ]));
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    });
    $$renderer2.push(`<!--]--> <!--[-->`);
    slot($$renderer2, $$props, "markerMid", { id: markerMidId }, () => {
      Marker($$renderer2, spread_props([
        {
          id: markerMidId,
          type: typeof markerMid === "string" ? markerMid : void 0
        },
        typeof markerMid === "object" ? markerMid : null
      ]));
    });
    $$renderer2.push(`<!--]--> <!--[-->`);
    slot($$renderer2, $$props, "markerEnd", { id: markerEndId }, () => {
      Marker($$renderer2, spread_props([
        {
          id: markerEndId,
          type: typeof markerEnd === "string" ? markerEnd : void 0
        },
        typeof markerEnd === "object" ? markerEnd : null
      ]));
    });
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, {
      data,
      sankey,
      source,
      target,
      orientation,
      x,
      y,
      curve,
      onclick,
      onpointerenter,
      onpointermove,
      onpointerleave,
      onpointerover,
      onpointerout,
      marker,
      markerStart,
      markerMid,
      markerEnd,
      tweened
    });
  });
}
function Points($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "data",
    "x",
    "y",
    "r",
    "offsetX",
    "offsetY",
    "links",
    "fill",
    "fillOpacity",
    "stroke",
    "strokeWidth",
    "class"
  ]);
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let xAccessor, yAccessor, pointsData, points, _links;
    const context = chartContext();
    const {
      data: contextData,
      x: contextX,
      xScale,
      xGet,
      y: contextY,
      yScale,
      yGet,
      cGet,
      rGet,
      config,
      radial
    } = context;
    let data = fallback($$props["data"], void 0);
    let x = fallback($$props["x"], void 0);
    let y = fallback($$props["y"], void 0);
    let r = fallback($$props["r"], 5);
    let offsetX = fallback($$props["offsetX"], void 0);
    let offsetY = fallback($$props["offsetY"], void 0);
    let links = fallback($$props["links"], false);
    let fill = fallback($$props["fill"], void 0);
    let fillOpacity = fallback($$props["fillOpacity"], void 0);
    let stroke = fallback($$props["stroke"], void 0);
    let strokeWidth = fallback($$props["strokeWidth"], void 0);
    let className = fallback($$props["class"], void 0);
    function getOffset(value, offset, scale) {
      if (typeof offset === "function") {
        return offset(value, context);
      } else if (offset != null) {
        return offset;
      } else if (isScaleBand(scale) && !store_get($$store_subs ??= {}, "$radial", radial)) {
        return scale.bandwidth() / 2;
      } else {
        return 0;
      }
    }
    xAccessor = x ? accessor(x) : store_get($$store_subs ??= {}, "$contextX", contextX);
    yAccessor = y ? accessor(y) : store_get($$store_subs ??= {}, "$contextY", contextY);
    pointsData = data ?? store_get($$store_subs ??= {}, "$contextData", contextData);
    points = pointsData.flatMap((d) => {
      const xValue = xAccessor(d);
      const yValue = yAccessor(d);
      if (Array.isArray(xValue)) {
        return xValue.filter(notNull).map((xValue2) => {
          return {
            x: store_get($$store_subs ??= {}, "$xScale", xScale)(xValue2) + getOffset(store_get($$store_subs ??= {}, "$xScale", xScale)(xValue2), offsetX, store_get($$store_subs ??= {}, "$xScale", xScale)),
            y: store_get($$store_subs ??= {}, "$yScale", yScale)(yValue) + getOffset(store_get($$store_subs ??= {}, "$yScale", yScale)(yValue), offsetY, store_get($$store_subs ??= {}, "$yScale", yScale)),
            r: store_get($$store_subs ??= {}, "$config", config).r ? store_get($$store_subs ??= {}, "$rGet", rGet)(d) : r,
            xValue: xValue2,
            yValue,
            data: d
          };
        });
      } else if (Array.isArray(yValue)) {
        return yValue.filter(notNull).map((yValue2) => {
          return {
            x: store_get($$store_subs ??= {}, "$xScale", xScale)(xValue) + getOffset(store_get($$store_subs ??= {}, "$xScale", xScale)(xValue), offsetX, store_get($$store_subs ??= {}, "$xScale", xScale)),
            y: store_get($$store_subs ??= {}, "$yScale", yScale)(yValue2) + getOffset(store_get($$store_subs ??= {}, "$yScale", yScale)(yValue2), offsetY, store_get($$store_subs ??= {}, "$yScale", yScale)),
            r: store_get($$store_subs ??= {}, "$config", config).r ? store_get($$store_subs ??= {}, "$rGet", rGet)(d) : r,
            xValue,
            yValue: yValue2,
            data: d
          };
        });
      } else if (xValue != null && yValue != null) {
        return {
          x: store_get($$store_subs ??= {}, "$xScale", xScale)(xValue) + getOffset(store_get($$store_subs ??= {}, "$xScale", xScale)(xValue), offsetX, store_get($$store_subs ??= {}, "$xScale", xScale)),
          y: store_get($$store_subs ??= {}, "$yScale", yScale)(yValue) + getOffset(store_get($$store_subs ??= {}, "$yScale", yScale)(yValue), offsetY, store_get($$store_subs ??= {}, "$yScale", yScale)),
          r: store_get($$store_subs ??= {}, "$config", config).r ? store_get($$store_subs ??= {}, "$rGet", rGet)(d) : r,
          xValue,
          yValue,
          data: d
        };
      }
    }).filter((p) => p);
    _links = pointsData.flatMap((d) => {
      const xValue = xAccessor(d);
      const yValue = yAccessor(d);
      if (Array.isArray(xValue)) {
        const [xMin, xMax] = extent(store_get($$store_subs ??= {}, "$xGet", xGet)(d));
        const y2 = store_get($$store_subs ??= {}, "$yGet", yGet)(d) + getOffset(store_get($$store_subs ??= {}, "$yGet", yGet)(d), offsetY, store_get($$store_subs ??= {}, "$yScale", yScale));
        return {
          source: {
            x: xMin + getOffset(xMin, offsetX, store_get($$store_subs ??= {}, "$xScale", xScale)) + (store_get($$store_subs ??= {}, "$config", config).r ? store_get($$store_subs ??= {}, "$rGet", rGet)(d) : r),
            y: y2
          },
          target: {
            x: xMax + getOffset(xMax, offsetX, store_get($$store_subs ??= {}, "$xScale", xScale)) - (store_get($$store_subs ??= {}, "$config", config).r ? store_get($$store_subs ??= {}, "$rGet", rGet)(d) : r),
            y: y2
          },
          data: d
        };
      } else if (Array.isArray(yValue)) {
        const x2 = store_get($$store_subs ??= {}, "$xGet", xGet)(d) + getOffset(store_get($$store_subs ??= {}, "$xGet", xGet)(d), offsetX, store_get($$store_subs ??= {}, "$xScale", xScale));
        const [yMin, yMax] = extent(store_get($$store_subs ??= {}, "$yGet", yGet)(d));
        return {
          source: {
            x: x2,
            y: yMin + getOffset(yMin, offsetY, store_get($$store_subs ??= {}, "$yScale", yScale))
          },
          target: {
            x: x2,
            y: yMax + getOffset(yMax, offsetY, store_get($$store_subs ??= {}, "$yScale", yScale))
          },
          data: d
        };
      }
    });
    $$renderer2.push(`<!--[-->`);
    slot($$renderer2, $$props, "default", { points }, () => {
      if (links) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<!--[-->`);
        const each_array = ensure_array_like(_links);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let link2 = each_array[$$index];
          Link($$renderer2, spread_props([
            {
              data: link2,
              stroke: fill ?? (store_get($$store_subs ??= {}, "$config", config).c ? store_get($$store_subs ??= {}, "$cGet", cGet)(link2.data) : null)
            },
            typeof links === "object" ? links : null
          ]));
        }
        $$renderer2.push(`<!--]-->`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <!--[-->`);
      const each_array_1 = ensure_array_like(points);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let point = each_array_1[$$index_1];
        const radialPoint = pointRadial(point.x, point.y);
        Circle($$renderer2, spread_props([
          {
            cx: store_get($$store_subs ??= {}, "$radial", radial) ? radialPoint[0] : point.x,
            cy: store_get($$store_subs ??= {}, "$radial", radial) ? radialPoint[1] : point.y,
            r: point.r,
            fill: fill ?? (store_get($$store_subs ??= {}, "$config", config).c ? store_get($$store_subs ??= {}, "$cGet", cGet)(point.data) : null),
            fillOpacity,
            stroke,
            strokeWidth,
            class: className
          },
          $$restProps
        ]));
      }
      $$renderer2.push(`<!--]-->`);
    });
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, {
      data,
      x,
      y,
      r,
      offsetX,
      offsetY,
      links,
      fill,
      fillOpacity,
      stroke,
      strokeWidth,
      class: className
    });
  });
}
function Labels($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "data",
    "value",
    "x",
    "y",
    "placement",
    "offset",
    "format",
    "key"
  ]);
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let getTextProps;
    const { xScale, yScale } = chartContext();
    let data = fallback($$props["data"], void 0);
    let value = fallback($$props["value"], void 0);
    let x = fallback($$props["x"], void 0);
    let y = fallback($$props["y"], void 0);
    let placement = fallback($$props["placement"], "outside");
    let offset = fallback($$props["offset"], placement === "center" ? 0 : 4);
    let format$1 = fallback($$props["format"], void 0);
    let key = fallback($$props["key"], (d, i) => i);
    getTextProps = (point) => {
      const pointValue = isScaleBand(store_get($$store_subs ??= {}, "$yScale", yScale)) ? point.xValue : point.yValue;
      const displayValue = value ? accessor(value)(point.data) : isScaleBand(store_get($$store_subs ??= {}, "$yScale", yScale)) ? point.xValue : point.yValue;
      const formattedValue = format(displayValue, format$1 ?? (value ? void 0 : isScaleBand(store_get($$store_subs ??= {}, "$yScale", yScale)) ? store_get($$store_subs ??= {}, "$xScale", xScale).tickFormat?.() : store_get($$store_subs ??= {}, "$yScale", yScale).tickFormat?.()));
      if (isScaleBand(store_get($$store_subs ??= {}, "$yScale", yScale))) {
        if (pointValue < 0) {
          return {
            value: formattedValue,
            x: point.x + (placement === "outside" ? -offset : offset),
            y: point.y,
            textAnchor: placement === "outside" ? "end" : "start",
            verticalAnchor: "middle",
            capHeight: ".6rem"
          };
        } else {
          return {
            value: formattedValue,
            x: point.x + (placement === "outside" ? offset : -offset),
            y: point.y,
            textAnchor: placement === "outside" ? "start" : "end",
            verticalAnchor: "middle",
            capHeight: ".6rem"
          };
        }
      } else {
        if (pointValue < 0) {
          return {
            value: formattedValue,
            x: point.x,
            y: point.y + (placement === "outside" ? offset : -offset),
            capHeight: ".6rem",
            textAnchor: "middle",
            verticalAnchor: placement === "center" ? "middle" : placement === "outside" ? "start" : "end"
          };
        } else {
          return {
            value: formattedValue,
            x: point.x,
            y: point.y + (placement === "outside" ? -offset : offset),
            capHeight: ".6rem",
            textAnchor: "middle",
            verticalAnchor: placement === "center" ? "middle" : placement === "outside" ? "end" : "start"
          };
        }
      }
    };
    $$renderer2.push(`<g class="Labels">`);
    Points($$renderer2, {
      data,
      x,
      y,
      children: invalid_default_snippet,
      $$slots: {
        default: ($$renderer3, { points }) => {
          $$renderer3.push(`<!--[-->`);
          const each_array = ensure_array_like(points);
          for (let i = 0, $$length = each_array.length; i < $$length; i++) {
            let point = each_array[i];
            const textProps = getTextProps(point);
            $$renderer3.push(`<!--[-->`);
            slot($$renderer3, $$props, "default", { data: point, textProps }, () => {
              Text($$renderer3, spread_props([
                textProps,
                $$restProps,
                {
                  class: cls(
                    "text-xs",
                    placement === "inside" ? "fill-surface-300 stroke-surface-content" : "fill-surface-content stroke-surface-100",
                    textProps.class,
                    $$sanitized_props.class
                  )
                }
              ]));
            });
            $$renderer3.push(`<!--]-->`);
          }
          $$renderer3.push(`<!--]-->`);
        }
      }
    });
    $$renderer2.push(`<!----></g>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { data, value, x, y, placement, offset, format: format$1, key });
  });
}
function ColorRamp($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["interpolator", "steps", "height", "width"]);
  $$renderer.component(($$renderer2) => {
    let interpolator = $$props["interpolator"];
    let steps = fallback($$props["steps"], 10);
    let height = fallback($$props["height"], "20px");
    let width = fallback($$props["width"], "100%");
    let href = "";
    {
      const canvas = document.createElement("canvas");
      canvas.width = steps;
      canvas.height = 1;
      const context = canvas.getContext("2d");
      for (let i = 0; i < steps; ++i) {
        context.fillStyle = interpolator(i / (steps - 1));
        context.fillRect(i, 0, 1, 1);
      }
      href = canvas.toDataURL();
    }
    $$renderer2.push(`<image${attributes(
      {
        href,
        preserveAspectRatio: "none",
        height,
        width,
        ...$$restProps
      },
      void 0,
      void 0,
      void 0,
      3
    )}></image>`);
    bind_props($$props, { interpolator, steps, height, width });
  });
}
function Legend($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "scale",
    "title",
    "width",
    "height",
    "ticks",
    "tickFormat",
    "tickValues",
    "tickFontSize",
    "tickLength",
    "placement",
    "orientation",
    "onclick",
    "onpointerenter",
    "onpointerleave",
    "variant",
    "classes"
  ]);
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let _scale;
    const { cScale } = chartContext() ?? {};
    let scale = fallback($$props["scale"], void 0);
    let title = fallback($$props["title"], "");
    let width = fallback($$props["width"], 320);
    let height = fallback($$props["height"], 10);
    let ticks = fallback($$props["ticks"], width / 64);
    let tickFormat = fallback($$props["tickFormat"], void 0);
    let tickValues = fallback($$props["tickValues"], void 0);
    let tickFontSize = fallback($$props["tickFontSize"], 10);
    let tickLength = fallback($$props["tickLength"], 4);
    let placement = fallback($$props["placement"], void 0);
    let orientation = fallback($$props["orientation"], "horizontal");
    let onclick = fallback($$props["onclick"], void 0);
    let onpointerenter = fallback($$props["onpointerenter"], void 0);
    let onpointerleave = fallback($$props["onpointerleave"], void 0);
    let variant = fallback($$props["variant"], "ramp");
    let classes = fallback($$props["classes"], () => ({}), true);
    let xScale;
    let interpolator;
    let swatches;
    let tickLabelOffset = 0;
    let tickLine = true;
    _scale = scale ?? (cScale ? store_get($$store_subs ??= {}, "$cScale", cScale) : null);
    if (!_scale) ;
    else if (_scale.interpolate) {
      const n = Math.min(_scale.domain().length, _scale.range().length);
      xScale = _scale.copy().rangeRound(quantize(interpolate(0, width), n));
      interpolator = _scale.copy().domain(quantize(interpolate(0, 1), n));
      tickFormat = tickFormat ?? xScale.tickFormat?.();
    } else if (_scale.interpolator) {
      xScale = Object.assign(_scale.copy().interpolator(interpolateRound(0, width)), {
        range() {
          return [0, width];
        }
      });
      interpolator = _scale.interpolator();
      if (!xScale.ticks) {
        if (tickValues === void 0) {
          const n = Math.round(ticks + 1);
          tickValues = range(n).map((i) => quantile(_scale.domain(), i / (n - 1)));
        }
      }
      tickFormat = tickFormat ?? xScale.tickFormat?.();
    } else if (_scale.invertExtent) {
      const thresholds = _scale.thresholds ? _scale.thresholds() : (
        // scaleQuantize
        _scale.quantiles ? _scale.quantiles() : (
          // scaleQuantile
          _scale.domain()
        )
      );
      xScale = scaleLinear().domain([-1, _scale.range().length - 1]).rangeRound([0, width]);
      swatches = _scale.range().map((d, i) => {
        return {
          x: xScale(i - 1),
          y: 0,
          width: xScale(i) - xScale(i - 1),
          height,
          fill: d
        };
      });
      tickValues = range(thresholds.length);
      tickFormat = (i) => {
        const value = thresholds[i];
        return $$sanitized_props.tickFormat ? format(value, $$sanitized_props.tickFormat) : value;
      };
    } else {
      xScale = scaleBand().domain(_scale.domain()).rangeRound([0, width]);
      swatches = _scale.domain().map((d) => {
        return {
          x: xScale(d),
          y: 0,
          width: Math.max(0, xScale.bandwidth() - 1),
          height,
          fill: _scale(d)
        };
      });
      tickValues = _scale.domain();
      tickLabelOffset = xScale.bandwidth() / 2;
      tickLine = false;
      tickLength = 0;
    }
    $$renderer2.push(`<div${attributes({
      ...$$restProps,
      class: clsx(cls(
        "inline-block",
        "z-[1]",
        // stack above tooltip context layers (band rects, voronoi, ...)
        placement && [
          "absolute",
          {
            "top-left": "top-0 left-0",
            top: "top-0 left-1/2 -translate-x-1/2",
            "top-right": "top-0 right-0",
            left: "top-1/2 left-0 -translate-y-1/2",
            center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
            right: "top-1/2 right-0 -translate-y-1/2",
            "bottom-left": "bottom-0 left-0",
            bottom: "bottom-0 left-1/2 -translate-x-1/2",
            "bottom-right": "bottom-0 right-0"
          }[placement]
        ],
        $$restProps.class,
        classes.root
      ))
    })}><div${attr_class(clsx(cls("text-[10px] font-semibold", classes.title)))}>${escape_html(title)}</div> <!--[-->`);
    slot($$renderer2, $$props, "default", { values: tickValues ?? [], scale: _scale }, () => {
      if (variant === "ramp") {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<svg${attr("width", width)}${attr("height", height + tickLength + tickFontSize)}${attr("viewBox", `0 0 ${stringify(width)} ${stringify(height + tickLength + tickFontSize)}`)} class="overflow-visible"><g>`);
        if (interpolator) {
          $$renderer2.push("<!--[-->");
          ColorRamp($$renderer2, { width, height, interpolator });
        } else if (swatches) {
          $$renderer2.push("<!--[1-->");
          $$renderer2.push(`<!--[-->`);
          const each_array = ensure_array_like(swatches);
          for (let i = 0, $$length = each_array.length; i < $$length; i++) {
            let swatch = each_array[i];
            $$renderer2.push(`<rect${attributes({ ...swatch }, void 0, void 0, void 0, 3)}></rect>`);
          }
          $$renderer2.push(`<!--]-->`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></g><g><!--[-->`);
        const each_array_1 = ensure_array_like(tickValues ?? xScale?.ticks?.(ticks) ?? []);
        for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
          let tick2 = each_array_1[i];
          $$renderer2.push(`<text text-anchor="middle"${attr("x", xScale(tick2) + tickLabelOffset)}${attr("y", height + tickLength + tickFontSize)}${attr_class(clsx(cls("text-[10px] fill-surface-content", classes.label)))}${attr_style("", { "font-size": tickFontSize })}>${escape_html(tickFormat ? format(tick2, tickFormat) : tick2)}</text>`);
          if (tickLine) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<line${attr("x1", xScale(tick2))}${attr("y1", 0)}${attr("x2", xScale(tick2))}${attr("y2", height + tickLength)}${attr_class(clsx(cls("stroke-surface-content", classes.tick)))}></line>`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]--></g></svg>`);
      } else if (variant === "swatches") {
        $$renderer2.push("<!--[1-->");
        $$renderer2.push(`<div${attr_class(clsx(cls("flex gap-x-4 gap-y-1", orientation === "vertical" && "flex-col", classes.swatches)))}><!--[-->`);
        const each_array_2 = ensure_array_like(tickValues ?? xScale?.ticks?.(ticks) ?? []);
        for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
          let tick2 = each_array_2[$$index_2];
          const color = _scale(tick2);
          const item = { value: tick2, color };
          $$renderer2.push(`<button${attr_class(clsx(cls("flex gap-1", !onclick && "cursor-auto", classes.item?.(item))))}><div${attr_class(clsx(cls("h-4 w-4 rounded-full", classes.swatch)))}${attr_style("", { "background-color": color })}></div> <div${attr_class(clsx(cls("text-xs text-surface-content whitespace-nowrap", classes.label)))}>${escape_html(tickFormat ? format(tick2, tickFormat) : tick2)}</div></button>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    });
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, {
      scale,
      title,
      width,
      height,
      ticks,
      tickFormat,
      tickValues,
      tickFontSize,
      tickLength,
      placement,
      orientation,
      onclick,
      onpointerenter,
      onpointerleave,
      variant,
      classes
    });
  });
}
function TooltipHeader($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.component(($$renderer2) => {
    let value = fallback($$props["value"], void 0);
    let format$1 = fallback($$props["format"], void 0);
    let color = fallback($$props["color"], void 0);
    let classes = fallback($$props["classes"], () => ({}), true);
    $$renderer2.push(`<div${attr_class(clsx(cls("TooltipHeader", "font-semibold whitespace-nowrap border-b mb-1 pb-1 flex items-center gap-2", classes.root, $$sanitized_props.class)))}>`);
    if (color) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div${attr_class(clsx(cls("color", "inline-block size-2 rounded-full bg-[var(--color)]", classes.color)))}${attr_style("", { "--color": color })}></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <!--[-->`);
    slot($$renderer2, $$props, "default", {}, () => {
      $$renderer2.push(`${escape_html(format$1 ? format(value, format$1) : value)}`);
    });
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { value, format: format$1, color, classes });
  });
}
function TooltipItem($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "label",
    "value",
    "format",
    "valueAlign",
    "color",
    "onclick",
    "onpointerenter",
    "onpointerleave",
    "classes"
  ]);
  $$renderer.component(($$renderer2) => {
    let label = $$props["label"];
    let value = fallback($$props["value"], void 0);
    let format$1 = fallback($$props["format"], void 0);
    let valueAlign = fallback($$props["valueAlign"], "left");
    let color = fallback($$props["color"], void 0);
    let onclick = fallback($$props["onclick"], void 0);
    let onpointerenter = fallback($$props["onpointerenter"], void 0);
    let onpointerleave = fallback($$props["onpointerleave"], void 0);
    let classes = fallback($$props["classes"], () => ({}), true);
    $$renderer2.push(`<div${attributes({
      class: clsx(cls("contents", classes.root, $$sanitized_props.class)),
      ...$$restProps
    })}><div${attr_class(clsx(cls("label", "flex items-center gap-2 whitespace-nowrap", classes.label)))}>`);
    if (color) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div${attr_class(clsx(cls("color", "inline-block size-2 rounded-full bg-[var(--color)]", classes.color)))}${attr_style("", { "--color": color })}></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <!--[-->`);
    slot($$renderer2, $$props, "label", {}, () => {
      $$renderer2.push(`${escape_html(label)}`);
    });
    $$renderer2.push(`<!--]--></div> <div${attr_class(clsx(cls(
      "value",
      "tabular-nums",
      {
        "text-right": valueAlign === "right",
        "text-center": valueAlign === "center"
      },
      classes.value,
      $$sanitized_props.class
    )))}><!--[-->`);
    slot($$renderer2, $$props, "default", {}, () => {
      $$renderer2.push(`${escape_html(format$1 ? format(value, format$1) : value)}`);
    });
    $$renderer2.push(`<!--]--></div></div>`);
    bind_props($$props, {
      label,
      value,
      format: format$1,
      valueAlign,
      color,
      onclick,
      onpointerenter,
      onpointerleave,
      classes
    });
  });
}
function TooltipList($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.component(($$renderer2) => {
    $$renderer2.push(`<div${attr_class(clsx(cls("TooltipList", "grid grid-cols-[1fr_auto] gap-x-2 gap-y-1 items-center", $$sanitized_props.class)))}><!--[-->`);
    slot($$renderer2, $$props, "default", {}, null);
    $$renderer2.push(`<!--]--></div>`);
  });
}
function Tooltip($$renderer, $$props) {
  const $$slots = sanitize_slots($$props);
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let x = fallback($$props["x"], "pointer");
    let y = fallback($$props["y"], "pointer");
    let xOffset = fallback($$props["xOffset"], x === "pointer" ? 10 : 0);
    let yOffset = fallback($$props["yOffset"], y === "pointer" ? 10 : 0);
    let anchor = fallback($$props["anchor"], "top-left");
    let contained = fallback($$props["contained"], "container");
    let variant = fallback($$props["variant"], "default");
    let motion = fallback($$props["motion"], true);
    let pointerEvents = fallback($$props["pointerEvents"], false);
    let classes = fallback($$props["classes"], () => ({}), true);
    const {
      padding,
      xScale,
      xGet,
      yScale,
      yGet,
      containerWidth,
      containerHeight
    } = chartContext();
    const tooltip = tooltipContext();
    let tooltipWidth = 0;
    let tooltipHeight = 0;
    const xPos = motionStore(store_get($$store_subs ??= {}, "$tooltip", tooltip).x, { spring: motion });
    const yPos = motionStore(store_get($$store_subs ??= {}, "$tooltip", tooltip).y, { spring: motion });
    function alignValue(value, align, addlOffset, tooltipSize) {
      const alignOffset = align === "center" ? tooltipSize / 2 : align === "end" ? tooltipSize : 0;
      return value + (align === "end" ? -addlOffset : addlOffset) - alignOffset;
    }
    if (store_get($$store_subs ??= {}, "$tooltip", tooltip)?.data) {
      const xBandOffset = isScaleBand(store_get($$store_subs ??= {}, "$xScale", xScale)) ? store_get($$store_subs ??= {}, "$xScale", xScale).step() / 2 - store_get($$store_subs ??= {}, "$xScale", xScale).padding() * store_get($$store_subs ??= {}, "$xScale", xScale).step() / 2 : 0;
      const xValue = typeof x === "number" ? x : x === "data" ? store_get($$store_subs ??= {}, "$xGet", xGet)(store_get($$store_subs ??= {}, "$tooltip", tooltip).data) + store_get($$store_subs ??= {}, "$padding", padding).left + xBandOffset : store_get($$store_subs ??= {}, "$tooltip", tooltip).x;
      let xAlign = "start";
      switch (anchor) {
        case "top-left":
        case "left":
        case "bottom-left":
          xAlign = "start";
          break;
        case "top":
        case "center":
        case "bottom":
          xAlign = "center";
          break;
        case "top-right":
        case "right":
        case "bottom-right":
          xAlign = "end";
          break;
      }
      const yBandOffset = isScaleBand(store_get($$store_subs ??= {}, "$yScale", yScale)) ? store_get($$store_subs ??= {}, "$yScale", yScale).step() / 2 - store_get($$store_subs ??= {}, "$yScale", yScale).padding() * store_get($$store_subs ??= {}, "$yScale", yScale).step() / 2 : 0;
      const yValue = typeof y === "number" ? y : y === "data" ? store_get($$store_subs ??= {}, "$yGet", yGet)(store_get($$store_subs ??= {}, "$tooltip", tooltip).data) + store_get($$store_subs ??= {}, "$padding", padding).top + yBandOffset : store_get($$store_subs ??= {}, "$tooltip", tooltip).y;
      let yAlign = "start";
      switch (anchor) {
        case "top-left":
        case "top":
        case "top-right":
          yAlign = "start";
          break;
        case "left":
        case "center":
        case "right":
          yAlign = "center";
          break;
        case "bottom-left":
        case "bottom":
        case "bottom-right":
          yAlign = "end";
          break;
      }
      const rect = {
        top: alignValue(yValue, yAlign, yOffset, tooltipHeight),
        left: alignValue(xValue, xAlign, xOffset, tooltipWidth),
        // set below
        bottom: 0,
        right: 0
      };
      rect.bottom = rect.top + tooltipHeight;
      rect.right = rect.left + tooltipWidth;
      if (contained === "container") {
        if (typeof x !== "number") {
          if ((xAlign === "start" || xAlign === "center") && rect.right > store_get($$store_subs ??= {}, "$containerWidth", containerWidth)) {
            rect.left = alignValue(xValue, "end", xOffset, tooltipWidth);
          }
          if ((xAlign === "end" || xAlign === "center") && rect.left < store_get($$store_subs ??= {}, "$padding", padding).left) {
            rect.left = alignValue(xValue, "start", xOffset, tooltipWidth);
          }
        }
        rect.right = rect.left + tooltipWidth;
        if (typeof y !== "number") {
          if ((yAlign === "start" || yAlign === "center") && rect.bottom > store_get($$store_subs ??= {}, "$containerHeight", containerHeight)) {
            rect.top = alignValue(yValue, "end", yOffset, tooltipHeight);
          }
          if ((yAlign === "end" || yAlign === "center") && rect.top < store_get($$store_subs ??= {}, "$padding", padding).top) {
            rect.top = alignValue(yValue, "start", yOffset, tooltipHeight);
          }
        }
        rect.bottom = rect.top + tooltipHeight;
      }
      store_set(yPos, rect.top);
      store_set(xPos, rect.left);
    }
    if (store_get($$store_subs ??= {}, "$tooltip", tooltip).data) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div${attr_class(clsx(cls("absolute z-50 select-none", !pointerEvents && "pointer-events-none", classes.root)))}${attr_style("", {
        top: `${stringify(store_get($$store_subs ??= {}, "$yPos", yPos))}px`,
        left: `${stringify(store_get($$store_subs ??= {}, "$xPos", xPos))}px`
      })}><div${attr_class(clsx(cls(
        variant !== "none" && ["text-sm py-1 px-2 h-full rounded elevation-1"],
        {
          default: [
            "bg-surface-100/90 dark:bg-surface-300/90 backdrop-filter backdrop-blur-[2px] text-surface-content",
            "[&_.label]:text-surface-content/75"
          ],
          invert: [
            "bg-surface-content/90 backdrop-filter backdrop-blur-[2px] text-surface-100 border border-surface-content",
            "[&_.label]:text-surface-100/50"
          ],
          none: ""
        }[variant],
        classes.container,
        $$sanitized_props.class
      )))}>`);
      if ($$slots.default) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div${attr_class(clsx(cls(classes.content)))}><!--[-->`);
        slot(
          $$renderer2,
          $$props,
          "default",
          {
            data: store_get($$store_subs ??= {}, "$tooltip", tooltip).data
          },
          null
        );
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, {
      x,
      y,
      xOffset,
      yOffset,
      anchor,
      contained,
      variant,
      motion,
      pointerEvents,
      classes
    });
  });
}
function LineChart($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "data",
    "x",
    "y",
    "xDomain",
    "radial",
    "series",
    "axis",
    "brush",
    "grid",
    "labels",
    "legend",
    "points",
    "rule",
    "tooltipContext",
    "ontooltipclick",
    "onpointclick",
    "props",
    "renderContext",
    "profile",
    "debug"
  ]);
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let isDefaultSeries, allSeriesData, chartData, xScale, visibleSeries, getSplineProps, brushProps;
    let data = fallback($$props["data"], () => [], true);
    let x = fallback($$props["x"], void 0);
    let y = fallback($$props["y"], void 0);
    let xDomain = fallback($$props["xDomain"], void 0);
    let radial = fallback($$props["radial"], false);
    let series = fallback(
      $$props["series"],
      () => [
        { key: "default", value: y, color: "hsl(var(--color-primary))" }
      ],
      true
    );
    let axis = fallback($$props["axis"], true);
    let brush = fallback($$props["brush"], false);
    let grid = fallback($$props["grid"], true);
    let labels = fallback($$props["labels"], false);
    let legend = fallback($$props["legend"], false);
    let points = fallback($$props["points"], false);
    let rule = fallback($$props["rule"], true);
    let tooltipContext2 = fallback($$props["tooltipContext"], void 0);
    let ontooltipclick = fallback($$props["ontooltipclick"], () => {
    });
    let onpointclick = fallback($$props["onpointclick"], void 0);
    let props = fallback($$props["props"], () => ({}), true);
    let renderContext = fallback($$props["renderContext"], "svg");
    let profile = fallback($$props["profile"], false);
    let debug = fallback($$props["debug"], false);
    let highlightSeriesKey = null;
    function setHighlightSeriesKey(seriesKey) {
      highlightSeriesKey = seriesKey;
    }
    function getPointsProps(s, i) {
      const pointsProps = {
        data: s.data,
        y: s.value ?? (s.data ? void 0 : s.key),
        fill: s.color,
        ...props.points,
        ...typeof points === "object" ? points : null,
        class: cls("stroke-surface-200 transition-opacity", highlightSeriesKey && highlightSeriesKey !== s.key && "opacity-10", props.points?.class, typeof points === "object" && points.class)
      };
      return pointsProps;
    }
    function getLabelsProps(s, i) {
      const labelsProps = {
        data: s.data,
        y: s.value ?? (s.data ? void 0 : s.key),
        ...props.labels,
        ...typeof labels === "object" ? labels : null,
        class: cls("stroke-surface-200 transition-opacity", highlightSeriesKey && highlightSeriesKey !== s.key && "opacity-10", props.labels?.class, typeof labels === "object" && labels.class)
      };
      return labelsProps;
    }
    const selectedSeries = selectionStore();
    if (profile) {
      console.time("LineChart render");
    }
    isDefaultSeries = series.length === 1 && series[0].key === "default";
    allSeriesData = series.flatMap((s) => s.data?.map((d) => ({ seriesKey: s.key, ...d }))).filter((d) => d);
    chartData = allSeriesData.length ? allSeriesData : chartDataArray(data);
    xScale = $$sanitized_props.xScale ?? (accessor(x)(chartData[0]) instanceof Date ? scaleTime() : scaleLinear());
    visibleSeries = series.filter((s) => {
      return (
        // @ts-expect-error
        store_get($$store_subs ??= {}, "$selectedSeries", selectedSeries).selected.length === 0 || store_get($$store_subs ??= {}, "$selectedSeries", selectedSeries).isSelected(s.key)
      );
    });
    getSplineProps = (s, i) => {
      const splineProps = {
        data: s.data,
        y: s.value ?? (s.data ? void 0 : s.key),
        stroke: s.color,
        ...props.spline,
        ...s.props,
        class: cls(
          "transition-opacity",
          // Checking `visibleSeries.length > 1` fixes re-animated tweened areas on hover
          visibleSeries.length > 1 && highlightSeriesKey && highlightSeriesKey !== s.key && "opacity-10",
          props.spline?.class,
          s.props?.class
        )
      };
      return splineProps;
    };
    brushProps = { ...typeof brush === "object" ? brush : null, ...props.brush };
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      Chart($$renderer3, spread_props([
        {
          data: chartData,
          x,
          xDomain,
          xScale,
          y: y ?? series.map((s) => s.value ?? s.key),
          yBaseline: 0,
          yNice: true,
          radial,
          padding: radial ? void 0 : defaultChartPadding(axis, legend)
        },
        $$restProps,
        {
          tooltip: $$sanitized_props.tooltip === false ? false : {
            mode: "bisect-x",
            onclick: ontooltipclick,
            debug,
            ...props.tooltip?.context,
            ...$$sanitized_props.tooltip
          },
          brush: brush && (brush === true || brush.mode == void 0 || brush.mode === "integrated") ? {
            axis: "x",
            resetOnEnd: true,
            xDomain,
            ...brushProps,
            onbrushend: (e) => {
              xDomain = e.xDomain;
              brushProps.onbrushend?.(e);
            }
          } : false,
          get tooltipContext() {
            return tooltipContext2;
          },
          set tooltipContext($$value) {
            tooltipContext2 = $$value;
            $$settled = false;
          },
          children: invalid_default_snippet,
          $$slots: {
            default: ($$renderer4, {
              x: x2,
              xScale: xScale2,
              y: y2,
              yScale,
              c,
              cScale,
              width,
              height,
              padding,
              tooltip
            }) => {
              const slotProps = {
                x: x2,
                xScale: xScale2,
                y: y2,
                yScale,
                c,
                cScale,
                width,
                height,
                padding,
                tooltip,
                series,
                visibleSeries,
                getLabelsProps,
                getPointsProps,
                getSplineProps,
                highlightSeriesKey,
                setHighlightSeriesKey
              };
              $$renderer4.push(`<!--[-->`);
              slot($$renderer4, $$props, "default", spread_props([{}, slotProps]), () => {
                $$renderer4.push(`<!--[-->`);
                slot($$renderer4, $$props, "belowContext", spread_props([{}, slotProps]), null);
                $$renderer4.push(`<!--]--> `);
                $$renderer4.push("<!---->");
                (renderContext === "canvas" ? Canvas : Svg)?.($$renderer4, spread_props([
                  asAny(renderContext === "canvas" ? props.canvas : props.svg),
                  {
                    center: radial,
                    debug,
                    children: ($$renderer5) => {
                      $$renderer5.push(`<!--[-->`);
                      slot($$renderer5, $$props, "grid", spread_props([{}, slotProps]), () => {
                        if (grid) {
                          $$renderer5.push("<!--[-->");
                          Grid($$renderer5, spread_props([
                            { x: radial, y: true },
                            typeof grid === "object" ? grid : null,
                            props.grid
                          ]));
                        } else {
                          $$renderer5.push("<!--[!-->");
                        }
                        $$renderer5.push(`<!--]-->`);
                      });
                      $$renderer5.push(`<!--]--> `);
                      ChartClipPath($$renderer5, {
                        disabled: !brush,
                        children: ($$renderer6) => {
                          $$renderer6.push(`<!--[-->`);
                          slot($$renderer6, $$props, "belowMarks", spread_props([{}, slotProps]), null);
                          $$renderer6.push(`<!--]--> <!--[-->`);
                          slot($$renderer6, $$props, "marks", spread_props([{}, slotProps]), () => {
                            $$renderer6.push(`<!--[-->`);
                            const each_array = ensure_array_like(visibleSeries);
                            for (let i = 0, $$length = each_array.length; i < $$length; i++) {
                              let s = each_array[i];
                              Spline($$renderer6, spread_props([getSplineProps(s, i)]));
                            }
                            $$renderer6.push(`<!--]-->`);
                          });
                          $$renderer6.push(`<!--]--> <!--[-->`);
                          slot($$renderer6, $$props, "aboveMarks", spread_props([{}, slotProps]), null);
                          $$renderer6.push(`<!--]-->`);
                        },
                        $$slots: { default: true }
                      });
                      $$renderer5.push(`<!----> <!--[-->`);
                      slot($$renderer5, $$props, "axis", spread_props([{}, slotProps]), () => {
                        if (axis) {
                          $$renderer5.push("<!--[-->");
                          if (axis !== "x") {
                            $$renderer5.push("<!--[-->");
                            Axis($$renderer5, spread_props([
                              {
                                placement: radial ? "radius" : "left",
                                format: (value) => format(value, void 0, { variant: "short" })
                              },
                              typeof axis === "object" ? axis : null,
                              props.yAxis
                            ]));
                          } else {
                            $$renderer5.push("<!--[!-->");
                          }
                          $$renderer5.push(`<!--]--> `);
                          if (axis !== "y") {
                            $$renderer5.push("<!--[-->");
                            Axis($$renderer5, spread_props([
                              {
                                placement: radial ? "angle" : "bottom",
                                format: (value) => format(value, void 0, { variant: "short" })
                              },
                              typeof axis === "object" ? axis : null,
                              props.xAxis
                            ]));
                          } else {
                            $$renderer5.push("<!--[!-->");
                          }
                          $$renderer5.push(`<!--]--> `);
                          if (rule) {
                            $$renderer5.push("<!--[-->");
                            Rule($$renderer5, spread_props([
                              { x: 0, y: 0 },
                              typeof rule === "object" ? rule : null,
                              props.rule
                            ]));
                          } else {
                            $$renderer5.push("<!--[!-->");
                          }
                          $$renderer5.push(`<!--]-->`);
                        } else {
                          $$renderer5.push("<!--[!-->");
                        }
                        $$renderer5.push(`<!--]-->`);
                      });
                      $$renderer5.push(`<!--]--> `);
                      ChartClipPath($$renderer5, {
                        disabled: !brush,
                        full: true,
                        children: ($$renderer6) => {
                          if (points) {
                            $$renderer6.push("<!--[-->");
                            $$renderer6.push(`<!--[-->`);
                            const each_array_1 = ensure_array_like(visibleSeries);
                            for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
                              let s = each_array_1[i];
                              Points($$renderer6, spread_props([getPointsProps(s)]));
                            }
                            $$renderer6.push(`<!--]-->`);
                          } else {
                            $$renderer6.push("<!--[!-->");
                          }
                          $$renderer6.push(`<!--]--> `);
                          if (labels) {
                            $$renderer6.push("<!--[-->");
                            $$renderer6.push(`<!--[-->`);
                            const each_array_2 = ensure_array_like(visibleSeries);
                            for (let i = 0, $$length = each_array_2.length; i < $$length; i++) {
                              let s = each_array_2[i];
                              Labels($$renderer6, spread_props([getLabelsProps(s)]));
                            }
                            $$renderer6.push(`<!--]-->`);
                          } else {
                            $$renderer6.push("<!--[!-->");
                          }
                          $$renderer6.push(`<!--]--> <!--[-->`);
                          slot($$renderer6, $$props, "highlight", spread_props([{}, slotProps]), () => {
                            $$renderer6.push(`<!--[-->`);
                            const each_array_3 = ensure_array_like(visibleSeries);
                            for (let i = 0, $$length = each_array_3.length; i < $$length; i++) {
                              let s = each_array_3[i];
                              const seriesTooltipData = s.data && tooltip.data ? findRelatedData(s.data, tooltip.data, x2) : null;
                              const highlightPointsProps = typeof props.highlight?.points === "object" ? props.highlight.points : null;
                              Highlight($$renderer6, spread_props([
                                {
                                  data: seriesTooltipData,
                                  y: s.value ?? (s.data ? void 0 : s.key),
                                  lines: i === 0,
                                  onpointclick: onpointclick ? (e, detail) => onpointclick(e, { ...detail, series: s }) : void 0,
                                  onpointenter: () => highlightSeriesKey = s.key,
                                  onpointleave: () => highlightSeriesKey = null
                                },
                                props.highlight,
                                {
                                  points: props.highlight?.points == false ? false : {
                                    ...highlightPointsProps,
                                    fill: s.color,
                                    class: cls("transition-opacity", highlightSeriesKey && highlightSeriesKey !== s.key && "opacity-10", highlightPointsProps?.class)
                                  }
                                }
                              ]));
                            }
                            $$renderer6.push(`<!--]-->`);
                          });
                          $$renderer6.push(`<!--]-->`);
                        },
                        $$slots: { default: true }
                      });
                      $$renderer5.push(`<!---->`);
                    },
                    $$slots: { default: true }
                  }
                ]));
                $$renderer4.push(`<!----> <!--[-->`);
                slot($$renderer4, $$props, "aboveContext", spread_props([{}, slotProps]), null);
                $$renderer4.push(`<!--]--> <!--[-->`);
                slot($$renderer4, $$props, "legend", spread_props([{}, slotProps]), () => {
                  if (legend) {
                    $$renderer4.push("<!--[-->");
                    Legend($$renderer4, spread_props([
                      {
                        scale: isDefaultSeries ? void 0 : scaleOrdinal(series.map((s) => s.key), series.map((s) => s.color)),
                        tickFormat: (key) => series.find((s) => s.key === key)?.label ?? key,
                        placement: "bottom",
                        variant: "swatches",
                        onclick: (e, item) => store_get($$store_subs ??= {}, "$selectedSeries", selectedSeries).toggleSelected(item.value),
                        onpointerenter: (e, item) => highlightSeriesKey = item.value,
                        onpointerleave: (e) => highlightSeriesKey = null
                      },
                      props.legend,
                      typeof legend === "object" ? legend : null,
                      {
                        classes: {
                          item: (item) => visibleSeries.length && !visibleSeries.some((s) => s.key === item.value) ? "opacity-50" : "",
                          ...props.legend?.classes,
                          ...typeof legend === "object" ? legend.classes : null
                        }
                      }
                    ]));
                  } else {
                    $$renderer4.push("<!--[!-->");
                  }
                  $$renderer4.push(`<!--]-->`);
                });
                $$renderer4.push(`<!--]--> <!--[-->`);
                slot($$renderer4, $$props, "tooltip", spread_props([{}, slotProps]), () => {
                  Tooltip($$renderer4, spread_props([
                    props.tooltip?.root,
                    {
                      children: invalid_default_snippet,
                      $$slots: {
                        default: ($$renderer5, { data: data2 }) => {
                          TooltipHeader($$renderer5, spread_props([{ value: x2(data2), format }, props.tooltip?.header]));
                          $$renderer5.push(`<!----> `);
                          TooltipList($$renderer5, spread_props([
                            props.tooltip?.list,
                            {
                              children: ($$renderer6) => {
                                $$renderer6.push(`<!--[-->`);
                                const each_array_4 = ensure_array_like(visibleSeries);
                                for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
                                  let s = each_array_4[$$index_4];
                                  const seriesTooltipData = s.data ? findRelatedData(s.data, data2, x2) : data2;
                                  const valueAccessor = accessor(s.value ?? (s.data ? asAny(y2) : s.key));
                                  TooltipItem($$renderer6, spread_props([
                                    {
                                      label: s.label ?? (s.key !== "default" ? s.key : "value"),
                                      value: seriesTooltipData ? valueAccessor(seriesTooltipData) : null,
                                      color: s.color,
                                      format,
                                      onpointerenter: () => highlightSeriesKey = s.key,
                                      onpointerleave: () => highlightSeriesKey = null
                                    },
                                    props.tooltip?.item
                                  ]));
                                }
                                $$renderer6.push(`<!--]-->`);
                              },
                              $$slots: { default: true }
                            }
                          ]));
                          $$renderer5.push(`<!---->`);
                        }
                      }
                    }
                  ]));
                });
                $$renderer4.push(`<!--]-->`);
              });
              $$renderer4.push(`<!--]-->`);
            }
          }
        }
      ]));
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, {
      data,
      x,
      y,
      xDomain,
      radial,
      series,
      axis,
      brush,
      grid,
      labels,
      legend,
      points,
      rule,
      tooltipContext: tooltipContext2,
      ontooltipclick,
      onpointclick,
      props,
      renderContext,
      profile,
      debug
    });
  });
}
function Arc($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "spring",
    "tweened",
    "value",
    "initialValue",
    "domain",
    "range",
    "startAngle",
    "endAngle",
    "innerRadius",
    "outerRadius",
    "cornerRadius",
    "padAngle",
    "fill",
    "fillOpacity",
    "stroke",
    "strokeWidth",
    "class",
    "track",
    "onclick",
    "onpointerenter",
    "onpointermove",
    "onpointerleave",
    "offset",
    "tooltip",
    "data"
  ]);
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let scale, _outerRadius, _innerRadius, arc$1, trackArc, trackArcCentroid, boundingBox, angle, xOffset, yOffset;
    let spring = fallback($$props["spring"], void 0);
    let tweened = fallback($$props["tweened"], void 0);
    let value = fallback($$props["value"], 0);
    let initialValue = fallback($$props["initialValue"], value);
    let tweened_value = motionStore(initialValue, { spring, tweened });
    let domain = fallback($$props["domain"], () => [0, 100], true);
    let range2 = fallback($$props["range"], () => [0, 360], true);
    let startAngle = fallback($$props["startAngle"], void 0);
    let endAngle = fallback($$props["endAngle"], void 0);
    let innerRadius = fallback($$props["innerRadius"], void 0);
    let outerRadius = fallback($$props["outerRadius"], void 0);
    let cornerRadius = fallback($$props["cornerRadius"], 0);
    let padAngle = fallback($$props["padAngle"], 0);
    let fill = fallback($$props["fill"], void 0);
    let fillOpacity = fallback($$props["fillOpacity"], void 0);
    let stroke = fallback($$props["stroke"], "none");
    let strokeWidth = fallback($$props["strokeWidth"], void 0);
    let className = fallback($$props["class"], void 0);
    let track = fallback($$props["track"], false);
    let onclick = fallback($$props["onclick"], void 0);
    let onpointerenter = fallback($$props["onpointerenter"], void 0);
    let onpointermove = fallback($$props["onpointermove"], void 0);
    let onpointerleave = fallback($$props["onpointerleave"], void 0);
    const { xRange, yRange } = chartContext();
    function getOuterRadius(outerRadius2, chartRadius) {
      if (!outerRadius2) {
        return chartRadius;
      } else if (outerRadius2 > 1) {
        return outerRadius2;
      } else if (outerRadius2 > 0) {
        return chartRadius * outerRadius2;
      } else if (outerRadius2 < 0) {
        return chartRadius + outerRadius2;
      } else {
        return outerRadius2;
      }
    }
    function getInnerRadius(innerRadius2, outerRadius2) {
      if (innerRadius2 == null) {
        return Math.min(...store_get($$store_subs ??= {}, "$yRange", yRange));
      } else if (innerRadius2 > 1) {
        return innerRadius2;
      } else if (innerRadius2 > 0) {
        return outerRadius2 * innerRadius2;
      } else if (innerRadius2 < 0) {
        return outerRadius2 + innerRadius2;
      } else {
        return innerRadius2;
      }
    }
    let trackArcEl = void 0;
    let offset = fallback($$props["offset"], 0);
    let tooltip = fallback($$props["tooltip"], void 0);
    let data = fallback($$props["data"], void 0);
    function onPointerEnter(e) {
      onpointerenter?.(e);
      tooltip?.show(e, data);
    }
    function onPointerMove(e) {
      onpointermove?.(e);
      tooltip?.show(e, data);
    }
    function onPointerLeave(e) {
      onpointerleave?.(e);
      tooltip?.hide();
    }
    tick().then(() => {
      tweened_value.set(value);
    });
    scale = scaleLinear().domain(domain).range(range2);
    _outerRadius = getOuterRadius(outerRadius, (Math.min(store_get($$store_subs ??= {}, "$xRange", xRange)[1], store_get($$store_subs ??= {}, "$yRange", yRange)[0]) ?? 0) / 2);
    _innerRadius = getInnerRadius(innerRadius, _outerRadius);
    arc$1 = arc().innerRadius(_innerRadius).outerRadius(_outerRadius).startAngle(startAngle ?? degreesToRadians(range2[0])).endAngle(endAngle ?? degreesToRadians(scale(store_get($$store_subs ??= {}, "$tweened_value", tweened_value)))).cornerRadius(cornerRadius).padAngle(padAngle);
    trackArc = arc().innerRadius(_innerRadius).outerRadius(_outerRadius).startAngle(startAngle ?? degreesToRadians(range2[0])).endAngle(endAngle ?? degreesToRadians(range2[1])).cornerRadius(cornerRadius).padAngle(padAngle);
    trackArcCentroid = trackArc.centroid();
    boundingBox = trackArcEl ? trackArcEl.getBBox() : {};
    angle = ((startAngle ?? 0) + (endAngle ?? 0)) / 2;
    xOffset = Math.sin(angle) * offset;
    yOffset = -Math.cos(angle) * offset;
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      if (track) {
        $$renderer3.push("<!--[-->");
        Spline($$renderer3, spread_props([
          { pathData: trackArc(), class: "track", stroke: "none" },
          typeof track === "object" ? track : null,
          {
            get pathEl() {
              return trackArcEl;
            },
            set pathEl($$value) {
              trackArcEl = $$value;
              $$settled = false;
            }
          }
        ]));
      } else {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--> `);
      Spline($$renderer3, spread_props([
        {
          pathData: arc$1(),
          transform: `translate(${stringify(xOffset)}, ${stringify(yOffset)})`,
          fill,
          "fill-opacity": fillOpacity,
          stroke,
          "stroke-width": strokeWidth,
          class: className
        },
        $$restProps,
        {
          onclick,
          onpointerenter: onPointerEnter,
          onpointermove: onPointerMove,
          onpointerleave: onPointerLeave,
          ontouchmove: (e) => {
            if (tooltip) {
              e.preventDefault();
            }
          }
        }
      ]));
      $$renderer3.push(`<!----> <!--[-->`);
      slot(
        $$renderer3,
        $$props,
        "default",
        {
          value: store_get($$store_subs ??= {}, "$tweened_value", tweened_value),
          centroid: trackArcCentroid,
          boundingBox
        },
        null
      );
      $$renderer3.push(`<!--]-->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, {
      spring,
      tweened,
      value,
      initialValue,
      domain,
      range: range2,
      startAngle,
      endAngle,
      innerRadius,
      outerRadius,
      cornerRadius,
      padAngle,
      fill,
      fillOpacity,
      stroke,
      strokeWidth,
      class: className,
      track,
      onclick,
      onpointerenter,
      onpointermove,
      onpointerleave,
      offset,
      tooltip,
      data
    });
  });
}
function Pie($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let resolved_endAngle, arcs;
    let data = fallback($$props["data"], void 0);
    let range2 = fallback($$props["range"], () => [0, 360], true);
    let startAngle = fallback($$props["startAngle"], void 0);
    let endAngle = fallback($$props["endAngle"], void 0);
    let innerRadius = fallback($$props["innerRadius"], void 0);
    let outerRadius = fallback($$props["outerRadius"], void 0);
    let cornerRadius = fallback($$props["cornerRadius"], 0);
    let padAngle = fallback($$props["padAngle"], 0);
    let spring = fallback($$props["spring"], void 0);
    let tweened = fallback($$props["tweened"], void 0);
    let offset = fallback($$props["offset"], 0);
    let tooltip = fallback($$props["tooltip"], void 0);
    let sort = fallback($$props["sort"], void 0);
    const { data: contextData, x, y, xRange, c, cScale, config } = chartContext();
    let tweened_endAngle = motionStore(0, { spring, tweened });
    let pie$1;
    resolved_endAngle = endAngle ?? degreesToRadians(store_get($$store_subs ??= {}, "$config", config).xRange ? max(store_get($$store_subs ??= {}, "$xRange", xRange)) : max(range2));
    tweened_endAngle.set(resolved_endAngle);
    {
      pie$1 = pie().startAngle(startAngle ?? degreesToRadians(store_get($$store_subs ??= {}, "$config", config).xRange ? min(store_get($$store_subs ??= {}, "$xRange", xRange)) : min(range2))).endAngle(store_get($$store_subs ??= {}, "$tweened_endAngle", tweened_endAngle)).padAngle(padAngle).value(store_get($$store_subs ??= {}, "$x", x));
      if (sort === null) {
        pie$1 = pie$1.sort(null);
      } else if (sort) {
        pie$1 = pie$1.sort(sort);
      }
    }
    arcs = pie$1(data ?? (Array.isArray(store_get($$store_subs ??= {}, "$contextData", contextData)) ? store_get($$store_subs ??= {}, "$contextData", contextData) : []));
    $$renderer2.push(`<!--[-->`);
    slot($$renderer2, $$props, "default", { arcs }, () => {
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(arcs);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let arc2 = each_array[$$index];
        Arc($$renderer2, {
          startAngle: arc2.startAngle,
          endAngle: arc2.endAngle,
          padAngle: arc2.padAngle,
          innerRadius,
          outerRadius,
          cornerRadius,
          offset,
          fill: store_get($$store_subs ??= {}, "$config", config).c ? store_get($$store_subs ??= {}, "$cScale", cScale)?.(store_get($$store_subs ??= {}, "$c", c)(arc2.data)) : null,
          data: arc2.data,
          tooltip
        });
      }
      $$renderer2.push(`<!--]-->`);
    });
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, {
      data,
      range: range2,
      startAngle,
      endAngle,
      innerRadius,
      outerRadius,
      cornerRadius,
      padAngle,
      spring,
      tweened,
      offset,
      tooltip,
      sort
    });
  });
}
function PieChart($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "data",
    "key",
    "label",
    "value",
    "c",
    "maxValue",
    "series",
    "legend",
    "range",
    "innerRadius",
    "outerRadius",
    "cornerRadius",
    "padAngle",
    "placement",
    "center",
    "tooltipContext",
    "ontooltipclick",
    "onarcclick",
    "props",
    "renderContext",
    "profile",
    "debug"
  ]);
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let keyAccessor, labelAccessor, valueAccessor, cAccessor, allSeriesData, chartData, seriesColors, visibleData;
    let data = fallback($$props["data"], () => [], true);
    let key = fallback($$props["key"], "key");
    let label = fallback($$props["label"], "label");
    let value = fallback($$props["value"], "value");
    let c = fallback($$props["c"], key);
    let maxValue = fallback($$props["maxValue"], void 0);
    let series = fallback($$props["series"], () => [{ key: "default", value }], true);
    let legend = fallback($$props["legend"], false);
    let range2 = fallback($$props["range"], () => [0, 360], true);
    let innerRadius = fallback($$props["innerRadius"], void 0);
    let outerRadius = fallback($$props["outerRadius"], void 0);
    let cornerRadius = fallback($$props["cornerRadius"], 0);
    let padAngle = fallback($$props["padAngle"], 0);
    let placement = fallback($$props["placement"], "center");
    let center = fallback($$props["center"], placement === "center");
    let tooltipContext2 = fallback($$props["tooltipContext"], void 0);
    let ontooltipclick = fallback($$props["ontooltipclick"], () => {
    });
    let onarcclick = fallback($$props["onarcclick"], () => {
    });
    let props = fallback($$props["props"], () => ({}), true);
    let renderContext = fallback($$props["renderContext"], "svg");
    let profile = fallback($$props["profile"], false);
    let debug = fallback($$props["debug"], false);
    let highlightKey = null;
    function setHighlightKey(key2) {
      highlightKey = key2 ?? null;
    }
    const selectedKeys = selectionStore();
    if (profile) {
      console.time("PieChart render");
    }
    keyAccessor = accessor(key);
    labelAccessor = accessor(label);
    valueAccessor = accessor(value);
    cAccessor = accessor(c);
    allSeriesData = series.flatMap((s) => s.data?.map((d) => ({ seriesKey: s.key, ...d }))).filter((d) => d);
    chartData = allSeriesData.length ? allSeriesData : chartDataArray(data);
    seriesColors = series.map((s) => s.color).filter((d) => d != null);
    visibleData = chartData.filter((d) => {
      const dataKey = keyAccessor(d);
      return (
        // @ts-expect-error
        store_get($$store_subs ??= {}, "$selectedKeys", selectedKeys).selected.length === 0 || store_get($$store_subs ??= {}, "$selectedKeys", selectedKeys).isSelected(dataKey)
      );
    });
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      Chart($$renderer3, spread_props([
        {
          data: visibleData,
          x: value,
          y: key,
          c,
          cDomain: chartData.map(keyAccessor),
          cRange: seriesColors.length ? seriesColors : c !== key ? chartData.map((d) => cAccessor(d)) : [
            "hsl(var(--color-primary))",
            "hsl(var(--color-secondary))",
            "hsl(var(--color-info))",
            "hsl(var(--color-success))",
            "hsl(var(--color-warning))",
            "hsl(var(--color-danger))"
          ],
          padding: { bottom: legend === true ? 32 : 0 }
        },
        $$restProps,
        {
          tooltip: props.tooltip?.context,
          get tooltipContext() {
            return tooltipContext2;
          },
          set tooltipContext($$value) {
            tooltipContext2 = $$value;
            $$settled = false;
          },
          children: invalid_default_snippet,
          $$slots: {
            default: ($$renderer4, {
              x,
              xScale,
              y,
              c: c2,
              cScale,
              yScale,
              width,
              height,
              padding,
              tooltip
            }) => {
              const slotProps = {
                key,
                label,
                value,
                x,
                xScale,
                y,
                yScale,
                c: c2,
                cScale,
                width,
                height,
                padding,
                tooltip,
                series,
                visibleData,
                highlightKey,
                setHighlightKey
              };
              $$renderer4.push(`<!--[-->`);
              slot($$renderer4, $$props, "default", spread_props([{}, slotProps]), () => {
                $$renderer4.push(`<!--[-->`);
                slot($$renderer4, $$props, "belowContext", spread_props([{}, slotProps]), null);
                $$renderer4.push(`<!--]--> `);
                $$renderer4.push("<!---->");
                (renderContext === "canvas" ? Canvas : Svg)?.($$renderer4, spread_props([
                  asAny(renderContext === "canvas" ? props.canvas : props.svg),
                  {
                    center,
                    debug,
                    children: ($$renderer5) => {
                      $$renderer5.push(`<!--[-->`);
                      slot($$renderer5, $$props, "belowMarks", spread_props([{}, slotProps]), null);
                      $$renderer5.push(`<!--]--> <!--[-->`);
                      slot($$renderer5, $$props, "marks", spread_props([{}, slotProps]), () => {
                        Group($$renderer5, spread_props([
                          {
                            x: placement === "left" ? height / 2 : placement === "right" ? width - height / 2 : void 0,
                            center: ["left", "right"].includes(placement) ? "y" : void 0
                          },
                          props.group,
                          {
                            children: ($$renderer6) => {
                              $$renderer6.push(`<!--[-->`);
                              const each_array = ensure_array_like(series);
                              for (let i = 0, $$length = each_array.length; i < $$length; i++) {
                                let s = each_array[i];
                                const singleArc = s.data?.length === 1 || chartData.length === 1;
                                if (singleArc) {
                                  $$renderer6.push("<!--[-->");
                                  const d = s.data?.[0] || chartData[0];
                                  Arc($$renderer6, spread_props([
                                    {
                                      value: valueAccessor(d),
                                      domain: [0, s.maxValue ?? maxValue ?? sum(chartData, valueAccessor)],
                                      range: range2,
                                      innerRadius,
                                      outerRadius: (outerRadius ?? 0) < 0 ? i * (outerRadius ?? 0) : outerRadius,
                                      cornerRadius,
                                      padAngle,
                                      fill: s.color ?? cScale?.(c2(d)),
                                      track: { fill: s.color ?? cScale?.(c2(d)), "fill-opacity": 0.1 },
                                      tooltip,
                                      data: d,
                                      onclick: (e) => {
                                        onarcclick(e, { data: d, series: s });
                                        ontooltipclick(e, { data: d });
                                      }
                                    },
                                    props.arc,
                                    s.props,
                                    {
                                      class: cls("transition-opacity", highlightKey && highlightKey !== keyAccessor(d) && "opacity-50", props.arc?.class, s.props?.class)
                                    }
                                  ]));
                                } else {
                                  $$renderer6.push("<!--[!-->");
                                  Pie($$renderer6, spread_props([
                                    {
                                      data: s.data,
                                      range: range2,
                                      innerRadius,
                                      outerRadius,
                                      cornerRadius,
                                      padAngle
                                    },
                                    props.pie,
                                    {
                                      children: invalid_default_snippet,
                                      $$slots: {
                                        default: ($$renderer7, { arcs }) => {
                                          $$renderer7.push(`<!--[-->`);
                                          const each_array_1 = ensure_array_like(arcs);
                                          for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
                                            let arc2 = each_array_1[$$index];
                                            Arc($$renderer7, spread_props([
                                              {
                                                startAngle: arc2.startAngle,
                                                endAngle: arc2.endAngle,
                                                outerRadius: series.length > 1 ? i * (outerRadius ?? 0) : outerRadius,
                                                innerRadius,
                                                cornerRadius,
                                                padAngle,
                                                fill: cScale?.(c2(arc2.data)),
                                                data: arc2.data,
                                                tooltip,
                                                onclick: (e) => {
                                                  onarcclick(e, { data: arc2.data, series: s });
                                                  ontooltipclick(e, { data: arc2.data });
                                                },
                                                class: cls("transition-opacity", highlightKey && highlightKey !== keyAccessor(arc2.data) && "opacity-50")
                                              },
                                              props.arc,
                                              s.props
                                            ]));
                                          }
                                          $$renderer7.push(`<!--]-->`);
                                        }
                                      }
                                    }
                                  ]));
                                }
                                $$renderer6.push(`<!--]-->`);
                              }
                              $$renderer6.push(`<!--]-->`);
                            },
                            $$slots: { default: true }
                          }
                        ]));
                      });
                      $$renderer5.push(`<!--]--> <!--[-->`);
                      slot($$renderer5, $$props, "aboveMarks", spread_props([{}, slotProps]), null);
                      $$renderer5.push(`<!--]-->`);
                    },
                    $$slots: { default: true }
                  }
                ]));
                $$renderer4.push(`<!----> <!--[-->`);
                slot($$renderer4, $$props, "aboveContext", spread_props([{}, slotProps]), null);
                $$renderer4.push(`<!--]--> <!--[-->`);
                slot($$renderer4, $$props, "legend", spread_props([{}, slotProps]), () => {
                  if (legend) {
                    $$renderer4.push("<!--[-->");
                    Legend($$renderer4, spread_props([
                      {
                        tickFormat: (tick2) => {
                          const item = chartData.find((d) => keyAccessor(d) === tick2);
                          return item ? labelAccessor(item) ?? tick2 : tick2;
                        },
                        placement: "bottom",
                        variant: "swatches",
                        onclick: (e, item) => store_get($$store_subs ??= {}, "$selectedKeys", selectedKeys).toggleSelected(item.value),
                        onpointerenter: (e, item) => highlightKey = item.value,
                        onpointerleave: (e) => highlightKey = null
                      },
                      props.legend,
                      typeof legend === "object" ? legend : null,
                      {
                        classes: {
                          item: (item) => visibleData.length && !visibleData.some((d) => keyAccessor(d) === item.value) ? "opacity-50" : "",
                          ...props.legend?.classes,
                          ...typeof legend === "object" ? legend.classes : null
                        }
                      }
                    ]));
                  } else {
                    $$renderer4.push("<!--[!-->");
                  }
                  $$renderer4.push(`<!--]-->`);
                });
                $$renderer4.push(`<!--]--> <!--[-->`);
                slot($$renderer4, $$props, "tooltip", spread_props([{}, slotProps]), () => {
                  Tooltip($$renderer4, spread_props([
                    props.tooltip?.root,
                    {
                      children: invalid_default_snippet,
                      $$slots: {
                        default: ($$renderer5, { data: data2 }) => {
                          TooltipList($$renderer5, spread_props([
                            props.tooltip?.list,
                            {
                              children: ($$renderer6) => {
                                TooltipItem($$renderer6, spread_props([
                                  {
                                    label: labelAccessor(data2) || keyAccessor(data2),
                                    value: valueAccessor(data2),
                                    color: cScale?.(c2(data2)),
                                    format,
                                    onpointerenter: () => highlightKey = keyAccessor(data2),
                                    onpointerleave: () => highlightKey = null
                                  },
                                  props.tooltip?.item
                                ]));
                              },
                              $$slots: { default: true }
                            }
                          ]));
                        }
                      }
                    }
                  ]));
                });
                $$renderer4.push(`<!--]-->`);
              });
              $$renderer4.push(`<!--]-->`);
            }
          }
        }
      ]));
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, {
      data,
      key,
      label,
      value,
      c,
      maxValue,
      series,
      legend,
      range: range2,
      innerRadius,
      outerRadius,
      cornerRadius,
      padAngle,
      placement,
      center,
      tooltipContext: tooltipContext2,
      ontooltipclick,
      onarcclick,
      props,
      renderContext,
      profile,
      debug
    });
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let count = 100;
    let animated = 0;
    let dailyGoalPct = 85;
    let label = store_get($$store_subs ??= {}, "$_", $format)("dashboard.posture.poor");
    let pieData = Array.from({ length: count }, (_, i) => ({
      key: i + 1,
      value: 1,
      color: i / count * 100 < animated ? "#38bdf8" : "#bfdbfe"
    }));
    const today = /* @__PURE__ */ new Date();
    const defaultWeekValues = [72, 68, 80, 75, 85, 90, 85];
    let weekData = defaultWeekValues.map((value, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      return { date: d, value };
    });
    const dayValues = [60, 70, 78, 82, 85, 83, 85];
    dayValues.map((value, i) => {
      const d = new Date(today);
      d.setHours(9 + i);
      return { date: d, value };
    });
    const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    let view = "Week";
    let chartData = weekData;
    let seconds = 0;
    let timerStr = () => {
      const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
      const m = Math.floor(seconds % 3600 / 60).toString().padStart(2, "0");
      const s = (seconds % 60).toString().padStart(2, "0");
      return `${h} : ${m} : ${s}`;
    };
    let eyeDist = 62;
    let distPct = Math.min(Math.max((eyeDist - 30) / (100 - 30), 0), 1) * 100;
    let distColor = "#a855f7";
    $$renderer2.push(`<div class="flex-1 p-6 overflow-y-auto bg-bright-snow-50 dark:bg-prussian-blue-900"><div class="flex items-start justify-between mb-6"><div><h1 class="text-2xl font-bold text-slate-900 dark:text-white">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("dashboard.title"))}</h1> <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("dashboard.subtitle", { values: { pct: 12 } }))}</p></div> <div class="flex gap-3 *:cursor-pointer"><button class="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("common.export"))}</button> <button class="px-4 py-2 rounded-xl bg-sky-400 text-white text-sm font-bold hover:bg-sky-500 transition-colors shadow-lg shadow-sky-400/30">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("dashboard.liveMonitor"))}</button></div></div> <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4"><div class="lg:col-span-1 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 p-6 flex flex-col items-center justify-center gap-5"><div class="flex flex-col w-full items-start gap-2"><h2 class="font-semibold text-slate-800 dark:text-white">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("dashboard.postureScore"))}</h2></div> <div class="w-52 h-52 my-6">`);
    {
      let aboveMarks = function($$renderer3) {
        Text($$renderer3, {
          value: String(Math.round(animated)),
          textAnchor: "middle",
          verticalAnchor: "middle",
          dy: -10,
          class: "text-5xl font-bold fill-slate-800 dark:fill-white"
        });
        $$renderer3.push(`<!----> `);
        Text($$renderer3, {
          value: "/ 100",
          textAnchor: "middle",
          verticalAnchor: "middle",
          dy: 18,
          class: "text-sm fill-slate-400"
        });
        $$renderer3.push(`<!---->`);
      };
      PieChart($$renderer2, {
        data: pieData,
        key: "key",
        value: "value",
        c: "color",
        innerRadius: -14,
        cornerRadius: 5,
        padAngle: 0.02,
        aboveMarks,
        $$slots: { aboveMarks: true }
      });
    }
    $$renderer2.push(`<!----></div> <span class="px-4 py-1 rounded-full border border-sky-300 text-sky-500 text-xs font-bold tracking-widest">${escape_html(label)}</span> <p class="text-center text-sm text-slate-400">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("dashboard.currentScore"))}</p></div> <div class="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 p-6 flex flex-col"><div class="flex items-start justify-between mb-1"><div><h2 class="font-semibold text-slate-800 dark:text-white">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("dashboard.dailyProgress"))}</h2> <p class="text-xs text-slate-400">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("dashboard.posturalAlignment"))}</p></div> <div class="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1"><!--[-->`);
    const each_array = ensure_array_like(["Day", "Week"]);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let v = each_array[$$index];
      $$renderer2.push(`<button${attr_class(`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${stringify(view === v ? "bg-sky-400 text-white shadow" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200")}`)}>${escape_html(v === "Day" ? store_get($$store_subs ??= {}, "$_", $format)("dashboard.day") : store_get($$store_subs ??= {}, "$_", $format)("dashboard.week"))}</button>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="flex-1 min-h-[200px] text-sky-400">`);
    LineChart($$renderer2, {
      data: chartData,
      x: "date",
      y: "value",
      padding: defaultChartPadding({}),
      lineProps: { class: "stroke-sky-400 stroke-2" }
    });
    $$renderer2.push(`<!----></div> <div class="flex justify-between px-2 mt-1"><!--[-->`);
    const each_array_1 = ensure_array_like(days);
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let d = each_array_1[$$index_1];
      $$renderer2.push(`<span class="text-xs text-slate-400">${escape_html(d)}</span>`);
    }
    $$renderer2.push(`<!--]--></div></div></div> <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"><div class="rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 p-5"><div class="flex items-center gap-3 mb-4"><div class="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-500">`);
    Eye($$renderer2, { class: "w-5 h-5" });
    $$renderer2.push(`<!----></div> <div><p class="font-semibold text-slate-800 dark:text-white text-sm">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("dashboard.eyeToScreen"))}</p> <p class="text-xs text-slate-400 uppercase tracking-wider">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("dashboard.realtimeDepth"))}</p></div></div> <p class="text-3xl font-bold text-slate-800 dark:text-white mb-4">62 <span class="text-base font-normal text-slate-400">cm</span></p> <div class="relative h-2 bg-slate-100 dark:bg-slate-800 rounded-full mb-2"><div class="absolute left-0 top-0 h-2 rounded-full transition-all duration-500"${attr_style(`width: ${stringify(distPct)}%; background: ${stringify(distColor)}`)}></div></div> <div class="flex justify-between text-xs text-slate-400 mb-4"><span>${escape_html(store_get($$store_subs ??= {}, "$_", $format)("dashboard.tooClose"))}</span><span>${escape_html(store_get($$store_subs ??= {}, "$_", $format)("dashboard.optimal"))}</span><span>${escape_html(store_get($$store_subs ??= {}, "$_", $format)("dashboard.tooFar"))}</span></div> <div class="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 rounded-xl px-3 py-2"><div class="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg></div> <span class="text-sm text-green-600 dark:text-green-400">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("dashboard.safeDistance"))}</span></div></div> <div class="rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 p-5 flex flex-col"><div class="flex items-start justify-between mb-2"><div><p class="font-semibold text-slate-800 dark:text-white">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("dashboard.activeSession"))}</p> <p class="text-xs text-slate-400">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("dashboard.timeAtDesk"))}</p></div> <div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">`);
    Clock($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----></div></div> <div class="flex-1 flex items-center justify-center"><p class="text-4xl font-bold text-sky-400 tabular-nums tracking-widest">${escape_html(timerStr())}</p></div> <button class="mt-4 w-full py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("dashboard.resetSession"))}</button></div> <div class="rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 p-5 flex flex-col justify-between"><div class="flex items-center gap-2 mb-3"><div class="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center text-yellow-500">`);
    Lightbulb($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----></div> <p class="font-semibold text-slate-800 dark:text-white">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("dashboard.quickTip"))}</p></div> <p class="text-sm text-slate-600 dark:text-slate-300 flex-1">"Roll your shoulders back and down every 20 minutes to relieve
                tension in your upper trapezius muscles."</p></div></div> <div class="grid grid-cols-1 md:grid-cols-3 gap-4"><div class="rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 p-5 flex items-center gap-4"><div class="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-500">`);
    Calendar($$renderer2, { class: "w-6 h-6" });
    $$renderer2.push(`<!----></div> <div><p class="text-xs text-slate-400 mb-1">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("dashboard.nextBreak"))}</p> <p class="text-xl font-bold text-slate-800 dark:text-white">14 Minutes</p></div></div> <div class="rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 p-5 flex items-center gap-4"><div class="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-500">`);
    Activity($$renderer2, { class: "w-6 h-6" });
    $$renderer2.push(`<!----></div> <div><p class="text-xs text-slate-400 mb-1">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("dashboard.aiStatus"))}</p> <p class="text-xl font-bold text-slate-800 dark:text-white">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("dashboard.highPrecision"))}</p></div></div> <div class="rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 p-5 flex items-center gap-4"><div class="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-500">`);
    Trophy($$renderer2, { class: "w-6 h-6" });
    $$renderer2.push(`<!----></div> <div><p class="text-xs text-slate-400 mb-1">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("dashboard.dailyGoal"))}</p> <p class="text-xl font-bold text-slate-800 dark:text-white">${escape_html(store_get($$store_subs ??= {}, "$_", $format)("dashboard.complete", { values: { pct: dailyGoalPct } }))}</p></div></div></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
