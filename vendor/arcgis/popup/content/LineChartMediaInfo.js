/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass","./mixins/ChartMediaInfo","./support/chartMediaInfoUtils"],(function(e,t,r,o,s,c,a,i){"use strict";var n;let p=n=class extends a{constructor(e){super(e),this.type="line-chart"}clone(){return new n({altText:this.altText,title:this.title,caption:this.caption,value:this.value?.clone()})}};e.__decorate([t.property({type:["line-chart"],readOnly:!0,json:{type:["linechart"],read:!1,write:i.chartTypeKebabDict.write}})],p.prototype,"type",void 0),p=n=e.__decorate([c.subclass("esri.popup.content.LineChartMediaInfo")],p);return p}));
