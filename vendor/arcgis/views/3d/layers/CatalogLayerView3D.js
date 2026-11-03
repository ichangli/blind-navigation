/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/tslib.es6","../../../core/Collection","../../../core/accessorSupport/decorators/property","../../../core/has","../../../core/Logger","../../../core/RandomLCG","../../../core/accessorSupport/decorators/subclass","./LayerView3D","../../layers/CatalogLayerView","../../layers/LayerView"],(function(e,r,s,o,a,t,c,i,l,y){"use strict";let p=class extends(l(i.LayerView3D(y))){constructor(){super(...arguments),this.type="catalog-3d",this.layerViews=new r}};e.__decorate([s.property()],p.prototype,"layerViews",void 0),p=e.__decorate([c.subclass("esri.views.3d.layers.CatalogLayerView3D")],p);return p}));
