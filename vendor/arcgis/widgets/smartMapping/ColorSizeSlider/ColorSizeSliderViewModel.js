/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/tslib.es6","../../../core/Logger","../../../core/has","../../../core/RandomLCG","../../../core/Error","../../../core/accessorSupport/decorators/subclass","../SizeSlider/SizeSliderViewModel"],(function(e,r,o,s,t,c,i){"use strict";let l=class extends i{constructor(e){super(e)}getStopInfo(){const{min:e,max:r,stops:o}=this;return o?.length?o.map((o=>({color:o.color,offset:(r-o.value)/(r-e)}))):[]}};l=e.__decorate([c.subclass("esri.widgets.smartMapping.ColorSizeSlider.ColorSizeSliderViewModel")],l);return l}));
