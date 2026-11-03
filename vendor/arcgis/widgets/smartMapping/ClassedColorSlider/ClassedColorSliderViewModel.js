/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/tslib.es6","../../../core/accessorSupport/decorators/property","../../../core/has","../../../core/Logger","../../../core/RandomLCG","../../../core/accessorSupport/decorators/subclass","../SmartMappingSliderViewModel"],(function(o,e,r,s,t,c,a){"use strict";let n=class extends a{constructor(o){super(o),this.zoomingEnabled=!1}getStopInfo(){const{breaks:o,max:e,min:r}=this,s=e-r;if(!o?.length||!s)return[];const t=[];return o.forEach((o=>{const{color:c,max:a,min:n}=o;let l,i;e===r?l=i=0:(l=(e-n)/s,i=(e-a)/s),t.push({offset:l,color:c},{offset:i,color:c})})),t}};o.__decorate([e.property({readOnly:!0})],n.prototype,"zoomingEnabled",void 0),n=o.__decorate([c.subclass("esri.widgets.smartMapping.ClassedColorSlider.ClassedColorSliderViewModel")],n);return n}));
