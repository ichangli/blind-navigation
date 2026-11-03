/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["./utils"],(function(t){"use strict";const e={vsPath:"raster/rfx/vs",fsPath:"raster/rfx/local",attributes:new Map([["a_position",0],["a_texcoord",1]])};function n(t){const{painter:n,rasterFunction:r}=t,{imageCount:a,operationName:s,rasters:o,isOutputRounded:u}=r.parameters,i=[s.toLowerCase()];2===a&&i.push("twoImages");const m=o.filter((t=>"Constant"===t.name));return m.length&&(i.push("oneConstant"),2===m.length&&i.push("twoConstant")),u&&i.push("roundOutput"),n.materialManager.getProgram(e,i)}function r(e,n,r){t.setMultipleImageTextures(e,n,r),t.setCoordsAndTransforms(n);const{domainRange:a}=e.rasterFunction.parameters;n.setUniform2fv("u_domainRange",a)}return{createProgram:n,bindTextureAndUniforms:r}}));
