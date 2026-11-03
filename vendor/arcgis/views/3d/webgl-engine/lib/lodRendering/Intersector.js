/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../IntersectorInterfaces","../IntersectorTarget","../intersectorUtils"],(function(e,t,r,s){"use strict";class i extends r.Graphic3DTarget{constructor(e,t,r,s,i,n){super(e,t),this.layerUid=e,this.graphicUid=t,this.geometryId=r,this.triangleNr=s,this.baseBoundingSphere=i,this.numLodLevels=n}}function n(e){return s.isValidIntersectorResult(e)&&e.intersector===t.IntersectorType.LOD&&!!e.target}e.LodTarget=i,e.isLodIntersectorResult=n,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
