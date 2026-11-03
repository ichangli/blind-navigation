/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../../core/promiseUtils","../../../Container","./TestDisplayObject"],(function(e,s,t,r){"use strict";class o extends t.Container{constructor(e,s){super(),this.store=e,this.meshData=s}whenRender(){return null==this._resolver&&(this._resolver=s.createResolver(),this.requestRender()),this._resolver.promise}doRender(e){const s=this._stage?.bufferPool,t=r.TestDisplayObject.fromMeshData(this.meshData,s,this.store);for(const[r,o]of this.store.entries())t.setActiveMesh(r),o.techniqueRef.render(e,t);t.destroy(),this._resolver&&(this._resolver.resolve(),this._resolver=null)}}e.TechniqueDebugContainer=o,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
