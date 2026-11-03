/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["./utils"],(function(r){"use strict";const e={vsPath:"raster/rfx/vs",fsPath:"raster/rfx/curvature",attributes:new Map([["a_position",0],["a_texcoord",1]])};function t(r,t){const{painter:a,rasterFunction:s}=r,{curvatureType:n}=s.parameters,o=[n];return a.materialManager.getProgram(e,o)}function a(e,t,a){r.setSingleImageTextures(e,t,a),r.setCoordsAndTransforms(t);const s=a.getRasterTextureSize();t.setUniform2fv("u_srcImageSize",s);const{zFactor:n}=e.rasterFunction.parameters,o=a.getRasterCellSize();t.setUniform1f("u_zlFactor",200*n/o[0]/o[1])}return{createProgram:t,bindTextureAndUniforms:a}}));
