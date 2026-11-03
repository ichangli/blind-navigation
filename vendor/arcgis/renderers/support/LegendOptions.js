/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../chunks/tslib.es6","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass"],(function(e,t,r,o,s,n,p,c){"use strict";var i;e.LegendOptions=i=class extends r.JSONSupport{constructor(){super(...arguments),this.title=null}clone(){return new i({title:this.title})}},t.__decorate([o.property({type:String,json:{write:!0}})],e.LegendOptions.prototype,"title",void 0),e.LegendOptions=i=t.__decorate([c.subclass("esri.renderers.support.LegendOptions")],e.LegendOptions),Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
