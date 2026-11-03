/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../chunks/tslib.es6","../../../core/Accessor","../../../core/accessorSupport/decorators/property","../../../core/has","../../../core/Logger","../../../core/RandomLCG","../../../core/accessorSupport/decorators/subclass"],(function(e,o,r,t,s,c,i,n){"use strict";var a;e.SceneViewAtmosphere=a=class extends r{set quality(e){["low","high"].includes(e)&&this._set("quality",e)}clone(){return new a({quality:this.quality})}},o.__decorate([t.property({type:["low","high"],value:"low"})],e.SceneViewAtmosphere.prototype,"quality",null),e.SceneViewAtmosphere=a=o.__decorate([n.subclass("esri.views.3d.environment.SceneViewAtmosphere")],e.SceneViewAtmosphere),Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
