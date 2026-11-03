/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/Clonable","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass","./ExpressionInfo"],(function(e,o,r,t,s,c,n,i,p){"use strict";let u=class extends(o.ClonableMixin(r.JSONSupport)){constructor(e){super(e),this.expressionInfo=null,this.requestedActions=null}};e.__decorate([t.property({type:p,json:{write:!0}})],u.prototype,"expressionInfo",void 0),e.__decorate([t.property({type:[String],json:{write:!0}})],u.prototype,"requestedActions",void 0),u=e.__decorate([i.subclass("esri.webdoc.geotriggersInfo.GeotriggerNotificationOptions")],u);return u}));
