/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./InterleavedLayout"],(function(e,t){"use strict";function u(e,u){return u.push(e.buffer),{buffer:e.buffer,layout:new t.PackedLayout(e.layout)}}function r(e){return new t.InterleavedLayout(e.layout).createView(e.buffer)}e.packInterleavedBuffer=u,e.unpackInterleavedBuffer=r,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
