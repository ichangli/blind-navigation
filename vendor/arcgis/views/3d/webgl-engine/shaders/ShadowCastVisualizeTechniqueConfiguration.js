/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../chunks/tslib.es6","../core/shaderTechnique/ShaderTechniqueConfiguration"],(function(a,i,e){"use strict";var t;a.ShadowCastVisualization=void 0,(t=a.ShadowCastVisualization||(a.ShadowCastVisualization={}))[t.Gradient=0]="Gradient",t[t.Threshold=1]="Threshold",t[t.COUNT=2]="COUNT";class o extends e.ShaderTechniqueConfiguration{constructor(){super(...arguments),this.visualization=a.ShadowCastVisualization.Gradient,this.bandsEnabled=!1}}i.__decorate([e.parameter({count:a.ShadowCastVisualization.COUNT})],o.prototype,"visualization",void 0),i.__decorate([e.parameter()],o.prototype,"bandsEnabled",void 0),a.ShadowCastVisualizeTechniqueConfiguration=o,Object.defineProperty(a,Symbol.toStringTag,{value:"Module"})}));
