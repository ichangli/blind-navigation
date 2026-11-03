/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../layers/support/labelFormatUtils","../../../../../layers/support/labelUtils","../../../arcade/callExpressionWithCursor","./AComputedField"],(function(e,t,r,s,a){"use strict";class l extends a.AComputedField{static async create(e,s){const a=r.sqlToTemplateString(e);return new l((e=>a.replaceAll(/{[^}]*}/g,(r=>{const s=r.slice(1,-1),a=e.metadata.fieldsIndex.get(s);if(null==a)return r;const l=e.readAttribute(s);return null==l?"":t.formatField(l,a)}))))}constructor(e){super(),this._evaluator=e}resize(e){}read(e,t){return this._evaluator(e)}readWithDefault(e,t,r){const a=this._evaluator(e);return s.isBadArcadeResult(a)?r:a}referencesScale(){return!1}referencesGeometry(){return!1}}e.ComputedLegacyLabelExpression=l,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
