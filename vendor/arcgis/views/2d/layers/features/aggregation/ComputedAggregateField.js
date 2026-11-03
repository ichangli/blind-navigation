/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../support/DictionaryValue"],(function(t,e){"use strict";class i{static async create(t,s){if("count"===s.statisticType){const t=new e.DictionaryValue(1);return new i(s.name,s.alias,s.type,s.statisticType,t)}const a=await t.createComputedField({expression:s.onStatisticExpression?.expression,field:s.onStatisticField});return new i(s.name,s.alias,s.type,s.statisticType,a)}constructor(t,e,i,s,a){this.name=t,this.alias=e,this.type=i,this.statisticType=s,this.computed=a}}t.ComputedAggregateField=i,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
