/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./componentsUtils"],(function(e,n){"use strict";
/*!
     * All material copyright ESRI, All Rights Reserved, unless otherwise specified.
     * See https://github.com/Esri/calcite-design-system/blob/main/LICENSE.md for details.
     * v2.8.5
     */const t=new WeakMap,o=new WeakMap;function a(e){o.set(e,new Promise((n=>t.set(e,n))))}function s(e){t.get(e)()}function c(e){return o.get(e)}async function i(e){return await c(e),n.forceUpdate(e),new Promise((e=>requestAnimationFrame((()=>e()))))}e.componentFocusable=i,e.componentLoaded=c,e.setComponentLoaded=s,e.setUpLoadableComponent=a}));
