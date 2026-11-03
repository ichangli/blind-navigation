/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass","./Content"],(function(t,e,r,o,s,c,n){"use strict";var p;let a=p=class extends n{constructor(t){super(t),this.text=null,this.type="text"}clone(){return new p({text:this.text})}};t.__decorate([e.property({type:String,json:{write:!0}})],a.prototype,"text",void 0),t.__decorate([e.property({type:["text"],readOnly:!0,json:{read:!1,write:!0}})],a.prototype,"type",void 0),a=p=t.__decorate([c.subclass("esri.popup.content.TextContent")],a);return a}));
