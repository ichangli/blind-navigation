/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/Accessor","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass"],(function(e,o,r,t,c,s,a){"use strict";let n=class extends o{get canZoomIn(){return!!this.view.ready}get canZoomOut(){return!!this.view.ready}};e.__decorate([r.property({readOnly:!0})],n.prototype,"canZoomIn",null),e.__decorate([r.property({readOnly:!0})],n.prototype,"canZoomOut",null),e.__decorate([r.property()],n.prototype,"view",void 0),n=e.__decorate([a.subclass("esri.widgets.Zoom.ZoomConditions3D")],n);return n}));
