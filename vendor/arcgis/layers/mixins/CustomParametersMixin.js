/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../chunks/tslib.es6","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass"],(function(e,r,s,t,o,c,a){"use strict";const i=e=>{let t=class extends e{constructor(){super(...arguments),this.customParameters=null}};return r.__decorate([s.property({type:Object,json:{write:{overridePolicy:e=>({enabled:!!(e&&Object.keys(e).length>0)})}}})],t.prototype,"customParameters",void 0),t=r.__decorate([a.subclass("esri.layers.mixins.CustomParametersMixin")],t),t};e.CustomParametersMixin=i,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
