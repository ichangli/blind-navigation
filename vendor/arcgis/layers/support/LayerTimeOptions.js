/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass"],(function(e,o,t,r,p,s,c){"use strict";let i=class extends o.JSONSupport{};e.__decorate([t.property({type:Boolean,json:{write:!0}})],i.prototype,"timeDataCumulative",void 0),e.__decorate([t.property({type:Number,json:{write:!0}})],i.prototype,"timeOffset",void 0),e.__decorate([t.property({type:String,json:{write:!0}})],i.prototype,"timeOffsetUnits",void 0),e.__decorate([t.property({type:Boolean,json:{write:!0}})],i.prototype,"useTime",void 0),i=e.__decorate([c.subclass("esri.layers.support.LayerTimeOptions")],i);return i}));
