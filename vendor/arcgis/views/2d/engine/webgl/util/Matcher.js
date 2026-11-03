/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(t){"use strict";class e{constructor(){this._defaultResult=null,this._backgroundFillResult=null}static async from(t,r){const s=new e;return s.setDefault(await t.createMeshWriters(r.meshes)),s}size(){return 1}getDefault(){return this._defaultResult}setDefault(t){this._defaultResult=t}getBackgroundFill(){return this._backgroundFillResult}setBackgroundFill(t){this._backgroundFillResult=t}match(t,e){const r=this.doMatch(t,e)||this.getDefault();if(r&&r.length>0){const t=this.getBackgroundFill();if(t)return[...t,...r]}return r}getSortKey(t,e){return 0}doMatch(t,e){return null}async fetchResources(t,e){}}t.FeatureMatcher=e,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
