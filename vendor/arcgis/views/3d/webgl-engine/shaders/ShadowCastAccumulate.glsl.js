/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../core/libs/gl-matrix-2/math/mat4","../../../../core/libs/gl-matrix-2/factories/mat4f64","../core/shaderLibrary/ScreenSpacePass.glsl","../core/shaderLibrary/output/ReadDepth.glsl","../core/shaderLibrary/shading/ReadShadowMap.glsl","../core/shaderLibrary/util/CameraSpace.glsl","../core/shaderLibrary/util/RgbaFloatEncoding.glsl","../core/shaderModules/interfaces","../core/shaderModules/Matrix4PassUniform","../core/shaderModules/ShaderBuilder","../core/shaderModules/Texture2DPassUniform","../../../../chunks/ShadowCastAccumulate.glsl"],(function(e,a,r,s,l,o,d,t,i,c,u,h,g){"use strict";e.ShadowCastMaxSamples=g.ShadowCastMaxSamples,e.build=g.build,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
