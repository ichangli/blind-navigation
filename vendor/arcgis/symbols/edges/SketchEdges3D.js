/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/Logger","../../core/has","../../core/RandomLCG","../../core/Error","../../core/accessorSupport/decorators/enumeration","../../core/accessorSupport/decorators/subclass","./Edges3D"],(function(e,r,s,o,t,c,n,a){"use strict";var u;let d=u=class extends a{constructor(e){super(e),this.type="sketch"}clone(){return new u(this.cloneProperties())}};e.__decorate([c.enumeration({sketch:"sketch"},{readOnly:!0})],d.prototype,"type",void 0),d=u=e.__decorate([n.subclass("esri.symbols.edges.SketchEdges3D")],d);return d}));
