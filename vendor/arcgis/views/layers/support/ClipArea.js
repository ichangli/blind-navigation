/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/tslib.es6","../../../core/JSONSupport","../../../core/accessorSupport/decorators/property","../../../core/has","../../../core/Logger","../../../core/RandomLCG","../../../core/accessorSupport/decorators/subclass"],(function(e,r,o,s,t,c,p){"use strict";let i=class extends r.JSONSupport{get version(){return this.commitVersionProperties(),(this._get("version")||0)+1}};e.__decorate([o.property({readOnly:!0})],i.prototype,"version",null),i=e.__decorate([p.subclass("esri.views.layers.support.ClipArea")],i);return i}));
