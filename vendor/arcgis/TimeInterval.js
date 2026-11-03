/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["./chunks/tslib.es6","./core/Clonable","./core/JSONSupport","./core/timeUtils","./core/accessorSupport/decorators/property","./core/has","./core/Logger","./core/RandomLCG","./core/accessorSupport/decorators/enumeration","./core/accessorSupport/decorators/subclass","./portal/timeUnitKebabDictionary"],(function(e,o,r,t,s,i,c,n,a,l,u){"use strict";let p=class extends(o.ClonableMixin(r.JSONSupport)){constructor(e){super(e),this.unit="milliseconds",this.value=0}toMilliseconds(){return t.convertTime(this.value,this.unit,"milliseconds")}};e.__decorate([a.enumeration(u.timeUnitKebabDictionary,{nonNullable:!0})],p.prototype,"unit",void 0),e.__decorate([s.property({type:Number,json:{write:!0},nonNullable:!0})],p.prototype,"value",void 0),p=e.__decorate([l.subclass("esri.TimeInterval")],p);return p}));
