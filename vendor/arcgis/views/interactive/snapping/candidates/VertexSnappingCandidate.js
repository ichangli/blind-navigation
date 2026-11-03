/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../sketch/constraints","./FeatureSnappingCandidate","../hints/PointSnappingHint"],(function(t,n,e,i){"use strict";class a extends e.FeatureSnappingCandidate{constructor(t){super({...t,constraint:new n.PointConstraint(t.targetPoint)})}get hints(){return[new i.PointSnappingHint(this.targetPoint,this.isDraped,this.domain)]}}t.VertexSnappingCandidate=a,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
