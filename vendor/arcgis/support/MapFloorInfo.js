/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../chunks/tslib.es6","../core/JSONSupport","../core/accessorSupport/decorators/property","../core/has","../core/Logger","../core/RandomLCG","../core/accessorSupport/decorators/subclass","../layers/support/FacilityLayerInfo","../layers/support/LevelLayerInfo","../layers/support/SiteLayerInfo"],(function(e,r,o,t,s,p,a,c,y,i){"use strict";let l=class extends r.JSONSupport{constructor(e){super(e),this.levelLayer=null,this.facilityLayer=null,this.siteLayer=null}};e.__decorate([o.property({type:y,json:{write:!0}})],l.prototype,"levelLayer",void 0),e.__decorate([o.property({type:c,json:{write:!0}})],l.prototype,"facilityLayer",void 0),e.__decorate([o.property({type:i,json:{write:!0}})],l.prototype,"siteLayer",void 0),l=e.__decorate([a.subclass("esri.support.MapFloorInfo")],l);return l}));
