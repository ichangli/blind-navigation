/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../geohash/GeohashTree","../../../../../geohash/geohashUtils","./AAggregateSpatialIndex"],(function(e,t,s,o){"use strict";class h extends o.AAggregateSpatialIndex{constructor(e){super(e),this._tree=new t.GeohashTree(this._options.fields)}put(e){throw new Error("Geohash tree does not support put")}putBounded(e,t,o){const{geohashLevel:h,spatialReference:a}=this._options,n=s.getGeohashBounds(t,o,h,a);null!=n&&this._tree.putBins(e,n)}_insert(e,t,o,h){const{geohashLevel:a,spatialReference:n}=this._options,r=s.getGeohash(t,o,a,n);r&&this._tree.insert(e,t,o,r[0],r[1],a,h)}}e.GeohashSpatialIndex=h,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
