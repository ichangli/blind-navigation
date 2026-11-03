/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../chunks/tslib.es6","../core/JSONSupport","../core/accessorSupport/decorators/property","../core/has","../core/Logger","../core/RandomLCG","../core/accessorSupport/decorators/subclass","../core/accessorSupport/decorators/writer"],(function(e,r,o,t,s,c,a,p){"use strict";let l=class extends r.JSONSupport{constructor(e){super(e),this.enabled=!0,this.type=null,this.ignoreDrivers=!1}writeEnabled(e,r,o){e||(r[o]=e)}};e.__decorate([o.property({type:Boolean,json:{read:{source:"enable"},write:{target:"enable"}}})],l.prototype,"enabled",void 0),e.__decorate([p.writer("enabled")],l.prototype,"writeEnabled",null),e.__decorate([o.property({type:["icon","object","line","path","fill","water","extrude","text"],readOnly:!0})],l.prototype,"type",void 0),l=e.__decorate([a.subclass("esri.symbols.Symbol3DLayer")],l);return l}));
