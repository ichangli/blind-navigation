/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/Accessor","../../core/Identifiable","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass"],(function(e,t,r,o,s,c,i,p){"use strict";let a=class extends(r.IdentifiableMixin(t)){constructor(e){super(e),this.items=null,this.label=null}get id(){return this.label}findByTemplate(e){return this.items.find((t=>t.template===e))}};e.__decorate([o.property()],a.prototype,"items",void 0),e.__decorate([o.property()],a.prototype,"label",void 0),e.__decorate([o.property()],a.prototype,"id",null),a=e.__decorate([p.subclass("esri.widgets.FeatureTemplates.TemplateItemGroup")],a);return a}));
