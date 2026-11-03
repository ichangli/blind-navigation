/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../chunks/tslib.es6","../../core/maybe","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass"],(function(o,e,r,t,s,c,i,p){"use strict";const a=o=>{let s=class extends o{constructor(...o){super(...o),this.goToOverride=null,this.view=null}callGoTo(o){const{view:e}=this;return r.assertIsSome(e),this.goToOverride?this.goToOverride(e,o):e.goTo(o.target,o.options)}};return e.__decorate([t.property()],s.prototype,"goToOverride",void 0),e.__decorate([t.property()],s.prototype,"view",void 0),s=e.__decorate([p.subclass("esri.widgets.support.GoTo")],s),s};o.GoToMixin=a,Object.defineProperty(o,Symbol.toStringTag,{value:"Module"})}));
