/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass","./ActionBase"],(function(e,t,s,i,o,r,c){"use strict";var a;let l=a=class extends c{constructor(e){super(e),this.image=null,this.type="toggle",this.value=!1}clone(){return new a({active:this.active,className:this.className,disabled:this.disabled,icon:this.icon,id:this.id,indicator:this.indicator,title:this.title,visible:this.visible,image:this.image,value:this.value})}};e.__decorate([t.property()],l.prototype,"image",void 0),e.__decorate([t.property()],l.prototype,"value",void 0),l=a=e.__decorate([r.subclass("esri.support.actions.ActionToggle")],l);return l}));
