/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/JSONSupport","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass"],(function(e,t,o,r,s,c,p){"use strict";let i=class extends t.JSONSupport{constructor(e){super(e),this.isCollection=null,this.magicKey=null,this.text=null}};e.__decorate([o.property({type:Boolean,json:{write:!0}})],i.prototype,"isCollection",void 0),e.__decorate([o.property({type:String,json:{write:!0}})],i.prototype,"magicKey",void 0),e.__decorate([o.property({type:String,json:{write:!0}})],i.prototype,"text",void 0),i=e.__decorate([p.subclass("esri.rest.support.SuggestionCandidate")],i);return i}));
