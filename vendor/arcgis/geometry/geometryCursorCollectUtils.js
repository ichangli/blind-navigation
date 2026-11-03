/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(t){"use strict";function e(t){const e=[];for(t.reset();t.nextPath();){const n=[];for(;t.nextPoint();)n.push([t.x,t.y]);e.push(n)}return t.reset(),e}function n(t){const e=[];for(;t.nextPoint();)e.push([t.x,t.y]);return t.seekPathStart(),e}t.collectMultipath=e,t.collectPath=n,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
