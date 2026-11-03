/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/tslib.es6","../../../core/accessorSupport/decorators/property","../../../core/has","../../../core/Logger","../../../core/RandomLCG","../../../core/accessorSupport/decorators/subclass","./MediaInfo","../support/ChartMediaInfoValue"],(function(e,r,o,t,s,c,a,p){"use strict";let n=class extends a{constructor(e){super(e),this.type=null,this.value=void 0}};e.__decorate([r.property({type:["bar-chart","column-chart","line-chart","pie-chart"],readOnly:!0,json:{read:!1,write:!0}})],n.prototype,"type",void 0),e.__decorate([r.property({type:p,json:{write:!0}})],n.prototype,"value",void 0),n=e.__decorate([c.subclass("esri.popup.content.mixins.ChartMediaInfo")],n);return n}));
