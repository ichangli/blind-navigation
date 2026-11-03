/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define((function(){"use strict";class t{constructor(){this.name=this.constructor.name||"UnnamedBrush",this.brushEffect=null}prepareState(t,r){}draw(t,r,s){}drawMany(t,r,s){for(const n of r)n.visible&&this.draw(t,n,s)}}return t}));
