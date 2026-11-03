/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass","./GraphSearch"],(function(e,r,t,o,s,p,c){"use strict";let a=class extends c{constructor(e){super(e),this.returnSearchContext=null,this.start=null,this.num=null,this.namedTypesFilter=null,this.idsFilter=null}};e.__decorate([r.property()],a.prototype,"returnSearchContext",void 0),e.__decorate([r.property()],a.prototype,"start",void 0),e.__decorate([r.property()],a.prototype,"num",void 0),e.__decorate([r.property()],a.prototype,"namedTypesFilter",void 0),e.__decorate([r.property()],a.prototype,"idsFilter",void 0),a=e.__decorate([p.subclass("esri.rest.knowledgeGraph.GraphSearchStreaming")],a);return a}));
