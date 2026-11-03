/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../chunks/tslib.es6","../../../core/Logger","../../../core/has","../../../core/RandomLCG","../../../core/Error","../../../core/accessorSupport/decorators/subclass","../engine/BitmapTileContainer"],(function(e,i,t,r,a,s,o,l){"use strict";const n=e=>{let t=class extends e{attach(){this.view.timeline.record(`${this.layer.title} (BitmapTileLayer) Attach`),this._bitmapView=new l.BitmapTileContainer(this._tileInfoView),this.container.addChild(this._bitmapView)}detach(){this.container.removeChild(this._bitmapView),this._bitmapView?.removeAllChildren(),this._bitmapView=null}};return t=i.__decorate([o.subclass("esri.views.2d.layers.BitmapTileLayerView2D")],t),t};e.BitmapTileLayerView2D=n,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
