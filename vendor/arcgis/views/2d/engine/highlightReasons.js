/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../Color","../support/HighlightOptions"],(function(o,r,t){"use strict";const e={selection:o=>new t({color:new r([o.color.r/2,o.color.g/2,o.color.b/2,o.color.a])}),highlight:o=>o,popup:o=>new t({color:new r([o.color.g,o.color.b,o.color.r,o.color.a])})};function i(o){if(!o)return 0;let r=1;for(const t in e){if(t===o)break;r<<=1}return r}const l=Object.keys(e);o.getHighlightBits=i,o.highlightConfigurator=e,o.highlightReasons=l,Object.defineProperty(o,Symbol.toStringTag,{value:"Module"})}));
