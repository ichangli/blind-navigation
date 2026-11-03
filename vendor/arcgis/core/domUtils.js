/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(e){"use strict";function t(e){return"string"==typeof e?document.getElementById(e):e??null}function n(e){for(;e.hasChildNodes();)e.removeChild(e.firstChild)}function o(e,t){const n=t.parentNode;n&&(n.lastChild===t?n.appendChild(e):n.insertBefore(e,t.nextSibling))}function r(e,t){const n=t.parentNode;n&&n.insertBefore(e,t)}function i(e,t){for(;;){const n=e.firstChild;if(!n)break;t.appendChild(n)}}function l(e){e.parentNode&&e.parentNode.removeChild(e)}const s="function"==typeof Element.prototype.closest?(e,t)=>e.closest(t):(e,t)=>{let n=e;do{if(n.matches(t))return n;n=n.parentElement}while(null!==n&&1===n.nodeType);return null};e.byId=t,e.closest=s,e.empty=n,e.insertAfter=o,e.insertBefore=r,e.remove=l,e.reparent=i,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
