/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(e){"use strict";function n(e,n){if(null==e)throw new Error(n??"value is None")}function r(e){return e?.destroy(),null}function u(e){return e?.dispose(),null}function t(e){return e?.remove(),null}function o(e){return e?.abort(),null}function l(e){return e?.release(),null}function i(e,n,r){return null!=e&&null!=n?null!=r?r(e,n):e.equals(n):e===n}function a(e,n){return e?.[n]}function s(e,n){let r;return e.some(((e,u)=>(r=n(e,u),null!=r))),r??void 0}e.abortMaybe=o,e.assertIsSome=n,e.destroyMaybe=r,e.disposeMaybe=u,e.equalsMaybe=i,e.mappedFind=s,e.maybeProperty=a,e.releaseMaybe=l,e.removeMaybe=t,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
