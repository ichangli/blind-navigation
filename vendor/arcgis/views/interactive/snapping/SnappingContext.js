/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(e){"use strict";class t{constructor(e){this.vertexHandle=null,this.excludeFeature=null,this.visualizer=null,this.selfSnappingZ=null,this.drawConstraints=null,this.editGeometryOperations=e.editGeometryOperations,this.elevationInfo=e.elevationInfo,this.pointer=e.pointer,this.vertexHandle=e.vertexHandle,this.excludeFeature=e.excludeFeature,this.feature=e.feature,this.visualizer=e.visualizer,this.selfSnappingZ=e.selfSnappingZ,this.drawConstraints=e.drawConstraints}get coordinateHelper(){return this.editGeometryOperations.data.coordinateHelper}get spatialReference(){return this.coordinateHelper.spatialReference}}e.SnappingContext=t,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
