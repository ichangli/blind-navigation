/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/jsonMap","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/enumeration","../../core/accessorSupport/decorators/subclass"],(function(e,r,o,t,s,c,a,n,p){"use strict";const u=new r.JSONMap({inherited:"inherited",codedValue:"coded-value",range:"range"});let i=class extends o.JSONSupport{constructor(e){super(e),this.name=null,this.type=null}};e.__decorate([t.property({type:String,json:{write:!0}})],i.prototype,"name",void 0),e.__decorate([n.enumeration(u)],i.prototype,"type",void 0),i=e.__decorate([p.subclass("esri.layers.support.Domain")],i);return i}));
