/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["./utils"],(function(r){"use strict";const t={vsPath:"raster/rfx/vs",fsPath:"raster/rfx/grayscale",attributes:new Map([["a_position",0],["a_texcoord",1]])};function e(r,e){return r.painter.materialManager.getProgram(t,[])}function s(t,e,s){r.setSingleImageTextures(t,e,s),r.setCoordsAndTransforms(e);const{weights:n}=t.rasterFunction.parameters;e.setUniform3fv("u_weights",n)}return{createProgram:e,bindTextureAndUniforms:s}}));
