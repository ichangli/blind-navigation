/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../chunks/tslib.es6","../core/JSONSupport","../core/lang","../core/accessorSupport/decorators/property","../core/has","../core/Logger","../core/accessorSupport/decorators/subclass","../webdoc/applicationProperties/Viewing"],(function(e,o,r,t,i,s,n,p){"use strict";var c;let l=c=class extends o.JSONSupport{constructor(e){super(e),this.editing=null,this.offline=null,this.viewing=null}clone(){return new c(r.clone({editing:this.editing,offline:this.offline,viewing:this.viewing}))}};e.__decorate([t.property({json:{write:!0}})],l.prototype,"editing",void 0),e.__decorate([t.property({json:{write:!0}})],l.prototype,"offline",void 0),e.__decorate([t.property({type:p,json:{write:!0}})],l.prototype,"viewing",void 0),l=c=e.__decorate([n.subclass("esri.webmap.ApplicationProperties")],l);return l}));
