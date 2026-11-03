/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../sketch/constraints","../snappingUtils","./FeatureSnappingCandidate","../hints/LineSnappingHint"],(function(n,t,e,i,a){"use strict";class s extends i.FeatureSnappingCandidate{constructor(n){super({...n,isDraped:!0,constraint:new t.DrapedLineConstraint(n.edgeStart,n.edgeEnd,n.getGroundElevation)})}get hints(){return[new a.LineSnappingHint(e.LineSegmentHintType.REFERENCE,this.constraint.start,this.constraint.end,this.isDraped,this.domain)]}}n.DrapedEdgeSnappingCandidate=s,Object.defineProperty(n,Symbol.toStringTag,{value:"Module"})}));
