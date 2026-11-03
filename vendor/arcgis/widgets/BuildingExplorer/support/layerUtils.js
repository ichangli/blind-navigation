/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../core/promiseUtils"],(function(t,o){"use strict";function a(){let t=new AbortController;return async a=>{t.abort(),t=new AbortController;const e={signal:t.signal},i=a.toArray().map((t=>r(t,e)));await Promise.all(i),o.throwIfAborted(e)}}async function r(t,a){await t.load(a),await t.loadAll(),o.throwIfAborted(a),t.summaryStatistics&&await t.summaryStatistics.load(a)}t.createLoadLayersFunction=a,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
