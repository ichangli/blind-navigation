/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../chunks/tslib.es6","../../core/reactiveUtils","../../core/Logger","../../core/has","../../core/RandomLCG","../../core/Error","../../core/accessorSupport/decorators/subclass","./InteractiveToolBase"],(function(e,s,a,t,i,o,r,c,l){"use strict";e.AnalysisToolBase=class extends l.InteractiveToolBase{constructor(e){super(e)}initialize(){this.addHandles(a.watch((()=>this.analysisViewData.visible),(e=>this.visible=e),a.syncAndInitial))}deactivate(){this.onDeactivate(),this.created||this.analysis.clear()}resetCreated(){this._set("created",!1)}},e.AnalysisToolBase=s.__decorate([c.subclass("esri.views.interactive.AnalysisToolBase")],e.AnalysisToolBase),Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
