/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../chunks/tslib.es6","../webgl-engine/core/shaderTechnique/ShaderTechniqueConfiguration"],(function(e,o,r){"use strict";var t;e.NoiseTextureRenderMode=void 0,(t=e.NoiseTextureRenderMode||(e.NoiseTextureRenderMode={}))[t.Full=0]="Full",t[t.WeatherMap=1]="WeatherMap",t[t.COUNT=2]="COUNT";class i extends r.ShaderTechniqueConfiguration{constructor(){super(...arguments),this.mode=e.NoiseTextureRenderMode.Full}}o.__decorate([r.parameter({count:e.NoiseTextureRenderMode.COUNT})],i.prototype,"mode",void 0),e.NoiseTextureAtlasTechniqueConfiguration=i,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
