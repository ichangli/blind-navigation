/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/tslib.es6","../../../core/Logger","../../../core/has","../../../core/RandomLCG","../../../core/Error","../../../core/accessorSupport/decorators/subclass","../SmartMappingPrimaryHandleSliderViewModel"],(function(e,r,o,s,t,c,a){"use strict";let l=class extends a{constructor(e){super(e)}getStopInfo(){const{min:e,max:r,stops:o}=this;return o?.length?o.map((o=>({color:o.color,offset:(r-o.value)/(r-e)}))):[]}};l=e.__decorate([c.subclass("esri.widgets.smartMapping.ColorSlider.ColorSliderViewModel")],l);return l}));
