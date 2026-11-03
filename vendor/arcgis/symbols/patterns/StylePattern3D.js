/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass","./Pattern3D","./styles"],(function(e,t,r,s,o,c,p,y){"use strict";var a;let l=a=class extends p{constructor(e){super(e),this.type="style",this.style="solid"}clone(){return new a({style:this.style})}};e.__decorate([t.property({type:["style"]})],l.prototype,"type",void 0),e.__decorate([t.property({type:y,json:{read:!0,write:!0}})],l.prototype,"style",void 0),l=a=e.__decorate([c.subclass("esri.symbols.patterns.StylePattern3D")],l);return l}));
