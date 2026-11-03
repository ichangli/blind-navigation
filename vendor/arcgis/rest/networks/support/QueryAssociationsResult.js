/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/tslib.es6","../../../core/JSONSupport","../../../core/accessorSupport/decorators/property","../../../core/has","../../../core/Logger","../../../core/RandomLCG","../../../core/accessorSupport/decorators/subclass","./Association"],(function(s,o,r,e,t,c,p,a){"use strict";let i=class extends o.JSONSupport{constructor(s){super(s),this.associations=[]}};s.__decorate([r.property({type:[a],json:{write:!0}})],i.prototype,"associations",void 0),i=s.__decorate([p.subclass("esri.rest.networks.support.QueryAssociationsResult")],i);return i}));
