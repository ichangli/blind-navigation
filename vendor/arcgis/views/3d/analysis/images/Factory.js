/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./generateTextures","./heading-rotate-svg","./tilt-rotate-svg","../../webgl-engine/lib/Texture"],(function(e,t,r,o,a){"use strict";const n=64;function l(e,o){const{accentColor:l,contrastColor:c,preMultiplyAlpha:i}=o;return e.fromData(`heading-rotate:[accent:${l},contrast:${c},size:${n}]`,(()=>new a.Texture(t.generateStyledTexture(r,{accentColor:l,contrastColor:c,size:n}),{mipmap:!0,reloadable:!0,preMultiplyAlpha:i})))}function c(e,r){const{accentColor:l,contrastColor:c,preMultiplyAlpha:i}=r;return e.fromData(`tilt-rotate:[accent:${l},contrast:${c},size:${n}]`,(()=>new a.Texture(t.generateStyledTexture(o,{accentColor:l,contrastColor:c,size:n}),{mipmap:!0,reloadable:!0,preMultiplyAlpha:i})))}e.getRotateHeadingTexture=l,e.getTiltRotateTexture=c,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
