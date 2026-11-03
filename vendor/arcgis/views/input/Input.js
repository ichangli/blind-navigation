/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/Accessor","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass","./gamepad/GamepadSettings"],(function(e,r,s,o,c,t,a,p){"use strict";let d=class extends r{constructor(){super(...arguments),this.gamepad=new p}};e.__decorate([s.property({readOnly:!0})],d.prototype,"gamepad",void 0),d=e.__decorate([a.subclass("esri.views.input.Input")],d);return d}));
