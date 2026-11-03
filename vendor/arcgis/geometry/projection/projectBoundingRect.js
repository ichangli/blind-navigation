/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../core/libs/gl-matrix-2/factories/vec3f64","./projectBuffer","../support/aaBoundingRect","../support/spatialReferenceUtils"],(function(e,t,r,o,c){"use strict";function n(e,t,n,f){return null!=e&&(c.equals(t,f)?(o.copy(n,e),!0):(u[0]=e[0],u[1]=e[1],u[2]=0,!!r.projectBuffer(u,t,0,u,f,0,1)&&(n[0]=u[0],n[1]=u[1],u[0]=e[2],u[1]=e[3],u[2]=0,!!r.projectBuffer(u,t,0,u,f,0,1)&&(n[2]=u[0],n[3]=u[1],!0))))}const u=t.create();e.projectBoundingRect=n,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
