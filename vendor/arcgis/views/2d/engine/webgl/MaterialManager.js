/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["./shaders/MaterialPrograms"],(function(r){"use strict";class e{constructor(r){this._rctx=r,this._programByKey=new Map}dispose(){this._programByKey.forEach((r=>r.dispose())),this._programByKey.clear()}getProgram(e,t=[]){const a=e.vsPath+"."+e.fsPath+JSON.stringify(t);if(this._programByKey.has(a))return this._programByKey.get(a);const s={...t.map((r=>"string"==typeof r?{name:r,value:!0}:r)).reduce(((r,e)=>({...r,[e.name]:e.value})),{})},{vsPath:o,fsPath:i,attributes:h}=e,g=r.createProgramTemplate(o,i,h,s),n=this._rctx.programCache.acquire(g.shaders.vertexShader,g.shaders.fragmentShader,g.attributes);if(!n)throw new Error("Unable to get program for key: ${key}");return this._programByKey.set(a,n),n}}return e}));
