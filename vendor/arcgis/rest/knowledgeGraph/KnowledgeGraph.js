/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass","./DataModel","./ServiceDefinition"],(function(e,r,o,t,s,p,c,i,n){"use strict";let a=class extends r.JSONSupport{constructor(e){super(e),this.dataModel=null,this.serviceDefinition=null}};e.__decorate([o.property({type:String,json:{write:!0}})],a.prototype,"url",void 0),e.__decorate([o.property({type:i,json:{write:!0}})],a.prototype,"dataModel",void 0),e.__decorate([o.property({type:n,json:{write:!0}})],a.prototype,"serviceDefinition",void 0),a=e.__decorate([c.subclass("esri.rest.knowledgeGraph.KnowledgeGraph")],a);return a}));
