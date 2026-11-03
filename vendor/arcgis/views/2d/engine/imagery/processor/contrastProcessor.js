/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["./utils"],(function(t){"use strict";const r={vsPath:"raster/rfx/vs",fsPath:"raster/rfx/contrast",attributes:new Map([["a_position",0],["a_texcoord",1]])};function e(t,e){return t.painter.materialManager.getProgram(r,[])}function s(r,e,s){t.setSingleImageTextures(r,e,s),t.setCoordsAndTransforms(e);const{contrastOffset:n,brightnessOffset:a}=r.rasterFunction.parameters;e.setUniform1f("u_contrastOffset",n),e.setUniform1f("u_brightnessOffset",a)}return{createProgram:e,bindTextureAndUniforms:s}}));
