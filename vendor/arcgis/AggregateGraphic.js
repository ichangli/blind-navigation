/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["./chunks/tslib.es6","./Graphic","./core/accessorSupport/decorators/property","./core/has","./core/Logger","./core/RandomLCG","./core/accessorSupport/decorators/subclass"],(function(e,t,r,o,p,s,a){"use strict";let c=class extends t{constructor(){super(...arguments),this.isAggregate=!0}getEffectivePopupTemplate(e=!1){if(this.popupTemplate)return this.popupTemplate;const t=this.sourceLayer?.featureReduction;return t&&"popupTemplate"in t&&t.popupEnabled?t.popupTemplate:null}getObjectId(){return this.attributes.aggregateId}};e.__decorate([r.property({type:Boolean})],c.prototype,"isAggregate",void 0),c=e.__decorate([a.subclass("esri.AggregateGraphic")],c);return c}));
