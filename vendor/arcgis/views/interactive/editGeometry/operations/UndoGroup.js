/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(t){"use strict";var o;const s=Symbol();class e{constructor(t){this._operations=[],this._closed=!1,this[o]=!0,t&&(this._operations=t,this._closed=!0)}close(){this._closed=!0}apply(){for(const t of this._operations)t.apply()}undo(){for(let t=this._operations.length-1;t>=0;t--)this._operations[t].undo()}accumulate(t){if(this._closed)return!1;const o=this._operations.length?this._operations[this._operations.length-1]:null;return o&&o.accumulate(t)||(this._operations.push(t),t.apply()),!0}}function i(t){return s in t}o=s,t.UndoGroup=e,t.isUndoGroup=i,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
