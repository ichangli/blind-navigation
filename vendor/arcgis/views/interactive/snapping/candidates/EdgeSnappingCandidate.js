/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../sketch/constraints","../snappingUtils","./FeatureSnappingCandidate","../hints/LineSnappingHint"],(function(n,t,e,i,a){"use strict";class s extends i.FeatureSnappingCandidate{constructor(n){super({...n,constraint:new t.LineConstraint(n.edgeStart,n.edgeEnd)})}get hints(){return[new a.LineSnappingHint(e.LineSegmentHintType.REFERENCE,this.constraint.start,this.constraint.end,this.isDraped,this.domain)]}}n.EdgeSnappingCandidate=s,Object.defineProperty(n,Symbol.toStringTag,{value:"Module"})}));
