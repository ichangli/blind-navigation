/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["./utils"],(function(e){"use strict";const t={vsPath:"raster/rfx/vs",fsPath:"raster/rfx/slope",attributes:new Map([["a_position",0],["a_texcoord",1]])};function r(e,r){const{painter:s,rasterFunction:i}=e,{slopeType:n}=i.parameters,o="percent-rise"===n?["percentRise"]:[];return s.materialManager.getProgram(t,o)}function s(t,r,s){e.setSingleImageTextures(t,r,s),e.setCoordsAndTransforms(r);const i=s.getRasterTextureSize();r.setUniform2fv("u_srcImageSize",i);const n=s.getRasterCellSize();r.setUniform2fv("u_cellSize",n);const{zFactor:o,slopeType:a,pixelSizePower:c,pixelSizeFactor:u}=t.rasterFunction.parameters;r.setUniform1f("u_zFactor",o),r.setUniform1f("u_pixelSizePower","adjusted"===a?c:0),r.setUniform1f("u_pixelSizeFactor","adjusted"===a?u:0)}return{createProgram:r,bindTextureAndUniforms:s}}));
