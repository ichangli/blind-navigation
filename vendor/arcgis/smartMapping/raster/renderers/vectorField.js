/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../core/Error","../../../renderers/support/rasterRendererHelper","../support/utils"],(function(e,r,t,n){"use strict";async function o(e){return e=await n.processRasterRendererParameters(e)}async function s(e){e=await o(e);const n=t.createVectorFieldRenderer(e.layer.rasterInfo);if(null==n)throw new r("vector-field-renderer:not-supported","Only vector data is supported");return e.flowRepresentation&&(n.flowRepresentation=e.flowRepresentation),e.rotationType&&(n.rotationType=e.rotationType),e.style&&(n.style=e.style),{renderer:n}}e.createRenderer=s,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
