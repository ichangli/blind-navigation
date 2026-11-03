/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../components/TooltipEditableField","../../../../widgets/support/jsxFactory"],(function(e,t,i){"use strict";function o(e){const o=e.fields.filter((e=>!0===e?.visible));return 0===o.length?null:i.tsx(i.tsxFragment,null,o.map((o=>i.tsx(t.TooltipEditableField,{context:e.context,field:o,key:o.id,mode:e.mode}))))}e.Fields=o,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
