/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["./TextHelperCanvas","./TextRenderer","./TextTextureAtlas","./Texture","../../../webgl/enums"],(function(e,r,t,n,s){"use strict";class i{constructor(e,n,s){this._renderer=new r.TextRenderer(e,n,s,t.TextTextureAtlas.maxSize)}get key(){return this._renderer.key}get baselineAnchorY(){return 1-this._renderer.firstRenderedBaselinePosition/this._renderer.renderedHeight}get displayWidth(){return this._renderer.displayWidth}get displayHeight(){return this._renderer.displayHeight}create(){const r=e.getTextHelperCanvas(d,this._renderer.renderedWidth,this._renderer.renderedHeight),t=r.getContext("2d");return t.save(),this._renderer.render(t,0,0),t.restore(),new n.Texture(r,{wrap:{s:s.TextureWrapMode.CLAMP_TO_EDGE,t:s.TextureWrapMode.CLAMP_TO_EDGE},noUnpackFlip:!1,mipmap:!0,preMultiplyAlpha:!0})}}const d={canvas:null};return i}));
