/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../request","../../geometry/support/jsonUtils","../../geometry/support/spatialReferenceUtils","../utils"],(function(e,t,s,o,r){"use strict";function n(e,n,a){const i=n.map((e=>e.toJSON())),l=n[0].spatialReference,p=r.parseUrl(e),u={...p.query,f:"json",sr:o.srToRESTValue(l),polygons:JSON.stringify(i)},f=r.asValidOptions(u,a);return t(p.path+"/labelPoints",f).then((({data:e})=>(e.labelPoints||[]).map((e=>s.fromJSON(e).set({spatialReference:l})))))}e.labelPoints=n,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
