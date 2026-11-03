/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../chunks/rbush","../../../../geometry/support/aaBoundingBox"],(function(e,n,t){"use strict";class s{static fromReader(e){const o=[],r=e.copy(),a=t.create();for(;r.next();){r.getBounds(a)&&o.push(r.getIndex())}const u=n.rbush(9,(e=>(r.setIndex(e),{minX:r.getBoundsXMin(),minY:r.getBoundsYMin(),maxX:r.getBoundsXMax(),maxY:r.getBoundsYMax()})));return u.load(o),new s(u)}constructor(e){this._index=e}search(e){const n={minX:e[0],minY:e[1],maxX:e[2],maxY:e[3]};return this._index.search(n)}}e.FeatureSpatialIndex=s,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
