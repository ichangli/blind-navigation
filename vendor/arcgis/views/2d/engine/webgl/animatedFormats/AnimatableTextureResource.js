/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../definitions","./utils"],(function(t,i,e){"use strict";class a{constructor(t,i,a,n){this._animation=t,this._frameData=null;const s=t=>{this._frameData=t,i.requestRender()};this.frameCount=this._animation.frameDurations.length,this.width=this._animation.width,this.height=this._animation.height,this._playHandle=e.play(this._animation,a,n,s)}destroy(){this._playHandle.remove()}loadFrame(t){const e=this._frameData;if(null==e)return;const a="width"in e?e.width:e.codedWidth,n="height"in e?e.height:e.codedHeight;t.updateData(0,i.spritePadding,i.spritePadding,a,n,e),this._frameData=null}}t.AnimatableTextureResource=a,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
