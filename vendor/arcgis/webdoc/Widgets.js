/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../chunks/tslib.es6","../core/JSONSupport","../core/lang","../core/accessorSupport/decorators/property","../core/has","../core/Logger","../core/accessorSupport/decorators/subclass","./widgets/FloorFilter","./widgets/Range","./widgets/TimeSlider"],(function(e,r,t,o,s,i,l,c,p,n){"use strict";var d;let a=d=class extends r.JSONSupport{constructor(e){super(e),this.range=null,this.timeSlider=null,this.floorFilter=null}clone(){return new d(t.clone({range:this.range,timeSlider:this.timeSlider,floorFilter:this.floorFilter}))}};e.__decorate([o.property({type:p,json:{write:!0}})],a.prototype,"range",void 0),e.__decorate([o.property({type:n,json:{write:!0}})],a.prototype,"timeSlider",void 0),e.__decorate([o.property({type:c,json:{write:!0}})],a.prototype,"floorFilter",void 0),a=d=e.__decorate([l.subclass("esri.webdoc.Widgets")],a);return a}));
