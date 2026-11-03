/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass"],(function(r,e,o,s,t,c,p){"use strict";let a=class extends e.JSONSupport{constructor(r){super(r),this.properties=null}};r.__decorate([o.property({json:{write:!0}})],a.prototype,"properties",void 0),a=r.__decorate([p.subclass("esri.rest.knowledgeGraph.GraphObject")],a);return a}));
