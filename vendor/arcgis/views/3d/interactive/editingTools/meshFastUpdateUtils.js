/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../core/handleUtils","../../../../core/reactiveUtils","../../../../layers/graphics/sources/interfaces"],(function(e,a,n,s){"use strict";function t(e){const t=e.graphic;return t?[n.watch((()=>"visible"in e?e.visible:e.displaying),(e=>{e&&t.notifyMeshTransformChanged({action:s.MeshTransformUpdateAction.EnableFastUpdates})}),{...n.syncAndInitial}),a.makeHandle((()=>t.notifyMeshTransformChanged({action:s.MeshTransformUpdateAction.DisableFastUpdates})))]:[]}e.meshTransformFastUpdateHandles=t,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
