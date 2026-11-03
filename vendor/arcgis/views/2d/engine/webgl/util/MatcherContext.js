/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(t){"use strict";class e{constructor(t,e,r,s){this.storage=t,this.proxy=e,this.viewParams=r,this.registry=s}async createMeshWriters(t){const e=t.map((t=>this.registry.createMeshWriter(this.storage,this.proxy,this.viewParams,t)));return Promise.all(e)}}t.MatcherContext=e,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
