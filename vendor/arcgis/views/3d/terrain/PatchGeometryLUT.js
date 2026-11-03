/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./TerrainConst"],(function(t,s){"use strict";class a{constructor(){this.sinLonLUT=new Array(s.maxPatchTesselation+1),this.cosLonLUT=new Array(s.maxPatchTesselation+1),this.sinLatLUT=new Array(s.maxPatchTesselation+1),this.cosLatLUT=new Array(s.maxPatchTesselation+1)}update(t,s,a){const n=s[0],o=s[2];for(let e=0;e<=t;e++){const s=e/t,i=n*(1-s)+o*s;this.sinLonLUT[e]=Math.sin(i),this.cosLonLUT[e]=Math.cos(i);const c=a(s);this.sinLatLUT[e]=Math.sin(c),this.cosLatLUT[e]=Math.cos(c)}}}t.PatchGeometryLUT=a,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
