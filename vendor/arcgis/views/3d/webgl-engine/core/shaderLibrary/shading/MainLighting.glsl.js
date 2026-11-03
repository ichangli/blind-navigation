/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../shaderModules/Float3PassUniform","../../shaderModules/interfaces"],(function(i,n,t){"use strict";function a(i){i.uniforms.add(new n.Float3PassUniform("mainLightDirection",((i,n)=>n.lighting.mainLight.direction)))}function e(i){i.uniforms.add(new n.Float3PassUniform("mainLightIntensity",((i,n)=>n.lighting.mainLight.intensity)))}function o(i){a(i.fragment),e(i.fragment),i.fragment.code.add(t.glsl`vec3 evaluateMainLighting(vec3 normal_global, float shadowing) {
float dotVal = clamp(dot(normal_global, mainLightDirection), 0.0, 1.0);
return mainLightIntensity * ((1.0 - shadowing) * dotVal);
}`)}i.MainLighting=o,i.addMainLightDirection=a,i.addMainLightIntensity=e,Object.defineProperty(i,Symbol.toStringTag,{value:"Module"})}));
