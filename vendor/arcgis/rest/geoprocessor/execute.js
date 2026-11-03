/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./GPOptions","./utils","../support/GPMessage"],(function(e,s,t,a){"use strict";async function o(e,o,r,u){return r=s.from(r||{}),t.constructRequest(e,"execute",r,o??{},u).then((async({data:e})=>({results:await Promise.all(e.results?.map(t.decode)??[]),messages:e.messages?.map((e=>a.fromJSON(e)))??[]})))}e.execute=o,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
