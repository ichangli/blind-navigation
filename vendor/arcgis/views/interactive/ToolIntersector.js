/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../3d/webgl-engine/lib/Intersector","../3d/webgl-engine/lib/IntersectorInterfaces"],(function(e,t,n){"use strict";function o(e){const o=t.newIntersector(e);return o.options.store=n.StoreResults.MIN,o.options.hud=!1,o}e.newToolIntersector=o,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
