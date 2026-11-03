/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/tslib.es6","../../../core/JSONSupport","../../../core/accessorSupport/decorators/property","../../../core/has","../../../core/Logger","../../../core/RandomLCG","../../../core/accessorSupport/decorators/subclass","./Association"],(function(e,o,t,r,s,c,p,a){"use strict";let i=class extends o.JSONSupport{constructor(e){super(e),this.maxGeometryCountExceeded=!1,this.associations=[]}};e.__decorate([t.property({type:Boolean,json:{write:!0}})],i.prototype,"maxGeometryCountExceeded",void 0),e.__decorate([t.property({type:[a],json:{write:!0}})],i.prototype,"associations",void 0),i=e.__decorate([p.subclass("esri.rest.networks.support.AssociationGeometriesResult")],i);return i}));
