/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../chunks/tslib.es6","../core/Logger","../core/has","../core/RandomLCG","../core/Error","../core/accessorSupport/decorators/subclass","../core/support/OwningCollection"],(function(e,o,s,n,t,r,l,i){"use strict";e.AnalysesCollection=class extends i.OwningCollection{constructor(e){super(e),this.addHandles(this.on("before-add",(e=>{null!=e.item&&e.item.parent===this.owner&&(s.getLogger(this).warn("Analysis inside the collection must be unique. Not adding this element again."),e.preventDefault())})))}_own(e){e.parent=this.owner}_release(e){e.parent=null}},e.AnalysesCollection=o.__decorate([l.subclass("esri.support.AnalysesCollection")],e.AnalysesCollection),Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
