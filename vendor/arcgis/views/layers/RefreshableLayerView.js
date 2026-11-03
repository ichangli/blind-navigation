/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/Logger","../../core/promiseUtils","../../core/reactiveUtils","../../core/has","../../core/RandomLCG","../../core/Error","../../core/accessorSupport/decorators/subclass"],(function(e,r,s,o,t,a,i,c){"use strict";return t=>{let a=class extends t{initialize(){this.addHandles(o.on((()=>this.layer),"refresh",(e=>{this.doRefresh(e.dataChanged).catch((e=>{s.isAbortError(e)||r.getLogger(this).error(e)}))})),"RefreshableLayerView")}};return a=e.__decorate([c.subclass("esri.views.layers.RefreshableLayerView")],a),a}}));
