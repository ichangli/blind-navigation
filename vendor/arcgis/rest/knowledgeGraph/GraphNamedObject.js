/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass","./GraphObject"],(function(e,r,t,o,s,c,p){"use strict";let a=class extends p{constructor(e){super(e),this.typeName=null,this.id=null}};e.__decorate([r.property({type:String,json:{write:!0}})],a.prototype,"typeName",void 0),e.__decorate([r.property({type:String,json:{write:!0}})],a.prototype,"id",void 0),a=e.__decorate([c.subclass("esri.rest.knowledgeGraph.GraphNamedObject")],a);return a}));
