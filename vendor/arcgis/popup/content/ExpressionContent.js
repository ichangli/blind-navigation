/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass","../ElementExpressionInfo","./Content"],(function(e,o,r,s,t,n,p,c){"use strict";var i;let a=i=class extends c{constructor(e){super(e),this.expressionInfo=null,this.type="expression"}clone(){return new i({expressionInfo:this.expressionInfo?.clone()})}};e.__decorate([o.property({type:p,json:{write:!0}})],a.prototype,"expressionInfo",void 0),e.__decorate([o.property({type:["expression"],readOnly:!0,json:{read:!1,write:!0}})],a.prototype,"type",void 0),a=i=e.__decorate([n.subclass("esri.popup.content.ExpressionContent")],a);return a}));
