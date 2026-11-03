/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../request","../utils"],(function(t,e,n){"use strict";async function s(t,s,a){const i=n.parseUrl(t),o={...i.query,f:"json",...s.toJSON()},r=n.asValidOptions(o,a);return e(i.path+"/distance",r).then((({data:t})=>t&&t.distance))}t.distance=s,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
