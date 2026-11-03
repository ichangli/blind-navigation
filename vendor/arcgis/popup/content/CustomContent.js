/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/lang","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/accessorSupport/decorators/subclass","./Content"],(function(e,t,r,o,s,c,p){"use strict";var u;let d=u=class extends p{constructor(e){super(e),this.creator=null,this.destroyer=null,this.outFields=null,this.type="custom"}clone(){return new u({creator:this.creator,destroyer:this.destroyer,outFields:Array.isArray(this.outFields)?t.clone(this.outFields):null})}};e.__decorate([r.property()],d.prototype,"creator",void 0),e.__decorate([r.property()],d.prototype,"destroyer",void 0),e.__decorate([r.property()],d.prototype,"outFields",void 0),e.__decorate([r.property({type:["custom"],readOnly:!0})],d.prototype,"type",void 0),d=u=e.__decorate([c.subclass("esri.popup.content.CustomContent")],d);return d}));
