/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./projectors"],(function(e,r){"use strict";function t(e,t,o,n,c,f,u=1){const i=r.getProjector(t,c,r.projectorCache);if(null==i)return!1;if(i===r.copy3){if(e===n&&o===f)return!0;const r=o+3*u;for(let t=o,c=f;t<r;t++,c++)n[c]=e[t];return!0}const l=o+3*u;for(let r=o,s=f;r<l;r+=3,s+=3)i(e,r,n,s);return!0}e.projectBuffer=t,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
