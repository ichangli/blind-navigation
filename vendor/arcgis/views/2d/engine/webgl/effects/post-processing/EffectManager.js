/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./Bloom","./Blur","./Colorize","./DropShadow","./Opacity"],(function(e,o,t,c,s,r){"use strict";function f(e){switch(e){case"bloom":case"blur":case"opacity":case"drop-shadow":return e;default:return"colorize"}}const a={colorize:()=>new c.Colorize,blur:()=>new t.Blur,bloom:()=>new o.Bloom,opacity:()=>new r.Opacity,"drop-shadow":()=>new s.DropShadow};class n{constructor(){this._effectMap=new Map}dispose(){this._effectMap.forEach((e=>e.dispose())),this._effectMap.clear()}getPostProcessingEffects(e){if(!e||0===e.length)return[];const o=[];for(const t of e){const e=f(t.type);let c=this._effectMap.get(e);c||(c=a[e](),this._effectMap.set(e,c)),o.push({postProcessingEffect:c,effect:t})}return o}}e.EffectManager=n,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
