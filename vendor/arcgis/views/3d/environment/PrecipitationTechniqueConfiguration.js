/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../chunks/tslib.es6","../webgl-engine/core/shaderTechnique/ShaderTechniqueConfiguration"],(function(e,i,t){"use strict";var n;e.PrecipitationType=void 0,(n=e.PrecipitationType||(e.PrecipitationType={}))[n.Rain=0]="Rain",n[n.Snow=1]="Snow",n[n.COUNT=2]="COUNT";class o extends t.ShaderTechniqueConfiguration{constructor(){super(...arguments),this.type=e.PrecipitationType.Rain}}i.__decorate([t.parameter({count:e.PrecipitationType.COUNT})],o.prototype,"type",void 0),e.PrecipitationTechniqueConfiguration=o,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
