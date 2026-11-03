/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/Logger","../../core/has","../../core/RandomLCG","../../core/Error","../../core/accessorSupport/decorators/enumeration","../../core/accessorSupport/decorators/subclass","./Edges3D"],(function(e,r,o,s,t,c,n,d){"use strict";var a;let i=a=class extends d{constructor(e){super(e),this.type="solid"}clone(){return new a(this.cloneProperties())}};e.__decorate([c.enumeration({solid:"solid"},{readOnly:!0})],i.prototype,"type",void 0),i=a=e.__decorate([n.subclass("esri.symbols.edges.SolidEdges3D")],i);return i}));
