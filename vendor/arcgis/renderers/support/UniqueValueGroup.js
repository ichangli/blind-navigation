/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/Clonable","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass","./UniqueValueClass"],(function(e,r,o,s,t,c,p,a,n){"use strict";let u=class extends(r.ClonableMixin(o.JSONSupport)){constructor(e){super(e),this.heading=null,this.classes=null}};e.__decorate([s.property({type:String,json:{write:!0}})],u.prototype,"heading",void 0),e.__decorate([s.property({type:[n],json:{write:!0}})],u.prototype,"classes",void 0),u=e.__decorate([a.subclass("esri.renderers.support.UniqueValueGroup")],u);return u}));
