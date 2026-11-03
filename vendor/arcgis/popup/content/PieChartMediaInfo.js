/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass","./mixins/ChartMediaInfo","./support/chartMediaInfoUtils"],(function(e,t,r,o,s,c,a,i){"use strict";var p;let n=p=class extends a{constructor(e){super(e),this.type="pie-chart"}clone(){return new p({altText:this.altText,title:this.title,caption:this.caption,value:this.value?.clone()})}};e.__decorate([t.property({type:["pie-chart"],readOnly:!0,json:{type:["piechart"],read:!1,write:i.chartTypeKebabDict.write}})],n.prototype,"type",void 0),n=p=e.__decorate([c.subclass("esri.popup.content.PieChartMediaInfo")],n);return n}));
