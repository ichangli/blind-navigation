/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../request","../../geometry/support/jsonUtils","../utils","../operations/generalize","../support/GeneralizeParameters"],(function(e,r,t,a,s,n){"use strict";async function o(e,o,i){const l=(o=n.from(o)).toJSON(),p=s.generalizeToRESTParameters(o),u=a.parseUrl(e),f={...u.query,f:"json",...p},g=l.geometries[0].spatialReference,m=a.asValidOptions(f,i);return r(u.path+"/generalize",m).then((({data:e})=>(e.geometries||[]).map((e=>t.fromJSON(e).set({spatialReference:g})))))}e.generalize=o,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
