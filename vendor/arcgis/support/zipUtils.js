/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["require","exports"],(function(e,t){"use strict";async function r(e){const t=[];for(const r of e)r.name.toLowerCase().endsWith(".zip")?t.push(i(r)):t.push(Promise.resolve(r));return(await Promise.all(t)).flat()}async function i(t){const{BlobReader:r,ZipReader:i,BlobWriter:n}=await new Promise(((t,r)=>e(["./zipjs-wrapper"],t,r))),a=[],o=new i(new r(t));return(await o.getEntries()).forEach((e=>{if(e.directory||/^__MACOS/i.test(e.filename))return;const t=new n,r=e.getData?.(t).then((t=>new File([t],e.filename)));r&&a.push(r)})),Promise.all(a)}t.extractZipFile=i,t.extractZipFiles=r,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
