/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/Clonable","../../core/JSONSupport","../../core/Logger","../../core/has","../../core/RandomLCG","../../core/Error","../../core/accessorSupport/decorators/enumeration","../../core/accessorSupport/decorators/subclass"],(function(e,r,o,c,s,t,n,a,u){"use strict";let i=class extends(r.ClonableMixin(o.JSONSupport)){constructor(e){super(e),this.type="fence"}};e.__decorate([a.enumeration({fence:"fence"},{readOnly:!0})],i.prototype,"type",void 0),i=e.__decorate([u.subclass("esri.webdoc.geotriggersInfo.Geotrigger")],i);return i}));
