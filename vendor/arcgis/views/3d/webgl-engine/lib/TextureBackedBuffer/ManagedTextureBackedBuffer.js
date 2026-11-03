/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./SimpleIndexManager","./TextureBackedBuffer"],(function(e,t,r){"use strict";const n=65536;class a{constructor(e,a=1){this.textureBuffer=new r.TextureBackedBuffer(e,a),this._indexManager=new t.SimpleIndexManager(n)}dispose(){this.textureBuffer.dispose(),this.textureBuffer=void 0}get availableCount(){return this._indexManager.availableCount}get activeCount(){return this._indexManager.activeCount}acquireIndex(){const e=this._indexManager.acquire();return this.textureBuffer.resizeToFit(e),e}releaseIndex(e){this._indexManager.release(e)}}e.ManagedTextureBackedBuffer=a,e.maxIndexCount=n,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
