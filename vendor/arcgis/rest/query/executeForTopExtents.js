/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../geometry","../utils","./operations/queryTopFeatures","../support/TopFeaturesQuery","../../geometry/Extent"],(function(t,e,o,n,r,a){"use strict";async function u(t,e,u){const s=o.parseUrl(t),i=await n.executeQueryForTopExtents(s,r.from(e),{...u}),x=i.data.extent;return!x||isNaN(x.xmin)||isNaN(x.ymin)||isNaN(x.xmax)||isNaN(x.ymax)?{count:i.data.count,extent:null}:{count:i.data.count,extent:a.fromJSON(x)}}t.executeForTopExtents=u,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
