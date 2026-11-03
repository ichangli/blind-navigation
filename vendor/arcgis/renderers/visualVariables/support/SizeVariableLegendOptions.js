/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/tslib.es6","../../../core/accessorSupport/decorators/property","../../../core/has","../../../core/Logger","../../../core/RandomLCG","../../../core/accessorSupport/decorators/subclass","./VisualVariableLegendOptions"],(function(e,s,r,t,o,c,a){"use strict";var u;let i=u=class extends a{constructor(){super(...arguments),this.customValues=null}clone(){return new u({title:this.title,showLegend:this.showLegend,customValues:this.customValues?.slice(0)})}};e.__decorate([s.property({type:[Number],json:{write:!0}})],i.prototype,"customValues",void 0),i=u=e.__decorate([c.subclass("esri.renderers.visualVariables.support.SizeVariableLegendOptions")],i);return i}));
