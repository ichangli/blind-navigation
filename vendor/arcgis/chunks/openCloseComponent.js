/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./componentsUtils"],(function(n,t){"use strict";
/*!
     * All material copyright ESRI, All Rights Reserved, unless otherwise specified.
     * See https://github.com/Esri/calcite-design-system/blob/main/LICENSE.md for details.
     * v2.8.5
     */function e(n){return"opened"in n?n.opened:n.open}function o(n,t=!1){(t?n[n.transitionProp]:e(n))?n.onBeforeOpen():n.onBeforeClose(),(t?n[n.transitionProp]:e(n))?n.onOpen():n.onClose()}function i(n,i=!1){t.readTask((()=>{if(n.transitionEl){const{transitionDuration:t,transitionProperty:r}=getComputedStyle(n.transitionEl),s=t.split(","),a=s[r.split(",").indexOf(n.openTransitionProp)]??s[0];if("0s"===a)return void o(n,i);const p=setTimeout((()=>{n.transitionEl.removeEventListener("transitionstart",l),n.transitionEl.removeEventListener("transitionend",E),n.transitionEl.removeEventListener("transitioncancel",E),o(n,i)}),1e3*parseFloat(a));function l(t){t.propertyName===n.openTransitionProp&&t.target===n.transitionEl&&(clearTimeout(p),n.transitionEl.removeEventListener("transitionstart",l),(i?n[n.transitionProp]:e(n))?n.onBeforeOpen():n.onBeforeClose())}function E(t){t.propertyName===n.openTransitionProp&&t.target===n.transitionEl&&((i?n[n.transitionProp]:e(n))?n.onOpen():n.onClose(),n.transitionEl.removeEventListener("transitionend",E),n.transitionEl.removeEventListener("transitioncancel",E))}n.transitionEl.addEventListener("transitionstart",l),n.transitionEl.addEventListener("transitionend",E),n.transitionEl.addEventListener("transitioncancel",E)}}))}n.onToggleOpenCloseComponent=i}));
