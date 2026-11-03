/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass","./mixins/ChartMediaInfo","./support/chartMediaInfoUtils"],(function(t,e,r,o,c,s,a,n){"use strict";var i;let p=i=class extends a{constructor(t){super(t),this.type="column-chart"}clone(){return new i({altText:this.altText,title:this.title,caption:this.caption,value:this.value?.clone()})}};t.__decorate([e.property({type:["column-chart"],readOnly:!0,json:{type:["columnchart"],read:!1,write:n.chartTypeKebabDict.write}})],p.prototype,"type",void 0),p=i=t.__decorate([s.subclass("esri.popup.content.ColumnChartMediaInfo")],p);return p}));
