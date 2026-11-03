/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/tslib.es6","../../../core/Logger","../../../core/has","../../../core/RandomLCG","../../../core/Error","../../../core/accessorSupport/decorators/subclass","./FeatureLayerView2D","../../layers/OGCFeatureLayerView"],(function(e,r,s,a,t,c,o,i){"use strict";let u=class extends(i(o)){supportsSpatialReference(e){return this.layer.serviceSupportsSpatialReference(e)}};u=e.__decorate([c.subclass("esri.views.2d.layers.OGCFeatureLayerView2D")],u);return u}));
