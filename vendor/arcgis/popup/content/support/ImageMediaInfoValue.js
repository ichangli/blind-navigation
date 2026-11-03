/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/tslib.es6","../../../core/JSONSupport","../../../core/accessorSupport/decorators/property","../../../core/has","../../../core/Logger","../../../core/RandomLCG","../../../core/accessorSupport/decorators/subclass"],(function(e,r,o,t,s,c,p){"use strict";var n;let u=n=class extends r.JSONSupport{constructor(e){super(e),this.linkURL=null,this.sourceURL=null}clone(){return new n({linkURL:this.linkURL,sourceURL:this.sourceURL})}};e.__decorate([o.property({type:String,json:{write:!0}})],u.prototype,"linkURL",void 0),e.__decorate([o.property({type:String,json:{write:!0}})],u.prototype,"sourceURL",void 0),u=n=e.__decorate([p.subclass("esri.popup.content.support.ImageMediaInfoValue")],u);return u}));
