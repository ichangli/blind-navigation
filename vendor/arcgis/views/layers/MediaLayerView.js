/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass","../3d/layers/support/MediaLayerInteractionOptions"],(function(e,t,r,o,s,c,i){"use strict";return r=>{let o=class extends r{constructor(...e){super(...e),this.layer=null,this.interactive=!1,this.interactionOptions=new i.MediaLayerInteractionOptions,this.selectedElement=null}};return e.__decorate([t.property()],o.prototype,"layer",void 0),e.__decorate([t.property()],o.prototype,"interactive",void 0),e.__decorate([t.property()],o.prototype,"interactionOptions",void 0),e.__decorate([t.property()],o.prototype,"selectedElement",void 0),o=e.__decorate([c.subclass("esri.views.layers.MediaLayerView")],o),o}}));
