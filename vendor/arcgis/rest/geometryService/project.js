/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../request","../../core/accessorSupport/ensureType","../../geometry/support/jsonUtils","../utils","./utils","../support/ProjectParameters"],(function(e,t,o,r,s,n,p){"use strict";const u=o.ensureType(p);async function c(e,o,p){o=u(o);const c=s.parseUrl(e),i={...c.query,f:"json",...o.toJSON()},a=o.outSpatialReference,l=r.getJsonType(o.geometries[0]),y=s.asValidOptions(i,p);return t(c.path+"/project",y).then((({data:{geometries:e}})=>n.decodeGeometries(e,l,a)))}e.project=c,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
