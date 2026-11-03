/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./Effect","../../../../webgl/enums"],(function(e,t,r){"use strict";class s extends t.Effect{constructor(e){super(),this.name=this.constructor.name,this.defines=[e]}dispose(){}bind({context:e,painter:t}){this._prev=e.getBoundFramebufferObject();const r=t.getFbos().effect0;e.bindFramebuffer(r),e.setColorMask(!0,!0,!0,!0),e.setClearColor(0,0,0,0),e.clear(e.gl.COLOR_BUFFER_BIT)}unbind(){}draw(e,t){const{context:s,painter:n}=e,o=n.getPostProcessingEffects(t),c=s.getBoundFramebufferObject();for(const{postProcessingEffect:r,effect:f}of o)r.draw(e,c,f);s.bindFramebuffer(this._prev),s.setStencilTestEnabled(!1),n.blitTexture(s,c.colorTexture,r.TextureSamplingMode.NEAREST),s.setStencilTestEnabled(!0)}}e.FeatureEffect=s,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
