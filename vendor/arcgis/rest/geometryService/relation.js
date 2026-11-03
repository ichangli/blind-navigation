/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../request","../utils","../operations/relation","../support/RelationParameters"],(function(e,t,r,o,a){"use strict";async function n(e,n,i){n=a.from(n);const s=o.relationToRESTParameters(n),l=r.parseUrl(e),u={...l.query,f:"json",...s},p=r.asValidOptions(u,i);return t(l.path+"/relation",p).then((({data:e})=>e.relations))}e.relation=n,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
