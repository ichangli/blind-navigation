/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../request","./utils","./operations/find","./support/FindParameters","./support/FindResult"],(function(t,e,s,n,r,o){"use strict";async function u(t,o,u){o=r.from(o);const a=n.findToFindRESTParameters(o),d=s.parseUrl(t);d.path+="/find";const f=s.encode({...d.query,f:"json",...a}),l=s.asValidOptions(f,u);return e(d.path,l).then(i)}function i(t){const e=t.data;e.results=e.results||[];const s={results:[]};return s.results=e.results.map((t=>o.fromJSON(t))),s}t.find=u,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
