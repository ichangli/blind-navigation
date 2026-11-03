/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../Color","../../core/JSONSupport","../../core/lang","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/accessorSupport/decorators/subclass","../support/materialUtils"],(function(r,o,e,s,c,t,l,p,a){"use strict";var n;let u=n=class extends e.JSONSupport{constructor(r){super(r),this.color=new o("white")}clone(){return new n({color:s.clone(this.color)})}};r.__decorate([c.property(a.colorAndTransparencyProperty)],u.prototype,"color",void 0),u=n=r.__decorate([p.subclass("esri.symbols.callouts.LineCallout3DBorder")],u);return u}));
