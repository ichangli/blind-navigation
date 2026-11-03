/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/JSONSupport","../../core/lang","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/accessorSupport/decorators/subclass","./Search"],(function(e,r,o,s,c,t,a,p){"use strict";var n;let i=n=class extends r.JSONSupport{constructor(e){super(e),this.search=null}clone(){return new n(o.clone({search:this.search}))}};e.__decorate([s.property({type:p,json:{write:!0}})],i.prototype,"search",void 0),i=n=e.__decorate([a.subclass("esri.webdoc.applicationProperties.Viewing")],i);return i}));
