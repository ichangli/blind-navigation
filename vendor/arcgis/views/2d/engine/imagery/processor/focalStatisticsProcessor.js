/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["./utils"],(function(e){"use strict";const t={vsPath:"raster/rfx/vs",fsPath:"raster/rfx/focalstatistics",attributes:new Map([["a_position",0],["a_texcoord",1]])};function r(e,r){const{painter:a,rasterFunction:s}=e,{kernelRows:n,kernelCols:i,fillNoDataOnly:o,statisticsType:c}=s.parameters,l=[{name:"rows",value:n},{name:"cols",value:i},c];return o&&l.push("fill"),a.materialManager.getProgram(t,l)}function a(t,r,a){e.setSingleImageTextures(t,r,a),e.setCoordsAndTransforms(r),r.setUniform2fv("u_srcImageSize",[a.width,a.height]);const{clampRange:s}=t.rasterFunction.parameters;r.setUniform2fv("u_clampRange",s)}return{createProgram:r,bindTextureAndUniforms:a}}));
