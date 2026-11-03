/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/lang","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/accessorSupport/decorators/subclass","./AlgorithmicColorRamp","./ColorRamp"],(function(r,o,e,t,s,p,c,a){"use strict";var l;let i=l=class extends a{constructor(r){super(r),this.colorRamps=null,this.type="multipart"}clone(){return new l({colorRamps:o.clone(this.colorRamps)})}};r.__decorate([e.property({type:[c],json:{write:!0}})],i.prototype,"colorRamps",void 0),r.__decorate([e.property({type:["multipart"]})],i.prototype,"type",void 0),i=l=r.__decorate([p.subclass("esri.rest.support.MultipartColorRamp")],i);return i}));
