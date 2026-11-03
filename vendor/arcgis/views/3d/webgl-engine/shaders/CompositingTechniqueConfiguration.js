/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../chunks/tslib.es6","../core/shaderTechnique/ShaderTechniqueConfiguration"],(function(e,o,t){"use strict";var a;e.AlphaMode=void 0,(a=e.AlphaMode||(e.AlphaMode={}))[a.None=0]="None",a[a.Alpha=1]="Alpha",a[a.PremultipliedAlpha=2]="PremultipliedAlpha",a[a.COUNT=3]="COUNT";class i extends t.ShaderTechniqueConfiguration{constructor(){super(...arguments),this.alphaMode=e.AlphaMode.None,this.hasOpacityFactor=!1,this.isDepthBlit=!1}}o.__decorate([t.parameter({count:e.AlphaMode.COUNT})],i.prototype,"alphaMode",void 0),o.__decorate([t.parameter()],i.prototype,"hasOpacityFactor",void 0),o.__decorate([t.parameter()],i.prototype,"isDepthBlit",void 0),e.CompositingTechniqueConfiguration=i,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
