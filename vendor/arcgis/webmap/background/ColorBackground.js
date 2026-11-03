/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../Color","../../core/JSONSupport","../../core/lang","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/accessorSupport/decorators/subclass"],(function(o,r,e,c,s,t,p,n){"use strict";var a;let u=a=class extends e.JSONSupport{constructor(o){super(o),this.color=new r([0,0,0,1])}clone(){return new a(c.clone({color:this.color}))}};o.__decorate([s.property({type:r,json:{write:!0}})],u.prototype,"color",void 0),u=a=o.__decorate([n.subclass("esri.webmap.background.ColorBackground")],u);return u}));
