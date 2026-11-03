/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../Color","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/enumeration","../../core/accessorSupport/decorators/subclass","../../symbols/support/materialUtils","./Background"],(function(o,r,e,c,t,s,n,a,l,p){"use strict";var u;const i={...l.colorAndTransparencyProperty,nonNullable:!0};let d=u=class extends p{constructor(o){super(o),this.type="color",this.color=new r([0,0,0,1])}clone(){return new u(this.cloneProperties())}cloneProperties(){return{color:this.color.clone()}}};o.__decorate([n.enumeration({color:"color"},{readOnly:!0})],d.prototype,"type",void 0),o.__decorate([e.property(i)],d.prototype,"color",void 0),d=u=o.__decorate([a.subclass("esri.webscene.background.ColorBackground")],d);return d}));
