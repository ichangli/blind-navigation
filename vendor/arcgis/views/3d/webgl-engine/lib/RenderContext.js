/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../core/time","../../webgl/RenderCamera","../core/shaderLibrary/ShaderOutput","./BindParameters","./Material"],(function(e,r,t,n,l,a){"use strict";class d{constructor(e,r,a=null){this.rctx=e,this.sliceHelper=a,this.lastFrameCamera=new t,this.output=n.ShaderOutput.Color,this.renderOccludedMask=c,this.bindParameters=new l.BindParameters(r,null!=a?a.plane:null),this.bindParameters.alignPixelEnabled=!0}}class s extends d{constructor(e,t,n,l){super(e,n,l),this.offscreenRenderingHelper=t,this.sliceHelper=l,this.time=r.Milliseconds(0)}}const c=a.RenderOccludedFlag.Occlude|a.RenderOccludedFlag.OccludeAndTransparent|a.RenderOccludedFlag.OccludeAndTransparentStencil;e.OverlayRenderContext=d,e.RenderContext=s,e.defaultRenderOccludedMask=c,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
