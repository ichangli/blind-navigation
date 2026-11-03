/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["./utils","../../../../webgl/rasterUtils"],(function(e,t){"use strict";const r={vsPath:"raster/common",fsPath:"raster/lut",attributes:new Map([["a_position",0],["a_texcoord",1]])};function s(t,s,o){const n=o?[]:e.getProjectionDefines(s.transformGrid);return{defines:n,program:t.painter.materialManager.getProgram(r,n)}}function o(e,r,s,o,n=!1){const{names:a,textures:i}=s.getTextures({useProcessedTexture:n});t.setTextures(e.context,r,a,i),t.setUniforms(r,o,s.commonUniforms),r.setUniformMatrix3fv("u_dvsMat3",s.transforms.displayViewScreenMat3);const{colormap:m,colormapOffset:c}=s.symbolizerParameters,f=t.getColormapUniforms(m,c);t.setUniforms(r,o,f)}return{createProgram:s,bindTextureAndUniforms:o}}));
