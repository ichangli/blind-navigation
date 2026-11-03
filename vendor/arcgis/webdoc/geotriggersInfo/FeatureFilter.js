/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../geometry","../../core/Clonable","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass","../../geometry/support/jsonUtils"],(function(e,r,o,t,s,c,p,n,i,a){"use strict";let u=class extends(o.ClonableMixin(t.JSONSupport)){constructor(e){super(e),this.geometry=null,this.where=null}};e.__decorate([s.property({types:r.geometryTypes,json:{read:a.fromJSON,write:!0}})],u.prototype,"geometry",void 0),e.__decorate([s.property({type:String,json:{write:!0}})],u.prototype,"where",void 0),u=e.__decorate([i.subclass("esri.webdoc.geotriggersInfo.FeatureFilter")],u);return u}));
