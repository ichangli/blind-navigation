/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../chunks/tslib.es6","../core/JSONSupport","../core/accessorSupport/decorators/property","../core/has","../core/Logger","../core/RandomLCG","../core/accessorSupport/decorators/subclass"],(function(e,t,r,o,s,p,c){"use strict";var n;let a=n=class extends t.JSONSupport{constructor(e){super(e)}clone(){return new n({name:this.name,path:this.path,title:this.title})}};e.__decorate([r.property({type:String,json:{write:!0}})],a.prototype,"name",void 0),e.__decorate([r.property({type:String,json:{write:!0}})],a.prototype,"path",void 0),e.__decorate([r.property({type:String,json:{write:!0}})],a.prototype,"title",void 0),a=n=e.__decorate([c.subclass("esri.webscene.TransportationNetwork")],a);return a}));
