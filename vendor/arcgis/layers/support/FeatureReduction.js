/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../chunks/tslib.es6","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass"],(function(e,r,t,o,s,c,u,p){"use strict";e.FeatureReduction=class extends t.JSONSupport{constructor(){super(...arguments),this.type=null}},r.__decorate([o.property({type:["selection","cluster","binning"],readOnly:!0,json:{read:!1,write:!0}})],e.FeatureReduction.prototype,"type",void 0),e.FeatureReduction=r.__decorate([p.subclass("esri.layers.support.FeatureReduction")],e.FeatureReduction),Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
