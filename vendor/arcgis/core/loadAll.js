/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./asyncUtils","./Collection","./Loadable"],(function(l,o,n,t){"use strict";async function a(l,o){return await l.load(),r(l,o)}async function r(l,a){const r=[],i=(...l)=>{for(const o of l)null!=o&&(Array.isArray(o)?i(...o):n.isCollection(o)?o.forEach((l=>i(l))):t.isLoadable(o)&&r.push(o))};a(i);let c=null;if(await o.map(r,(async l=>{const n=await o.result(e(l)?l.loadAll():l.load());!1!==n.ok||c||(c=n)})),c)throw c.error;return l}function e(l){return"loadAll"in l&&"function"==typeof l.loadAll}l.loadAll=a,l.loadAllChildren=r,Object.defineProperty(l,Symbol.toStringTag,{value:"Module"})}));
