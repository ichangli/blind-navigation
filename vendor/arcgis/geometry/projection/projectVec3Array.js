/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../chunks/vec32","./projectors"],(function(e,r,t){"use strict";function o(e,o,c,n,u,f,i=1){const s=t.getProjector(o,u,t.projectorCache);if(null==s)return!1;if(s===t.copy3){if(e===n&&c===f)return!0;const t=c+i;for(let o=c,u=f;o<t;++o,++u)r.copy(n[u],e[o]);return!0}const l=c+i;for(let r=c,t=f;r<l;++r,++t)s(e[r],0,n[t],0);return!0}e.projectVec3Array=o,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
