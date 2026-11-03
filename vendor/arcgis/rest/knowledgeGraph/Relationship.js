/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../geometry","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass","./GraphNamedObject","../../geometry/Polyline"],(function(e,o,t,r,s,i,n,p,c){"use strict";let a=class extends p{constructor(e){super(e),this.originId=null,this.destinationId=null,this.layoutGeometry=null}};e.__decorate([t.property({type:String,json:{write:!0}})],a.prototype,"originId",void 0),e.__decorate([t.property({type:String,json:{write:!0}})],a.prototype,"destinationId",void 0),e.__decorate([t.property({type:c,json:{write:!0}})],a.prototype,"layoutGeometry",void 0),a=e.__decorate([n.subclass("esri.rest.knowledgeGraph.Relationship")],a);return a}));
