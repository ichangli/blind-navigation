/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./mesh/instanceIdUtils"],(function(t,e){"use strict";class n{constructor(t,e,n){this._instanceId=t,this.techniqueRef=e,this._input=n}get instanceId(){return e.castStrictInstanceId(this._instanceId)}createMeshInfo(t){return{id:e.castStrictInstanceId(this._instanceId),techniqueType:this.techniqueRef.type,inputParams:t,optionalAttributes:this._input.optionalAttributes}}getInput(){return this._input}setInput(t){this._input=t}}t.FeatureTechniqueInstance=n,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
