/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["require","exports","../../assets"],(function(e,s,t){"use strict";function i(){return r??=(async()=>{const s=await new Promise(((s,t)=>e(["../../chunks/basis_transcoder"],s,t))),i=await s.default({locateFile:e=>t.getAssetUrl(`esri/libs/basisu/${e}`)});return i.initializeBasis(),i})(),r}let r;s.getBasisTranscoder=i,Object.defineProperty(s,Symbol.toStringTag,{value:"Module"})}));
