/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(e){"use strict";class t{constructor(e=0,t=0){this.from=e,this.to=t}get numElements(){return this.to-this.from}}function o(e){const t=new Map;e.forAll((e=>t.set(e.from,e)));let o=!0;for(;o;){o=!1;for(let r=0;r<e.length;++r){const n=e.data[r],s=t.get(n.to);if(!s)return;n.to=s.to,t.delete(s.from),e.removeUnordered(s),o=!0}}}e.BufferRange=t,e.mergeAdjacentRanges=o,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
