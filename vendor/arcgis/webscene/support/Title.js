/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass"],(function(e,r,t,o,s,c,p){"use strict";var u;let n=u=class extends r.JSONSupport{constructor(){super(...arguments),this.text=""}clone(){return new u({text:this.text})}};e.__decorate([t.property({type:String,json:{write:{isRequired:!0}}})],n.prototype,"text",void 0),n=u=e.__decorate([p.subclass("esri.webscene.support.Title")],n);return n}));
