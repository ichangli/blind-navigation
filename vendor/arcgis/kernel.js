/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["require","exports","./core/has","./core/urlUtils","./support/revision"],(function(e,o,i,s,t){"use strict";Symbol.dispose??=Symbol("Symbol.dispose"),Symbol.asyncDispose??=Symbol("Symbol.asyncDispose");const n="4.30";o.fullVersion=n;{const e="4.30.9";o.fullVersion=e}function r(e){o.id=e}function d(e){const i=o.id?.findCredential(e);return i?.token?s.addQueryParameter(e,"token",i.token):e}o.id=void 0,i("host-webworker"),o.buildDate=t.buildDate,o.revision=t.commitHash,o.addTokenParameter=d,o.setId=r,o.version=n,Object.defineProperty(o,Symbol.toStringTag,{value:"Module"})}));
