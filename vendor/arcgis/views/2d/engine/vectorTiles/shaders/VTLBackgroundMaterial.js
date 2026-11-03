/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./VTLMaterial","../../../../webgl/enums","../../../../webgl/VertexElementDescriptor"],(function(e,t,r,T){"use strict";class n extends t.VTLMaterial{constructor(e){super(e)}geometryInfo(){return n.GEOMETRY_LAYOUT}opacityInfo(){return null}attributes(){return n.ATTRIBUTES}attributesInfo(){return n.ATTRIBUTES_INFO}}n.ATTRIBUTES=[],n.GEOMETRY_LAYOUT=[new T.VertexElementDescriptor("a_pos",2,r.DataType.BYTE,0,2)],n.ATTRIBUTES_INFO={},e.VTLBackgroundMaterial=n,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
