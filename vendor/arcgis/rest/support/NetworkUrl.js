/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/Clonable","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass"],(function(e,o,r,t,s,c,p,n){"use strict";let l=class extends(o.ClonableMixin(r.JSONSupport)){constructor(e){super(e),this.doNotLocateOnRestrictedElements=null,this.url=null}};e.__decorate([t.property({type:Boolean,json:{write:!0}})],l.prototype,"doNotLocateOnRestrictedElements",void 0),e.__decorate([t.property({type:String,json:{write:!0}})],l.prototype,"url",void 0),l=e.__decorate([n.subclass("esri.rest.support.NetworkUrl")],l);return l}));
