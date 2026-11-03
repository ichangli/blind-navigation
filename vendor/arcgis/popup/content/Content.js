/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass"],(function(e,t,r,o,s,c,p){"use strict";let n=class extends t.JSONSupport{constructor(e){super(e),this.type=null}};e.__decorate([r.property({type:["attachments","custom","fields","media","text","expression","relationship"],readOnly:!0,json:{read:!1,write:!0}})],n.prototype,"type",void 0),n=e.__decorate([p.subclass("esri.popup.content.Content")],n);return n}));
