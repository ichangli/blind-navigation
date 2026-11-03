/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../chunks/tslib.es6","../../core/Accessor","../../core/accessorSupport/decorators/property","../../core/has","../../core/Logger","../../core/RandomLCG","../../core/accessorSupport/decorators/subclass"],(function(o,e,t,r,s,c,n){"use strict";let a=class extends e{constructor(o){super(o),this.directionalButtons=!0,this.rotationSlider=!1,this.rotationResetButton=!1}};o.__decorate([t.property({type:Boolean,nonNullable:!0})],a.prototype,"directionalButtons",void 0),o.__decorate([t.property({type:Boolean,nonNullable:!0})],a.prototype,"rotationSlider",void 0),o.__decorate([t.property({type:Boolean,nonNullable:!0})],a.prototype,"rotationResetButton",void 0),a=o.__decorate([n.subclass("esri.widgets.DirectionalPad.VisibleElements")],a);return a}));
