/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../core/libs/gl-matrix-2/factories/vec3f64","../../../../webgl/doublePrecisionUtils"],(function(e,t,n){"use strict";function r(e,t){return null==e&&(e=[]),e.push(t),e}function l(e,t){if(null==e)return null;const n=e.filter((e=>e!==t));return 0===n.length?null:n}function o(e,t,r,l,o){c[0]=e.get(t,0),c[1]=e.get(t,1),c[2]=e.get(t,2),n.encodeDoubleArray(c,u,3),r.set(o,0,u[0]),l.set(o,0,u[1]),r.set(o,1,u[2]),l.set(o,1,u[3]),r.set(o,2,u[4]),l.set(o,2,u[5])}const c=t.create(),u=new Float32Array(6);e.addObject3DStateID=r,e.encodeDoubleVec3=o,e.removeObject3DStateID=l,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
