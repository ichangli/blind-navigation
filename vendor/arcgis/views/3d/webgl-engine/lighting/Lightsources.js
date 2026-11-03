/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../core/libs/gl-matrix-2/factories/vec3f64"],(function(t,i){"use strict";class s{constructor(t=i.create()){this.intensity=t}}class e{constructor(t=i.create(),s=i.fromValues(.57735,.57735,.57735)){this.intensity=t,this.direction=s}}class r{constructor(t=i.create(),s=i.fromValues(.57735,.57735,.57735),e=!0,r=1,c=1){this.intensity=t,this.direction=s,this.castShadows=e,this.specularStrength=r,this.environmentStrength=c}}class c{constructor(){this.r=[0],this.g=[0],this.b=[0]}}t.AmbientLight=s,t.FillLight=e,t.MainLight=r,t.SphericalHarmonicsAmbientLight=c,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
