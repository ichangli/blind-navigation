/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/jsonMap","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass","./GPMessage"],(function(e,r,s,o,t,c,p,a){"use strict";const n=new r.JSONMap({0:"informative",1:"process-definition",2:"process-start",3:"process-stop",50:"warning",100:"error",101:"empty",200:"abort"});let i=class extends a{constructor(e){super(e),this.type=null}};e.__decorate([s.property({type:String,json:{read:n.read,write:n.write}})],i.prototype,"type",void 0),i=e.__decorate([p.subclass("esri.rest.support.NAMessage")],i);return i}));
