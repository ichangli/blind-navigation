/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../geometry","../utils","./operations/query","../support/Query","../../geometry/Extent"],(function(t,e,n,o,r,a){"use strict";async function u(t,e,u){const i=n.parseUrl(t),s=await o.executeQueryForExtent(i,r.from(e),{...u}),x=s.data.extent;return!x||isNaN(x.xmin)||isNaN(x.ymin)||isNaN(x.xmax)||isNaN(x.ymax)?{count:s.data.count,extent:null}:{count:s.data.count,extent:a.fromJSON(x)}}t.executeForExtent=u,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
