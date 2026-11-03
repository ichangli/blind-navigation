/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../Accessor","./PropertyOrigin","./utils"],(function(e,t,o,i){"use strict";function r(e,n){const s=i.getProperties(e),c=i.getProperties(n),f=s.store,g=c.store,a=c.metadata;for(const i in a){const n=a[i],s=f.originOf(i),c=g.originOf(i);if(!n.readOnly&&c!==o.OriginId.DEFAULTS)if(s===o.OriginId.DEFAULTS)e.set(i,g.get(i));else{const e=f.get(i),o=g.get(i);e&&o&&o instanceof t&&e instanceof t&&e instanceof o.constructor&&r(e,o)}}}e.overrideDefaultsFrom=r,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
