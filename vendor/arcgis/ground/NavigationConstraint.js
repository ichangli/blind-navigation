/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../chunks/tslib.es6","../core/JSONSupport","../core/Logger","../core/has","../core/RandomLCG","../core/Error","../core/accessorSupport/decorators/enumeration","../core/accessorSupport/decorators/subclass"],(function(o,e,t,r,n,a,s,i,c){"use strict";var p;o.NavigationConstraint=p=class extends t.JSONSupport{constructor(o){super(o),this.type="none"}clone(){return new p({type:this.type})}},e.__decorate([i.enumeration({none:"none",stayAbove:"stay-above"})],o.NavigationConstraint.prototype,"type",void 0),o.NavigationConstraint=p=e.__decorate([c.subclass("esri.ground.NavigationConstraint")],o.NavigationConstraint),Object.defineProperty(o,Symbol.toStringTag,{value:"Module"})}));
