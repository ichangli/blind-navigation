/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../chunks/tslib.es6","../core/JSONSupport","../core/accessorSupport/decorators/property","../core/has","../core/Logger","../core/RandomLCG","../core/accessorSupport/decorators/subclass"],(function(e,r,t,o,s,c,a){"use strict";var n;let d=n=class extends r.JSONSupport{constructor(e){super(e),this.type="virtual",this.directShadowsEnabled=!1}clone(){return new n(this.cloneConstructProperties())}cloneConstructProperties(){return{directShadowsEnabled:this.directShadowsEnabled}}};e.__decorate([t.property({readOnly:!0,type:["virtual"],json:{write:!0}})],d.prototype,"type",void 0),e.__decorate([t.property({type:Boolean,json:{default:!1,name:"directShadows",write:!0}})],d.prototype,"directShadowsEnabled",void 0),d=n=e.__decorate([a.subclass("esri.webscene.VirtualLighting")],d);return d}));
