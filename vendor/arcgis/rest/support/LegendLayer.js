/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass"],(function(e,r,o,t,s,p,c){"use strict";let a=class extends r.JSONSupport{constructor(e){super(e),this.layerId=null,this.subLayerIds=null,this.title=null}};e.__decorate([o.property({json:{write:!0}})],a.prototype,"layerId",void 0),e.__decorate([o.property({json:{write:!0}})],a.prototype,"subLayerIds",void 0),e.__decorate([o.property({json:{write:!0}})],a.prototype,"title",void 0),a=e.__decorate([c.subclass("esri.rest.support.LegendLayer")],a);return a}));
