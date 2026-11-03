/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass","./ActionBase"],(function(t,e,s,i,o,r,c){"use strict";var a;let n=a=class extends c{constructor(t){super(t),this.image=null,this.type="button"}clone(){return new a({active:this.active,className:this.className,disabled:this.disabled,icon:this.icon,id:this.id,indicator:this.indicator,title:this.title,visible:this.visible,image:this.image})}};t.__decorate([e.property()],n.prototype,"image",void 0),n=a=t.__decorate([r.subclass("esri.support.actions.ActionButton")],n);return n}));
