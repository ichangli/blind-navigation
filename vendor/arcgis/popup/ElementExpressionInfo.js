/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../chunks/tslib.es6","../core/JSONSupport","../core/accessorSupport/decorators/property","../core/has","../core/Logger","../core/RandomLCG","../core/accessorSupport/decorators/subclass"],(function(e,r,t,o,s,p,i){"use strict";var n;let c=n=class extends r.JSONSupport{constructor(e){super(e),this.title=null,this.expression=null,this.returnType="dictionary"}clone(){return new n({title:this.title,expression:this.expression})}};e.__decorate([t.property({type:String,json:{write:!0}})],c.prototype,"title",void 0),e.__decorate([t.property({type:String,json:{write:!0}})],c.prototype,"expression",void 0),e.__decorate([t.property({type:["dictionary"],readOnly:!0,json:{read:!1,write:!0}})],c.prototype,"returnType",void 0),c=n=e.__decorate([i.subclass("esri.popup.ElementExpressionInfo")],c);return c}));
