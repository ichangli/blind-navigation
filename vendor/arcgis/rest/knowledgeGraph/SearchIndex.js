/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/Accessor","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass"],(function(e,r,o,t,s,p,c){"use strict";let a=class extends r{constructor(e){super(e),this.name=null,this.supportedCategory=null,this.analyzers=[],this.searchProperties=new Map}};e.__decorate([o.property()],a.prototype,"name",void 0),e.__decorate([o.property()],a.prototype,"supportedCategory",void 0),e.__decorate([o.property()],a.prototype,"analyzers",void 0),e.__decorate([o.property()],a.prototype,"searchProperties",void 0),a=e.__decorate([c.subclass("esri.rest.knowledgeGraph.SearchIndex")],a);return a}));
