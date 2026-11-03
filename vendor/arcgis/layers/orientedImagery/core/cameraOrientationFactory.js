/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/tslib.es6","../../../core/Logger","../../../core/has","../../../core/RandomLCG","../../../core/Error","../../../core/accessorSupport/decorators/subclass","./utils"],(function(e,r,t,s,a,c,o){"use strict";let i=class{static getCameraOrientation(e){return o.createCameraOrientation(e)}static register(e,r,t){o.cameraOrientationRegistry.set(e,{desc:r,constructor:t})}};i=e.__decorate([c.subclass("esri.layers.orientedImagery.core.cameraOrientationFactory")],i);return i}));
