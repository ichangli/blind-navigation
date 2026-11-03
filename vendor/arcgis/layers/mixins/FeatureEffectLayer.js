/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../chunks/tslib.es6","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass","../support/FeatureEffect"],(function(e,r,t,o,s,c,a,u){"use strict";const p={write:{allowNull:!0}},f={type:u,json:{origins:{"web-map":p,"portal-item":p}}},l=e=>{let o=class extends e{constructor(){super(...arguments),this.featureEffect=null}};return r.__decorate([t.property(f)],o.prototype,"featureEffect",void 0),o=r.__decorate([a.subclass("esri.layers.mixins.FeatureEffectLayer")],o),o};e.FeatureEffectLayer=l,e.featureEffectProperty=f,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
