/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../chunks/tslib.es6","../webgl-engine/core/shaderTechnique/ShaderTechniqueConfiguration","../webgl-engine/materials/DefaultTechniqueConfiguration"],(function(e,o,r,t){"use strict";var n;e.SimpleAtmosphereGeometry=void 0,(n=e.SimpleAtmosphereGeometry||(e.SimpleAtmosphereGeometry={}))[n.Cone=0]="Cone",n[n.Cylinder=1]="Cylinder",n[n.Underground=2]="Underground",n[n.COUNT=3]="COUNT";class i extends t.DefaultTechniqueConfiguration{constructor(){super(...arguments),this.geometry=e.SimpleAtmosphereGeometry.Cone}}o.__decorate([r.parameter({count:e.SimpleAtmosphereGeometry.COUNT})],i.prototype,"geometry",void 0),e.SimpleAtmosphereTechniqueConfiguration=i,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
