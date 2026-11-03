/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./enums","./TextureDescriptor"],(function(e,t,i){"use strict";class a extends i.TextureDescriptor{constructor(e,i){switch(super(),this.context=e,Object.assign(this,i),this.internalFormat){case t.SizedPixelFormat.R16F:case t.SizedPixelFormat.R16I:case t.SizedPixelFormat.R16UI:case t.SizedPixelFormat.R32F:case t.SizedPixelFormat.R32I:case t.SizedPixelFormat.R32UI:case t.SizedPixelFormat.R8_SNORM:case t.SizedPixelFormat.R8:case t.SizedPixelFormat.R8I:case t.SizedPixelFormat.R8UI:this.pixelFormat=t.PixelFormat.RED}}static validate(e,t){return new a(e,t)}}e.ValidatedTextureDescriptor=a,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
