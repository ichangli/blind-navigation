/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass","./mixins/ChartMediaInfo","./support/chartMediaInfoUtils"],(function(t,e,r,o,a,s,c,i){"use strict";var p;let n=p=class extends c{constructor(t){super(t),this.type="bar-chart"}clone(){return new p({altText:this.altText,title:this.title,caption:this.caption,value:this.value?.clone()})}};t.__decorate([e.property({type:["bar-chart"],readOnly:!0,json:{type:["barchart"],read:!1,write:i.chartTypeKebabDict.write}})],n.prototype,"type",void 0),n=p=t.__decorate([s.subclass("esri.popup.content.BarChartMediaInfo")],n);return n}));
