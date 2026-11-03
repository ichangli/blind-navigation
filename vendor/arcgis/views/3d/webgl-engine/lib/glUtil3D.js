/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./DefaultVertexAttributeLocations","./DefaultVertexBufferLayouts","./VertexArrayObject","../../../webgl/BufferObject","../../../webgl/enums","../../../webgl/Texture","../../../webgl/TextureDescriptor"],(function(e,t,r,u,a,o,n,c){"use strict";function l(e,n=r.Pos2,c=t.Default3D,l=-1,s=1){let f=null;switch(n){case r.Pos2Tex:f=new Float32Array([l,l,0,0,s,l,1,0,l,s,0,1,s,s,1,1]);break;case r.Pos2:default:f=new Float32Array([l,l,s,l,l,s,s,s])}return new u.VertexArrayObject(e,c,{geometry:n},{geometry:a.BufferObject.createVertex(e,o.Usage.STATIC_DRAW,f)})}const s=4;function f(e){const t=new c.TextureDescriptor(s);return t.samplingMode=o.TextureSamplingMode.NEAREST,new n.Texture(e,t)}e.createEmptyTexture=f,e.createQuadVAO=l,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
