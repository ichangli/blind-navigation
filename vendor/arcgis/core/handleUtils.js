/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(e){"use strict";const n={remove:()=>{}};function o(e){return e?{remove(){e&&(e(),e=void 0)}}:n}function r(e){e.forEach((e=>e?.remove()))}function t(e){return o((()=>r(e)))}function u(e){return o((()=>e()?.remove()))}function l(e){return o((()=>e?.abort()))}function i(e){return o(null!=e?()=>e.destroy():void 0)}function a(e,n){let r=!1,t=null;return e.then((e=>{r?e.remove():t=e})),o((()=>{r=!0,null!=t?t.remove():null!=n&&(n.abort(),n=null)}))}function d(e){return{[Symbol.dispose](){e.remove()}}}e.abortHandle=l,e.asyncHandle=a,e.destroyHandle=i,e.disposable=d,e.handlesGroup=t,e.makeHandle=o,e.refHandle=u,e.removeHandles=r,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
