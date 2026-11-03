/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../core/libs/gl-matrix-2/math/quat","../../../../../core/libs/gl-matrix-2/factories/quatf64","../../../../../core/libs/gl-matrix-2/factories/vec3f64"],(function(t,e,o,s){"use strict";class r{constructor(t){this.mesh=t,this.name="",this.translation=s.create(),this.rotation=o.create(),this.scale=s.clone(s.ONES),this._nodes=[]}addNode(t){if(this._nodes.includes(t))throw new Error("Node already added");this._nodes.push(t)}forEachNode(t){this._nodes.forEach(t)}set rotationAngles(t){e.fromEuler(this.rotation,t[0],t[1],t[2])}}t.Node=r,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
