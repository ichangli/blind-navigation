/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(e){"use strict";class t{constructor(e){this._readFile=e}resolveIncludes(e){return this._resolve(e)}_resolve(e,t=new Map){if(t.has(e))return t.get(e);const r=this._read(e);if(!r)throw new Error(`cannot find shader file ${e}`);const s=/^[^\S\n]*#include\s+<(\S+)>[^\S\n]?/gm;let n=s.exec(r);const l=[];for(;null!=n;)l.push({path:n[1],start:n.index,length:n[0].length}),n=s.exec(r);let i=0,o="";return l.forEach((e=>{o+=r.slice(i,e.start),o+=t.has(e.path)?"":this._resolve(e.path,t),i=e.start+e.length})),o+=r.slice(i),t.set(e,o),o}_read(e){return this._readFile(e)}}e.ShaderCompiler=t,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
