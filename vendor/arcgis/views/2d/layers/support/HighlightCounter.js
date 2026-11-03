/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../engine/highlightReasons"],(function(e,t){"use strict";class o{constructor(){this._idToCounters=new Map}get empty(){return 0===this._idToCounters.size}addReason(e,t){for(const o of e){let e=this._idToCounters.get(o);e||(e=new Map,this._idToCounters.set(o,e)),e.set(t,(e.get(t)||0)+1)}}deleteReason(e,t){for(const o of e){const e=this._idToCounters.get(o);if(!e)continue;let s=e.get(t);if(null==s)return;s--,s>0?e.set(t,s):e.delete(t),0===e.size&&this._idToCounters.delete(o)}}getHighlightReason(e){const o=this._idToCounters.get(e);if(!o)return null;let s=null;for(const n of t.highlightReasons)o.get(n)&&(s=n);return s||null}ids(){return this._idToCounters.keys()}}e.HighlightCounter=o,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
