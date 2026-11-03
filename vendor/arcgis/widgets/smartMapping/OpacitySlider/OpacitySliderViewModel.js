/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/tslib.es6","../../../Color","../../../core/Logger","../../../core/has","../../../core/RandomLCG","../../../core/Error","../../../core/accessorSupport/decorators/subclass","../SmartMappingSliderViewModel"],(function(o,r,e,t,s,c,n,i){"use strict";let a=class extends i{constructor(o){super(o)}getStopInfo(o){const{min:e,max:t,stops:s}=this;if(!s?.length)return[];const c=this._getColorForStops(o)?.toRgb();return s.map((o=>({color:new r(c&&[...c,o.opacity]),offset:(t-o.value)/(t-e)})))}_getColorForStops(o){return o?o instanceof r?o:r.fromString(o):null}};a=o.__decorate([n.subclass("esri.widgets.smartMapping.OpacitySlider.OpacitySliderViewModel")],a);return a}));
