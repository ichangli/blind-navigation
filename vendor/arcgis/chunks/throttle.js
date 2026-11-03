/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./debounce"],(function(n,i){"use strict";
/*!
   * All material copyright ESRI, All Rights Reserved, unless otherwise specified.
   * See https://github.com/Esri/calcite-design-system/blob/main/LICENSE.md for details.
   * v2.8.5
   */var e="Expected a function";function t(n,t,r){var a=!0,o=!0;if("function"!=typeof n)throw new TypeError(e);return i.isObject(r)&&(a="leading"in r?!!r.leading:a,o="trailing"in r?!!r.trailing:o),i.debounce(n,t,{leading:a,maxWait:t,trailing:o})}n.throttle=t}));
