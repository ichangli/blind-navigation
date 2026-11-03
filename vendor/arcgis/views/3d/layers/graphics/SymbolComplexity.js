/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(e){"use strict";class t{constructor(e){this.estimated=!1,this.verticesPerFeature=e.verticesPerFeature??0,this.verticesPerCoordinate=e.verticesPerCoordinate??0,this.drawCallsPerFeature=e.drawCallsPerFeature??0,this.memory=e.memory??new o}}class s extends t{constructor(e){super(e),this.estimated=!0}}class r extends t{constructor(e,t){super(t),this.numComplexities=e}}class i extends s{constructor(e,t){super(t),this.numComplexities=e}}class o{constructor(){this.bytesPerFeature=0,this.bytesPerFeatureLabel=0,this.resourceBytes=0,this.draped={bytesPerFeature:0,bytesPerFeatureLabel:0}}}e.AggregateSymbolComplexity=r,e.EstimatedAggregateSymbolComplexity=i,e.EstimatedSymbolComplexity=s,e.SymbolComplexity=t,e.SymbolComplexityMemory=o,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
