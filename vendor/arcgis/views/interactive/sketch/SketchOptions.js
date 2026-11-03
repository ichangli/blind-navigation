/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/tslib.es6","../../../core/Accessor","../../../core/accessorSupport/decorators/property","../../../core/has","../../../core/Logger","../../../core/RandomLCG","../../../core/accessorSupport/decorators/subclass","./SketchLabelOptions","./SketchTooltipOptions","./SketchValueOptions"],(function(e,o,t,s,r,c,p,l,a,n){"use strict";let i=class extends o{constructor(e){super(e),this.labels=new l,this.tooltips=new a,this.values=new n}};e.__decorate([t.property({nonNullable:!0,type:l})],i.prototype,"labels",void 0),e.__decorate([t.property({nonNullable:!0,type:a})],i.prototype,"tooltips",void 0),e.__decorate([t.property({nonNullable:!0,type:n})],i.prototype,"values",void 0),i=e.__decorate([p.subclass("esri.views.interactive.sketch.SketchOptions")],i);return i}));
