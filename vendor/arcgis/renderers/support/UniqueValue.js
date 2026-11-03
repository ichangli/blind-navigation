/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/Clonable","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass","./commonProperties"],(function(e,r,o,t,u,s,p,c,a){"use strict";let l=class extends(r.ClonableMixin(o.JSONSupport)){constructor(e){super(e),this.value=null,this.value2=null,this.value3=null}};e.__decorate([t.property(a.uniqueValueProperty)],l.prototype,"value",void 0),e.__decorate([t.property(a.uniqueValueProperty)],l.prototype,"value2",void 0),e.__decorate([t.property(a.uniqueValueProperty)],l.prototype,"value3",void 0),l=e.__decorate([c.subclass("esri.renderers.support.UniqueValue")],l);return l}));
