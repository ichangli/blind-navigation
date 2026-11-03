/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/tslib.es6","../../../core/jsonMap","../../../core/JSONSupport","../../../core/accessorSupport/decorators/property","../../../core/has","../../../core/Logger","../../../core/RandomLCG","../../../core/accessorSupport/decorators/subclass"],(function(e,o,r,t,s,p,c,a){"use strict";const i=new o.JSONMap({pointCloudFixedSizeAlgorithm:"fixed-size",pointCloudSplatAlgorithm:"splat"});let n=class extends r.JSONSupport{};e.__decorate([t.property({type:i.apiValues,readOnly:!0,nonNullable:!0,json:{type:i.jsonValues,read:!1,write:i.write}})],n.prototype,"type",void 0),n=e.__decorate([a.subclass("esri.renderers.support.pointCloud.PointSizeAlgorithm")],n);return n}));
