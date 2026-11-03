/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/tslib.es6","../../../core/JSONSupport","../../../core/accessorSupport/decorators/property","../../../core/has","../../../core/Logger","../../../core/RandomLCG","../../../core/accessorSupport/decorators/subclass"],(function(e,t,r,o,s,p,c){"use strict";let n=class extends t.JSONSupport{constructor(e){super(e),this.functionType=null,this.networkAttributeName=null,this.result=null}};e.__decorate([r.property({type:["add","subtract","average","count","min","max"],json:{write:!0},readOnly:!0})],n.prototype,"functionType",void 0),e.__decorate([r.property({type:String,json:{write:!0},readOnly:!0})],n.prototype,"networkAttributeName",void 0),e.__decorate([r.property({type:Number,json:{write:!0},readOnly:!0})],n.prototype,"result",void 0),n=e.__decorate([c.subclass("esri.rest.networks.support.FunctionResult")],n);return n}));
