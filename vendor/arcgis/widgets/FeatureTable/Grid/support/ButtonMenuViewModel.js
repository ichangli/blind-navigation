/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../../chunks/tslib.es6","../../../../core/Accessor","../../../../core/accessorSupport/decorators/property","../../../../core/accessorSupport/decorators/cast","../../../../core/RandomLCG","../../../../core/has","../../../../core/accessorSupport/decorators/subclass","./ButtonMenuItem"],(function(e,t,o,r,s,c,p,a){"use strict";let n=class extends t{constructor(e){super(e),this.items=null,this.open=!1}castItems(e){return e?e.map((e=>e instanceof a?e:new a(e))):null}};e.__decorate([o.property()],n.prototype,"items",void 0),e.__decorate([r.cast("items")],n.prototype,"castItems",null),e.__decorate([o.property()],n.prototype,"open",void 0),n=e.__decorate([p.subclass("esri.widgets.FeatureTable.Grid.support.ButtonMenuViewModel")],n);return n}));
