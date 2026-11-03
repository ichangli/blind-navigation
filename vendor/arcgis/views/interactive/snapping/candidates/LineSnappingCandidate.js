/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../sketch/constraints","../SnappingDomain","../snappingUtils","./SnappingCandidate","../hints/LineSnappingHint"],(function(n,t,e,i,a,s){"use strict";class r extends a.SnappingCandidate{constructor({lineStart:n,lineEnd:a,targetPoint:r,isDraped:p}){super(r,new t.VerticalPlaneConstraint(n,a),p,e.SnappingDomain.SELF),this._referenceLineHint=new s.LineSnappingHint(i.LineSegmentHintType.REFERENCE_EXTENSION,n,a,p,this.domain)}get hints(){return[this._referenceLineHint,new s.LineSnappingHint(i.LineSegmentHintType.TARGET,this._lineEndClosestToTarget(),this.targetPoint,this.isDraped,this.domain)]}_lineEndClosestToTarget(){return this.constraint.closestEndTo(this.targetPoint)}}n.LineSnappingCandidate=r,Object.defineProperty(n,Symbol.toStringTag,{value:"Module"})}));
