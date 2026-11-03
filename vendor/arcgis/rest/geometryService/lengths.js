/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../request","../utils","../operations/lengths","../support/LengthsParameters"],(function(e,t,s,n,r){"use strict";async function o(e,o,a){o=r.from(o);const i=n.lengthsToRESTParameters(o),l=s.parseUrl(e),u={...l.query,f:"json",...i},p=s.asValidOptions(u,a);return t(l.path+"/lengths",p).then((({data:e})=>e))}e.lengths=o,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
