/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./componentsUtils","./observers"],(function(n,o,t){"use strict";
/*!
     * All material copyright ESRI, All Rights Reserved, unless otherwise specified.
     * See https://github.com/Esri/calcite-design-system/blob/main/LICENSE.md for details.
     * v2.8.5
     */let e;const c={childList:!0};function i(n){e||(e=t.createObserver("mutation",r)),e.observe(n.el,c)}function s(n){e.unobserve(n.el)}function r(n){n.forEach((({target:n})=>{o.forceUpdate(n)}))}n.connectConditionalSlotComponent=i,n.disconnectConditionalSlotComponent=s}));
