/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass","./FeatureSet"],(function(e,t,o,r,s,c,n){"use strict";var a;let d=a=class extends n{constructor(e){super(e),this.doNotLocateOnRestrictedElements=null}clone(){return new a({doNotLocateOnRestrictedElements:this.doNotLocateOnRestrictedElements,...this.cloneProperties()})}};e.__decorate([t.property({type:Boolean,json:{write:!0}})],d.prototype,"doNotLocateOnRestrictedElements",void 0),d=a=e.__decorate([c.subclass("esri.rest.support.NetworkFeatureSet")],d);return d}));
