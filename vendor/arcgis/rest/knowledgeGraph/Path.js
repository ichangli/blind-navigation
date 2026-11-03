/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass","./GraphObject"],(function(r,e,o,t,s,c,p,a){"use strict";let u=class extends e.JSONSupport{constructor(r){super(r),this.path=null}};r.__decorate([o.property({type:[a],json:{write:!0}})],u.prototype,"path",void 0),u=r.__decorate([p.subclass("esri.rest.knowledgeGraph.Path")],u);return u}));
