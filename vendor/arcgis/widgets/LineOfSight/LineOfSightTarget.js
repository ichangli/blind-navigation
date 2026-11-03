/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../Graphic","../../core/Accessor","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass","../../geometry/Point"],(function(e,t,o,r,c,s,i,p,a){"use strict";let n=class extends o{constructor(e){super(e),this.location=null,this.intersectedLocation=null,this.intersectedGraphic=null,this.visible=void 0}};e.__decorate([r.property({type:a})],n.prototype,"location",void 0),e.__decorate([r.property({type:a})],n.prototype,"intersectedLocation",void 0),e.__decorate([r.property({type:t})],n.prototype,"intersectedGraphic",void 0),e.__decorate([r.property({type:Boolean})],n.prototype,"visible",void 0),n=e.__decorate([p.subclass("esri.widgets.LineOfSight.LineOfSightTarget")],n);return n}));
