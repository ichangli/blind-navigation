/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./index","./node","./asset","./scene"],(function(e,n,t,o,i){"use strict";async function d(e,d){const r=new o.Asset,s=new i.Scene;return r.addScene(s),s.addNode(new t.Node(e)),await n.exportGLB(r,{origin:e.origin,...d})}e.toBinaryGLTF=d,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
