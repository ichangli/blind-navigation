/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../../../symbols/cim/utils"],(function(t,s){"use strict";const o=96;class e{constructor(t){const{offsetX:e,offsetY:f,postAngle:i,fontSize:n,scaleFactor:r,transforms:h}=t;if(this.offsetX=e,this.offsetY=f,this.postAngle=i,this.fontSize=Math.min(n,o),this.transforms=h,h&&h.infos.length>1){const t=s.applyParentTransform(n,i,!1,e,f,h);this.fontSize=Math.min(t.size,o),this.postAngle=t.rotation,this.offsetX=t.offsetX,this.offsetY=t.offsetY}r&&(this.fontSize*=r,this.offsetX*=r,this.offsetY*=r)}}t.TextMeshTransformProps=e,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
