/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/tslib.es6","../../../core/accessorSupport/decorators/property","../../../core/has","../../../core/Logger","../../../core/RandomLCG","../../../core/accessorSupport/decorators/subclass","../../support/LegendOptions"],(function(e,s,r,o,t,n,c){"use strict";var a;let i=a=class extends c.LegendOptions{constructor(){super(...arguments),this.showLegend=null}clone(){return new a({title:this.title,showLegend:this.showLegend})}};e.__decorate([s.property({type:Boolean,json:{write:!0}})],i.prototype,"showLegend",void 0),i=a=e.__decorate([n.subclass("esri.renderers.visualVariables.support.VisualVariableLegendOptions")],i);return i}));
