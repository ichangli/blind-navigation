/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../chunks/tslib.es6","../Color","../core/Accessor","../core/Clonable","../core/accessorSupport/decorators/property","../core/has","../core/Logger","../core/RandomLCG","../core/accessorSupport/decorators/subclass"],(function(e,o,r,t,c,s,l,n,a){"use strict";let p=class extends(t.ClonableMixin(r)){constructor(e){super(e),this.accentColor=new o([255,127,0]),this.textColor=new o([255,255,255])}};e.__decorate([c.property({type:o,nonNullable:!0})],p.prototype,"accentColor",void 0),e.__decorate([c.property({type:o,nonNullable:!0})],p.prototype,"textColor",void 0),p=e.__decorate([a.subclass("esri.views.Theme")],p);return p}));
