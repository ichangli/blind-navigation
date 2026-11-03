/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./componentsUtils"],(function(e,t){"use strict";
/*!
     * All material copyright ESRI, All Rights Reserved, unless otherwise specified.
     * See https://github.com/Esri/calcite-design-system/blob/main/LICENSE.md for details.
     * v2.8.5
     */function n(){return navigator.userAgentData}function i(){const e=n();return e?.brands?e.brands.map((({brand:e,version:t})=>`${e}/${t}`)).join(" "):navigator.userAgent}const o=/firefox/i.test(i()),r=o?new WeakMap:null;function c(){const{disabled:e}=this;e||HTMLElement.prototype.click.call(this)}function a(e){const t=e.target;if(o&&!r.get(t))return;const{disabled:n}=t;n&&e.preventDefault()}const s=["mousedown","mouseup","click"];function l(e){const t=e.target;o&&!r.get(t)||t.disabled&&(e.stopImmediatePropagation(),e.preventDefault())}const u={capture:!0};function d(e){if(e.disabled)return e.el.setAttribute("aria-disabled","true"),e.el.contains(document.activeElement)&&document.activeElement.blur(),void f(e);g(e),e.el.removeAttribute("aria-disabled")}function f(e){if(e.el.click=c,o){const t=p(e),n=r.get(e.el);return n!==t&&(m(n),r.set(e.el,t)),void v(r.get(e.el))}v(e.el)}function v(e){e&&(e.addEventListener("pointerdown",a,u),s.forEach((t=>e.addEventListener(t,l,u))))}function p(e){return e.el.parentElement||e.el}function g(e){if(delete e.el.click,o)return m(r.get(e.el)),void r.delete(e.el);m(e.el)}function m(e){e&&(e.removeEventListener("pointerdown",a,u),s.forEach((t=>e.removeEventListener(t,l,u))))}function b(e){e.disabled&&o&&f(e)}function E(e){o&&g(e)}const h={container:"interaction-container"};function k({disabled:e},n){return t.h("div",{class:h.container,inert:e},...n)}e.InteractiveContainer=k,e.connectInteractive=b,e.disconnectInteractive=E,e.getUserAgentString=i,e.updateHostInteraction=d}));
