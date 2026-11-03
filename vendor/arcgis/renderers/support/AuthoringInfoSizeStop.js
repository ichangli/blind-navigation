/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass"],(function(e,r,o,t,s,p,c){"use strict";var i;let l=i=class extends r.JSONSupport{constructor(e){super(e),this.label=null,this.size=null,this.value=null}clone(){return new i({label:this.label,value:this.value,size:this.size})}};e.__decorate([o.property({type:String,json:{write:!0}})],l.prototype,"label",void 0),e.__decorate([o.property({type:Number,json:{write:!0}})],l.prototype,"size",void 0),e.__decorate([o.property({type:Number,json:{write:!0}})],l.prototype,"value",void 0),l=i=e.__decorate([c.subclass("esri.renderers.support.AuthoringInfoSizeStop")],l);return l}));
