/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass"],(function(e,r,t,o,s,a,p){"use strict";let c=class extends r.JSONSupport{constructor(e){super(e),this.id=null,this.name=null}};e.__decorate([t.property({type:Number,json:{read:{source:"terminalId"},write:{target:"terminalId"}}})],c.prototype,"id",void 0),e.__decorate([t.property({type:String,json:{read:{source:"terminalName"},write:{target:"terminalName"}}})],c.prototype,"name",void 0),e.__decorate([t.property({type:Boolean,json:{write:!0}})],c.prototype,"isUpstreamTerminal",void 0),c=e.__decorate([p.subclass("esri.networks.support.Terminal")],c);return c}));
