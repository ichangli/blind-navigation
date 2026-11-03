/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../utils","./operations/queryRelatedRecords","../support/FeatureSet","../support/RelationshipQuery"],(function(e,t,r,o,n){"use strict";async function u(e,u,s){u=n.from(u);const a=t.parseUrl(e);return r.executeRelationshipQuery(a,u,s).then((e=>{const t=e.data,r={};return Object.keys(t).forEach((e=>r[e]=o.fromJSON(t[e]))),r}))}async function s(e,o,u){o=n.from(o);const s=t.parseUrl(e);return r.executeRelationshipQueryForCount(s,o,{...u}).then((e=>e.data))}e.executeRelationshipQuery=u,e.executeRelationshipQueryForCount=s,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
