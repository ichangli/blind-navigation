/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["./utils"],(function(t){"use strict";const e={vsPath:"raster/rfx/vs",fsPath:"raster/rfx/computechange",attributes:new Map([["a_position",0],["a_texcoord",1]])};function n(t){const{painter:n,rasterFunction:r}=t,{method:s,rasters:a,isOutputRounded:o}=r.parameters,i=[s.includes("-")?s.slice(0,s.indexOf("-")):s];return a.filter((t=>"Constant"===t.name)).length&&i.push("oneConstant"),o&&i.push("roundOutput"),n.materialManager.getProgram(e,i)}function r(e,n,r){t.setMultipleImageTextures(e,n,r),t.setCoordsAndTransforms(n);const{domainRange:s}=e.rasterFunction.parameters;n.setUniform2fv("u_domainRange",s)}return{createProgram:n,bindTextureAndUniforms:r}}));
