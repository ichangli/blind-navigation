/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["./utils"],(function(t){"use strict";const e={vsPath:"raster/rfx/vs",fsPath:"raster/rfx/compositeband",attributes:new Map([["a_position",0],["a_texcoord",1]])};function r(t,r){const n=t.rasterFunction.parameters.rasters.filter((t=>"Constant"===t.name)),s=[];return n.length&&(s.push("oneConstant"),2===n.length&&s.push("twoConstant")),t.painter.materialManager.getProgram(e,s)}function n(e,r,n){t.setMultipleImageTextures(e,r,n),t.setCoordsAndTransforms(r)}return{createProgram:r,bindTextureAndUniforms:n}}));
