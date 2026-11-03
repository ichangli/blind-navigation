/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./VertexAttribute","../../../webgl/enums","../../../webgl/VertexElementDescriptor"],(function(e,t,r,n){"use strict";const i=[new n.VertexElementDescriptor(t.VertexAttribute.POSITION,3,r.DataType.FLOAT,0,12)],o=[new n.VertexElementDescriptor(t.VertexAttribute.POSITION,2,r.DataType.FLOAT,0,8)],s=[new n.VertexElementDescriptor(t.VertexAttribute.POSITION,2,r.DataType.FLOAT,0,16),new n.VertexElementDescriptor(t.VertexAttribute.UV0,2,r.DataType.FLOAT,8,16)];e.Pos2=o,e.Pos2Tex=s,e.Pos3=i,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
