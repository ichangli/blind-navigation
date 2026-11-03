/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../chunks/tslib.es6","../core/JSONSupport","../core/accessorSupport/decorators/property","../core/has","../core/Logger","../core/RandomLCG","../core/accessorSupport/decorators/subclass","../webdoc/applicationProperties/Viewing"],(function(e,r,o,s,t,c,i,n){"use strict";var p;let a=p=class extends r.JSONSupport{constructor(e){super(e),this.viewing=null}clone(){return new p({viewing:this.viewing?.clone()??null})}};e.__decorate([o.property({type:n,json:{write:!0}})],a.prototype,"viewing",void 0),a=p=e.__decorate([i.subclass("esri.webscene.ApplicationProperties")],a);return a}));
