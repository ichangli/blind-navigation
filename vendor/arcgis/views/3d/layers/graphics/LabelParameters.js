/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../core/libs/gl-matrix-2/factories/vec2f64","../../../../core/libs/gl-matrix-2/factories/vec3f64","../../../../core/libs/gl-matrix-2/factories/vec4f64"],(function(e,t,s,r){"use strict";class i{constructor(e,i="center",c=!1,a=t.create(),l=r.fromValues(0,0,0,-1),n="world",o=s.create(),f=0){this.verticalOffset=e,this.anchor=i,this.hasLabelVerticalOffset=c,this.screenOffset=a,this.centerOffset=l,this.centerOffsetUnits=n,this.translation=o,this.elevationOffset=f}}class c{constructor(e,s="center",r="center",i=null,c=t.create()){this.placement=e,this.horizontalPlacement=s,this.verticalPlacement=r,this.text=i,this.displaySize=c}}e.LabelParameters=c,e.LabelPlacement=i,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
