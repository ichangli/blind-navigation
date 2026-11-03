/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/Collection","../../core/JSONSupport","../../core/lang","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/accessorSupport/decorators/subclass","./BuildingFilterAuthoringInfoType"],(function(e,r,o,t,s,c,p,i,n){"use strict";var l;const u=r.ofType(n);let a=l=class extends o.JSONSupport{clone(){return new l({filterTypes:t.clone(this.filterTypes)})}};e.__decorate([s.property({type:u,json:{write:!0}})],a.prototype,"filterTypes",void 0),a=l=e.__decorate([i.subclass("esri.layers.support.BuildingFilterAuthoringInfoBlock")],a);return a}));
