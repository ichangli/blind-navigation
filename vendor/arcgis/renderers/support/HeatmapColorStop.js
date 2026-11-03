/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../Color","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/accessorSupport/ensureType","../../core/RandomLCG","../../core/has","../../core/accessorSupport/decorators/subclass"],(function(r,o,e,t,s,c,p,a){"use strict";var l;let u=l=class extends e.JSONSupport{constructor(r){super(r),this.color=null,this.ratio=null}clone(){return new l({color:this.color&&this.color.clone(),ratio:this.ratio})}};r.__decorate([t.property({type:o,json:{type:[s.Integer],default:null,write:!0}})],u.prototype,"color",void 0),r.__decorate([t.property({type:Number,json:{write:!0}})],u.prototype,"ratio",void 0),u=l=r.__decorate([a.subclass("esri.renderers.support.HeatmapColorStop")],u);return u}));
