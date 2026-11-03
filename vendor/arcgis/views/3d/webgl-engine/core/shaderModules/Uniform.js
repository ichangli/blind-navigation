/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../shaderTechnique/BindType"],(function(e,i){"use strict";class s{constructor(e,s,n,t,a=null){if(this.name=e,this.type=s,this.arraySize=a,this.bind={[i.BindType.Pass]:null,[i.BindType.Draw]:null},t)switch(n){case i.BindType.Pass:this.bind[i.BindType.Pass]=t;break;case i.BindType.Draw:this.bind[i.BindType.Draw]=t}}equals(e){return this.type===e.type&&this.name===e.name&&this.arraySize===e.arraySize}}e.Uniform=s,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
