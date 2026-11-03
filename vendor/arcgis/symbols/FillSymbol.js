/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../chunks/tslib.es6","../core/accessorSupport/decorators/property","../core/has","../core/Logger","../core/RandomLCG","../core/accessorSupport/decorators/subclass","./SimpleLineSymbol","./Symbol"],(function(e,t,o,s,r,l,p,i){"use strict";let c=class extends i{constructor(e){super(e),this.outline=null,this.type=null}hash(){return`${this.type}.${this.outline?.hash()}`}};e.__decorate([t.property({types:{key:"type",base:null,defaultKeyValue:"simple-line",typeMap:{"simple-line":p}},json:{default:null,write:!0}})],c.prototype,"outline",void 0),e.__decorate([t.property({type:["simple-fill","picture-fill"],readOnly:!0})],c.prototype,"type",void 0),c=e.__decorate([l.subclass("esri.symbols.FillSymbol")],c);return c}));
