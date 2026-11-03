/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/tslib.es6","../../../core/Accessor","../../../core/Collection","../../../core/accessorSupport/decorators/property","../../../core/has","../../../core/Logger","../../../core/RandomLCG","../../../core/accessorSupport/decorators/subclass","./GamepadInputDevice"],(function(e,o,r,c,s,t,p,d,a){"use strict";let n=class extends o{constructor(...e){super(...e),this.devices=new r,this.enabledFocusMode="document"}};e.__decorate([c.property({type:r.ofType(a),readOnly:!0})],n.prototype,"devices",void 0),e.__decorate([c.property({type:["document","view","none"]})],n.prototype,"enabledFocusMode",void 0),n=e.__decorate([d.subclass("esri.views.input.gamepad.GamepadSettings")],n);return n}));
