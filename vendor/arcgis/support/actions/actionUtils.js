/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../intl","../../intl/substitute"],(function(t,e,i){"use strict";function n(t){return t.icon?t.icon:"image"in t&&t.image||t.className?void 0:"question"}function o(t){return t?{backgroundImage:`url(${t})`}:{}}function u({action:t,feature:e}){const n=e?.attributes,o="image"in t?t.image:void 0;return o&&n?i.substitute(o,n):o??""}t.getActionIcon=n,t.getActionStyles=o,t.substituteActionImage=u,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
