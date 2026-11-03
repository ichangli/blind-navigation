/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/Error","../../core/Evented","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass"],(function(e,r,o,t,s,c,n,i){"use strict";let a=class extends o.EventedAccessor{destroy(){this.emit("destroy")}get connectionError(){return this.errorString?new r("stream-connection",this.errorString):null}onFeature(e){this.emit("data-received",e)}onMessage(e){this.emit("message-received",e)}};e.__decorate([t.property({readOnly:!0})],a.prototype,"connectionError",null),a=e.__decorate([i.subclass("esri.layers.support.StreamConnection")],a);return a}));
