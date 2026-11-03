/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../core/libs/gl-matrix-2/factories/vec3f64"],(function(t,e){"use strict";class r{constructor(t,e,r){this.object=t,this.geometryId=e,this.triangleNr=r}}class s extends r{constructor(t,r,s,c){super(t,r,s),this.center=null!=c?e.clone(c):null}}class c extends s{}class a{constructor(t){this.layerUid=t}}class i extends a{constructor(t,e){super(t),this.graphicUid=e}}t.Graphic3DTarget=i,t.HudTarget=s,t.LayerTarget=a,t.ObjectTarget=r,t.ValidHudTarget=c,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
