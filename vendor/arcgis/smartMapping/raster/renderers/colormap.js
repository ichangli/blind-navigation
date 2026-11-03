/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../core/Error","../../../renderers/support/rasterRendererHelper","../support/utils"],(function(e,r,t,n){"use strict";async function o(e){e=await n.processRasterRendererParameters(e);const o=t.createColormapRenderer(e.layer.rasterInfo);if(null==o)throw new r("raster-colormap-renderer:not-supported","Only single band data with colormap is supported");return{renderer:o}}e.createRenderer=o,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
