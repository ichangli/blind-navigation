/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../core/libs/gl-matrix-2/math/mat4"],(function(t,o){"use strict";function e(t,o,e){const n=Math.sin(t),a=Math.cos(t),c=Math.sin(o),i=Math.cos(o),r=e;return r[0]=-n,r[4]=-c*a,r[8]=i*a,r[12]=0,r[1]=a,r[5]=-c*n,r[9]=i*n,r[13]=0,r[2]=0,r[6]=i,r[10]=c,r[14]=0,r[3]=0,r[7]=0,r[11]=0,r[15]=1,r}function n(t,n,a){return e(t,n,a),o.transpose(a,a),a}t.computeENUToSphericalPCPFLocalRotation=e,t.computeSphericalPCPFToENULocalRotation=n,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
