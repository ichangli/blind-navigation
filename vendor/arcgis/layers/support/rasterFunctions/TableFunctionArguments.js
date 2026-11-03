/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/tslib.es6","../../../core/lang","../../../core/accessorSupport/decorators/property","../../../core/has","../../../core/Logger","../../../core/accessorSupport/decorators/subclass","./BaseFunctionArguments"],(function(e,r,t,s,o,c,a){"use strict";var n;let u=n=class extends a{constructor(){super(...arguments),this.attributeTableAsRecordSet=null}clone(){return new n({attributeTableAsRecordSet:r.clone(this.attributeTableAsRecordSet)})}};e.__decorate([t.property({json:{write:!0}})],u.prototype,"attributeTableAsRecordSet",void 0),u=n=e.__decorate([c.subclass("esri.layers.support.rasterFunctions.TableFunctionArguments")],u);return u}));
