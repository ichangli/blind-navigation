/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/Clonable","../../core/jsonMap","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass","./ExpressionInfo"],(function(e,o,r,t,s,c,p,i,n,a){"use strict";const d=new r.JSONMap({deviceLocation:"device-location"});let l=class extends(o.ClonableMixin(t.JSONSupport)){constructor(e){super(e),this.filterExpression=null,this.type="device-location"}};e.__decorate([s.property({type:a,json:{write:!0}})],l.prototype,"filterExpression",void 0),e.__decorate([s.property({type:d.apiValues,readOnly:!0,json:{type:d.jsonValues,read:d.read,write:d.write}})],l.prototype,"type",void 0),l=e.__decorate([n.subclass("esri.webdoc.geotriggersInfo.DeviceLocationFeed")],l);return l}));
