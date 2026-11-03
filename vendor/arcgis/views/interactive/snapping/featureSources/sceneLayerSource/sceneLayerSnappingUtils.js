/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../chunks/vec32","../../../../../chunks/sphere"],(function(e,n,t){"use strict";const d=1e3;function c(e,d,c){const o=t.create(),s=t.getCenter(o);return n.scaleAndAdd(s,s,e,.5),n.scaleAndAdd(s,s,d,.5),o[3]=n.distance(s,e),n.add(s,s,c),o}e.boundsFromEdge=c,e.maxCandidateCount=d,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
