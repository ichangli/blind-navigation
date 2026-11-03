/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(t){"use strict";function e(t){return t["data-item"]}function n(t,e){t?.sort(((t,n)=>{const i=e.indexOf(t.uid),o=e.indexOf(n.uid);return i>o?-1:i<o?1:0}))}t.getItem=e,t.sortTablesToIds=n,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
