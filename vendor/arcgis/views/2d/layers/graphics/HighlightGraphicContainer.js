/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../../chunks/tslib.es6","../../../../core/Logger","../../../../core/has","../../../../core/RandomLCG","../../../../core/Error","../../../../core/accessorSupport/decorators/subclass","../../engine/webgl/enums","./AGraphicContainer","../support/util"],(function(e,r,s,t,i,a,n,h,o){"use strict";let c=class extends h.AGraphicContainer{get hasHighlight(){return this.children.some((e=>e.hasData))}renderChildren(e){this.attributeView.update(),e.drawPhase===n.WGLDrawPhase.HIGHLIGHT&&this.children.some((e=>e.hasData))&&(super.renderChildren(e),e.context.setColorMask(!0,!0,!0,!0),o.renderHighlight(e,!0,(e=>{this._renderChildren(e,n.FeatureSelection.All)})))}};c=e.__decorate([a.subclass("esri.views.2d.layers.graphics.HighlightGraphicContainer")],c);return c}));
