/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./componentsUtils"],(function(t,r){"use strict";
/*!
     * All material copyright ESRI, All Rights Reserved, unless otherwise specified.
     * See https://github.com/Esri/calcite-design-system/blob/main/LICENSE.md for details.
     * v2.8.5
     */const e={arrow:"calcite-floating-ui-arrow",arrowStroke:"calcite-floating-ui-arrow__stroke"},o={width:12,height:6,strokeWidth:1},i=({floatingLayout:t,key:i,ref:a})=>{const{width:h,height:n,strokeWidth:s}=o,c=h/2,l="vertical"===t,w=`M0,0 H${h} L${h-c},${n} Q${c},${n} ${c},${n} Z`;return r.h("svg",{"aria-hidden":"true",class:e.arrow,height:h,key:i,viewBox:`0 0 ${h} ${h+(l?0:s)}`,width:h+(l?s:0),ref:a},s>0&&r.h("path",{class:e.arrowStroke,d:w,fill:"none","stroke-width":s+1}),r.h("path",{d:w,stroke:"none"}))};t.FloatingArrow=i}));
