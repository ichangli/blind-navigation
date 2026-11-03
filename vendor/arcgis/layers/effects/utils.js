/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./effects"],(function(t,e){"use strict";function n(t,e){const n=t.length>e.length?t:e;return(t.length>e.length?e:t).every(((t,e)=>t.type===n[e].type))}function l(t,n){const l=t.length>n.length?t:n,f=t.length>n.length?n:t;for(let i=f.length;i<l.length;i++)f.push(e.createEffectWithInitialValues(l[i]))}function f(t){const e=t[0];return!!e&&"type"in e}function i(t,e){return JSON.stringify(t??null)===JSON.stringify(e??null)}t.canInterpolateEffects=n,t.effectEquals=i,t.isEffectFunctions=f,t.normalizeEffects=l,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
