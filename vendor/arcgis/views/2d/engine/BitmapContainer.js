/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./brushes","./webgl/enums","./webgl/WGLContainer"],(function(e,s,r,a){"use strict";class t extends a{constructor(){super(...arguments),this._hasCrossfade=!1}get requiresDedicatedFBO(){return super.requiresDedicatedFBO||this._hasCrossfade}beforeRender(e){super.beforeRender(e),this._manageFade()}prepareRenderPasses(e){const a=e.registerRenderPass({name:"bitmap",brushes:[s.brushes.bitmap],target:()=>this.children,drawPhase:r.WGLDrawPhase.MAP});return[...super.prepareRenderPasses(e),a]}_manageFade(){this.children.reduce(((e,s)=>e+(s.inFadeTransition?1:0)),0)>=2?(this.children.forEach((e=>e.blendFunction="additive")),this._hasCrossfade=!0):(this.children.forEach((e=>e.blendFunction="standard")),this._hasCrossfade=!1)}}e.BitmapContainer=t,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
