/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(t){"use strict";
/*!
     * All material copyright ESRI, All Rights Reserved, unless otherwise specified.
     * See https://github.com/Esri/calcite-design-system/blob/main/LICENSE.md for details.
     * v2.8.5
     */const e=["date","datetime-local","month","number","range","time","week"],n=["email","password","search","tel","text","url"],s=["email","password","search","tel","text","textarea","url"];function a(t,e,n,s){const a=n.toLowerCase(),r=t[n];s&&null!=r?e.setAttribute(a,`${r}`):e.removeAttribute(a)}function r(t,r,i){i.type="textarea"===t?"text":t;const o=e.includes(t),c=r;a(c,i,"min",o),a(c,i,"max",o),a(c,i,"step",o);const u=s.includes(t),l=r;a(l,i,"minLength",u),a(l,i,"maxLength",u);a(l,i,"pattern",n.includes(t))}t.syncHiddenFormInput=r}));
