/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../webgl-engine/lib/IntersectorInterfaces","../webgl-engine/lib/IntersectorTarget","../webgl-engine/lib/intersectorUtils"],(function(e,t,r,n){"use strict";function s(e){return n.isValidIntersectorResult(e)&&e.intersector===t.IntersectorType.TERRAIN&&!!e.target}class i extends r.Graphic3DTarget{constructor(e,t,r){super(e,t),this.triangleNr=r}}function c(e){return n.isValidIntersectorResult(e)&&e.intersector===t.IntersectorType.OVERLAY&&!!e.target}e.OverlayTarget=i,e.isOverlayIntersectorResult=c,e.isTerrainIntersectorResult=s,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
