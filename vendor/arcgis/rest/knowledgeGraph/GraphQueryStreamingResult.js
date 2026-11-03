/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/Accessor","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass","./GraphQueryResultHeader"],(function(e,r,s,t,o,c,a,p){"use strict";let u=class extends r{constructor(e){super(e),this.resultRowsStream=new ReadableStream,this.resultHeader=new p}};e.__decorate([s.property()],u.prototype,"resultRowsStream",void 0),e.__decorate([s.property()],u.prototype,"resultHeader",void 0),u=e.__decorate([a.subclass("esri.rest.knowledgeGraph.GraphQueryStreamingResult")],u);return u}));
