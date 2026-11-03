/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./enums","./Util"],(function(t,e,i){"use strict";class s{constructor(t=0,i=t){this.width=t,this.height=i,this.target=e.TextureType.TEXTURE_2D,this.pixelFormat=e.PixelFormat.RGBA,this.dataType=e.PixelType.UNSIGNED_BYTE,this.samplingMode=e.TextureSamplingMode.LINEAR,this.wrapMode=e.TextureWrapMode.REPEAT,this.maxAnisotropy=1,this.flipped=!1,this.hasMipmap=!1,this.isOpaque=!1,this.unpackAlignment=4,this.preMultiplyAlpha=!1,this.depth=1,this.isImmutable=!1}}function r(t){return t.width<=0||t.height<=0?0:Math.round(t.width*t.height*(t.hasMipmap?4/3:1)*(null==t.internalFormat?4:i.getBytesPerElementFormat(t.internalFormat)))}t.TextureDescriptor=s,t.estimateMemory=r,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
