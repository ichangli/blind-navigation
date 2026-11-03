/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./enums"],(function(e,t){"use strict";class s{constructor(e){this._context=e,this.type="transform-feedback",this._glName=this._gl.createTransformFeedback(),this._context.instanceCounter.increment(t.ResourceType.TransformFeedback,this)}dispose(){this._context.gl&&this._glName&&(this._gl.deleteTransformFeedback(this._glName),this._glName=null,this._context.instanceCounter.decrement(t.ResourceType.TransformFeedback,this))}get _gl(){return this._context.gl}get glName(){return this._glName}}e.TransformFeedback=s,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
