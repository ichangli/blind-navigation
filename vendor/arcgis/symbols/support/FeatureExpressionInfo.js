/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass","../../layers/support/fieldUtils"],(function(e,r,s,t,o,i,p,c){"use strict";var n;let l=n=class extends r.JSONSupport{constructor(e){super(e)}async collectRequiredFields(e,r){return c.collectArcadeFieldNames(e,r,this.expression)}clone(){return new n({expression:this.expression,title:this.title})}equals(e){return this.expression===e.expression&&this.title===e.title}};e.__decorate([s.property({type:String,json:{write:!0}})],l.prototype,"expression",void 0),e.__decorate([s.property({type:String,json:{write:!0}})],l.prototype,"title",void 0),l=n=e.__decorate([p.subclass("esri.symbols.support.FeatureExpressionInfo")],l);return l}));
