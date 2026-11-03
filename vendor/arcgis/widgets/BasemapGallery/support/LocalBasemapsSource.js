/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/tslib.es6","../../../Basemap","../../../core/Accessor","../../../core/Collection","../../../core/accessorSupport/decorators/property","../../../core/has","../../../core/Logger","../../../core/RandomLCG","../../../core/accessorSupport/decorators/subclass"],(function(e,r,s,o,t,a,c,p,d){"use strict";const n=o.ofType(r);let u=class extends s{constructor(e){super(e),this.basemaps=new n}destroy(){this.basemaps.forEach((e=>e.destroy()))}get state(){return"ready"}refresh(){}};e.__decorate([t.property({type:n})],u.prototype,"basemaps",void 0),e.__decorate([t.property({readOnly:!0})],u.prototype,"state",null),u=e.__decorate([d.subclass("esri.widgets.BasemapGallery.support.LocalBasemapsSource")],u);return u}));
