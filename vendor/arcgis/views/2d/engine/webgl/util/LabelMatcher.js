/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./Matcher"],(function(e,a){"use strict";class t extends a.FeatureMatcher{static async fromLabelSchema(e,a){const s=a.classes.map((async a=>{const t=await e.createMeshWriters(a.meshes);return{minScale:a.minScale,maxScale:a.maxScale,meshes:t,expression:null,where:await e.storage.createWhereClause(a.where)}})),r=await Promise.all(s);return new t(r)}constructor(e){super(),this._labels=e}match(e,a){if(!this._labels.length)return null;const t=this._getLabels(a.$view.scale),s=[];for(const r of t)r.where&&!r.where(e)||s.push(...r.meshes);return s}_getLabels(e){return this._labels.filter((a=>this._validForTileScale(a,e)))}_validForTileScale(e,a){const t=a-a/4,s=a+a/2;return(!e.minScale||e.minScale>=t)&&(!e.maxScale||e.maxScale<=s)}}e.LabelMatcher=t,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
