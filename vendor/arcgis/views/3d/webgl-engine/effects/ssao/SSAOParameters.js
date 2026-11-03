/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../core/libs/gl-matrix-2/factories/vec2f64","../../core/shaderModules/interfaces"],(function(e,s,r){"use strict";class t extends r.NoParameters{constructor(){super(...arguments),this.projScale=1}}class a extends t{constructor(){super(...arguments),this.intensity=1}}class c extends r.NoParameters{}class o extends c{constructor(){super(...arguments),this.blurSize=s.create()}}e.BlurDrawParameters=o,e.BlurPassParameters=t,e.SSAODrawParameters=c,e.SSAOPassParameters=a,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
