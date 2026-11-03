/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./DepthRange"],(function(e,t){"use strict";class s{constructor(e){this._objects=e}submit(e,t){this._objects.preSubmit(t),this._objects.visibleObjects.forAll((s=>s.renderable.material.submit(e,t,s)))}queryShadowCasterDepthRange(e){return this._objects.visibleObjects.length?t.computeDepthRange(e,this._objects.visibleObjects):null}}e.RenderSubmitSystem=s,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
