/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["./lang","./Logger","./Message"],(function(e,t,r){"use strict";class s extends r{constructor(e,t,r){super(e,t,r)}toJSON(){if(null!=this.details)try{return{name:this.name,message:this.message,details:JSON.parse(JSON.stringify(this.details,((t,r)=>{if(r&&"object"==typeof r&&"function"==typeof r.toJSON)return r;try{return e.clone(r)}catch(s){return"[object]"}})))}}catch(r){throw t.getLogger("esri.core.Error").error(r),r}return{name:this.name,message:this.message,details:this.details}}static fromJSON(e){return new s(e.name,e.message,e.details)}}return s.prototype.type="error",s}));
