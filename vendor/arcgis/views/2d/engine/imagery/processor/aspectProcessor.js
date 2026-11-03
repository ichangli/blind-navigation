/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["./utils"],(function(e){"use strict";const t={vsPath:"raster/rfx/vs",fsPath:"raster/rfx/aspect",attributes:new Map([["a_position",0],["a_texcoord",1]])};function r(e,r){return e.painter.materialManager.getProgram(t,[])}function s(t,r,s){e.setSingleImageTextures(t,r,s),e.setCoordsAndTransforms(r);const n=s.getRasterTextureSize();r.setUniform2fv("u_srcImageSize",n);const a=s.getRasterCellSize();r.setUniform2fv("u_cellSize",a)}return{createProgram:r,bindTextureAndUniforms:s}}));
