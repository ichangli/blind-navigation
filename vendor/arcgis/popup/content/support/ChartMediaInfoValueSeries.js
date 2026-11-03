/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/tslib.es6","../../../core/Accessor","../../../core/accessorSupport/decorators/property","../../../core/has","../../../core/Logger","../../../core/RandomLCG","../../../core/accessorSupport/decorators/subclass"],(function(o,e,r,t,s,c,l){"use strict";var p;let i=p=class extends e{constructor(o){super(o),this.color=null,this.fieldName=null,this.tooltip=null,this.value=null}clone(){return new p({color:this.color?.clone(),fieldName:this.fieldName,tooltip:this.tooltip,value:this.value})}};o.__decorate([r.property()],i.prototype,"color",void 0),o.__decorate([r.property()],i.prototype,"fieldName",void 0),o.__decorate([r.property()],i.prototype,"tooltip",void 0),o.__decorate([r.property()],i.prototype,"value",void 0),i=p=o.__decorate([l.subclass("esri.popup.content.support.ChartMediaInfoValueSeries")],i);return i}));
