/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass","./Element"],(function(t,e,r,o,s,i,p){"use strict";var c;let n=c=class extends p{constructor(t){super(t),this.text=null,this.textFormat="plain-text",this.type="text"}clone(){return new c({text:this.text,textFormat:this.textFormat,visibilityExpression:this.visibilityExpression})}};t.__decorate([e.property({type:String,json:{write:!0}})],n.prototype,"text",void 0),t.__decorate([e.property({type:String,json:{write:!0}})],n.prototype,"textFormat",void 0),t.__decorate([e.property({type:["text"],readOnly:!0,json:{read:!1,write:!0}})],n.prototype,"type",void 0),n=c=t.__decorate([i.subclass("esri.form.elements.TextElement")],n);return n}));
