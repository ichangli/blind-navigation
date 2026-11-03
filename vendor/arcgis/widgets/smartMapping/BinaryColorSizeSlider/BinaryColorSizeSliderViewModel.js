/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/tslib.es6","../../../core/accessorSupport/decorators/property","../../../core/has","../../../core/Logger","../../../core/RandomLCG","../../../core/accessorSupport/decorators/subclass","../SizeSlider/SizeSliderViewModel"],(function(e,r,o,s,t,i,a){"use strict";let c=class extends a{constructor(e){super(e),this.primaryHandleEnabled=!0}getGradientStopInfo(e,r){if(!this.stops?.length)return[];const{min:o,max:s,stops:t}=this,i=[r,r,r,e,e],a=[],c=s-o;return t.forEach(((e,r)=>{const o=i[r],n=(s-e.value)/c,l=0===r?n:(s-t[r-1].value)/c;a.push({offset:l,color:o},{offset:n,color:o})})),a}};e.__decorate([r.property({readOnly:!0})],c.prototype,"primaryHandleEnabled",void 0),c=e.__decorate([i.subclass("esri.widgets.smartMapping.BinaryColorSizeSlider.BinaryColorSizeSliderViewModel")],c);return c}));
