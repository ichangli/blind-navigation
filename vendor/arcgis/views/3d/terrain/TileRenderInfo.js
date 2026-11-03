/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../core/PooledArray"],(function(o,e){"use strict";class s{constructor(){this.sourceLod=[0,0,0],this.offset=[0,0],this.scale=1,this.layerIndex=0,this.isVTLBackground=!1,this.vtlNeighborInfos=new e({allocator:o=>o||new t})}}class t{constructor(){this.sourceLayerInfo=null,this.sourceLod=[0,0,0],this.offset=[-1,0]}}o.TileRenderInfo=s,o.VTLNeighhborInfo=t,Object.defineProperty(o,Symbol.toStringTag,{value:"Module"})}));
