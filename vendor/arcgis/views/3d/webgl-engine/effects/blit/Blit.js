/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../lib/basicInterfaces","../../../../../chunks/Compositing.glsl","../../shaders/CompositingTechnique","../../shaders/CompositingTechniqueConfiguration","../../../../webgl/enums"],(function(e,i,t,s,r,n){"use strict";class o{constructor(e){this.techniques=e,this._blitConfiguration=new r.CompositingTechniqueConfiguration,this._blitParameters=new t.CompositingPassParameters}render(e,t,r,o,a){e.bindFramebuffer(r.fbo);const u=this.techniques.acquire(s.CompositingTechnique,this._blitConfiguration);return e.setClearColor(0,0,0,1),e.clear(n.ClearBufferBit.COLOR_BUFFER_BIT),u?.compiled?(this._blitParameters.texture=t.getTexture(),e.bindTechnique(u,o,this._blitParameters),e.screen.draw(),u.release(),r):(a(i.RenderRequestType.UPDATE),r)}}e.Blit=o,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
