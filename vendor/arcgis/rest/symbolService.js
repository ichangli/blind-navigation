/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../request","../core/urlUtils","./utils","../symbols/CIMSymbol"],(function(e,t,a,n,o){"use strict";async function s(e,s,m){const g=n.parseUrl(e),l=s.svgImage,i=new FormData;if("FormData"in globalThis&&"HTMLFormElement"in globalThis)if(l instanceof FormData){const e=l.get("svgImage");i.append("svgImage",e,e.name)}else if(l instanceof HTMLFormElement){const e=new FormData(l).get("svgImage");i.append("svgImage",e,e.name)}if("string"==typeof l){const e=new Blob([l.trim()],{type:"image/svg+xml"});i.append("svgImage",e,"symbol.svg")}i.append("f","json");const r={...m,method:"post",body:i},p=a.join(g.path,"generateSymbol"),{data:y}=await t(p,r);return{symbol:new o({data:{type:"CIMSymbolReference",symbol:y}})}}e.generateSymbol=s,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
