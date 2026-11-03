/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../core/screenUtils"],(function(t,e){"use strict";function o(t){let o=0,s=0,a=0;return t?("cim"===t.type&&t.data.symbol&&"symbolLayers"in t.data.symbol&&t.data.symbol.symbolLayers&&t.data.symbol.symbolLayers.map((t=>{"CIMVectorMarker"===t.type&&t.anchorPoint&&(Math.abs(t.anchorPoint.x)>o&&(o=t.anchorPoint.x),Math.abs(t.anchorPoint.y)>s&&(s=t.anchorPoint.y),null!=t.size&&t.size>a&&(a=t.size))})),o=e.pt2px(o),s=e.pt2px(s),a=e.pt2px(a),{offsetX:o,offsetY:s,size:a}):{offsetX:o,offsetY:s,size:a}}t.getSymbolInfo=o,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
