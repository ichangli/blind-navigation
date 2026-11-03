/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../sketch/constraints","../SnappingDomain","./SnappingCandidate","../hints/IntersectionSnappingHint"],(function(t,n,i,s,e){"use strict";class a extends s.SnappingCandidate{constructor(t,s,e,a){super(t,new n.PointConstraint(t),a,i.SnappingDomain.ALL),this.first=s,this.second=e}get hints(){return this.first.targetPoint=this.targetPoint,this.second.targetPoint=this.targetPoint,[...this.first.hints,...this.second.hints,new e.IntersectionSnappingHint(this.targetPoint,this.isDraped,this.domain)]}}t.IntersectionSnappingCandidate=a,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
