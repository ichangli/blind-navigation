/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/Clonable","../../core/Logger","../../core/has","../../core/RandomLCG","../../core/Error","../../core/accessorSupport/decorators/subclass","../../geometry/projection"],(function(e,r,o,t,c,s,n,a){"use strict";let l=class extends r.Clonable{projectOrWarn(e,r){if(null==e)return e;const{geometry:t,pending:c}=a.projectOrLoad(e,r);return c?null:c||t?t:(o.getLogger(this).warn("geometry could not be projected to the spatial reference",{georeference:this,geometry:e,sourceSpatialReference:e.spatialReference,targetSpatialReference:r}),null)}};l=e.__decorate([n.subclass("esri.layers.support.GeoreferenceBase")],l);return l}));
