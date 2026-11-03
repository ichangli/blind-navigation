/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./sdfPrimitives","../../../webgl/enums","../../../webgl/Texture","../../../webgl/TextureDescriptor"],(function(e,r,t,i,n){"use strict";const o=64,a=o/2,s=a/5,u=o/s,c=.25;function m(e,u){const c=r.createPrimitive(e,o,a,s),m=new n.TextureDescriptor;return m.internalFormat=t.PixelFormat.RGBA,m.width=o,m.height=o,m.wrapMode=t.TextureWrapMode.CLAMP_TO_EDGE,new i.Texture(u,m,c)}e.createMarkerTexture=m,e.markerSizePerLineWidth=u,e.markerSymbolSize=a,e.markerTextureSize=o,e.markerThickness=s,e.markerTipThicknessFactor=c,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
