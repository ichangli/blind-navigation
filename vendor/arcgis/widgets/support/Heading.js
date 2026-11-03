/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../core/mathUtils","./globalCss","./widgetUtils","./jsxFactory"],(function(e,t,n,l,i){"use strict";function s({level:e,class:t,...s},r){const c=a(e),o=`h${c}`;return i.tsx(o,{...s,"aria-level":String(c),class:l.classes(n.globalCss.heading,t),role:"heading"},r)}function a(e){return t.clamp(Math.ceil(e),1,6)}function r(e,t=1){return a(e+t)}e.Heading=s,e.incrementHeadingLevel=r,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
