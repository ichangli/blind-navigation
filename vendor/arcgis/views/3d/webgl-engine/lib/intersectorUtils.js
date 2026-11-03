/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../chunks/vec32","../../../../core/libs/gl-matrix-2/factories/vec3f64","../../../../chunks/boundedPlane","./IntersectorInterfaces"],(function(e,t,r,n,c){"use strict";function s(e){return null!=e?.dist}function i(e){return(r,c,s)=>(t.lerp(l,r,c,s),!n.extrusionContainsPoint(e,l))}function o(e){return s(e)&&e.intersector===c.IntersectorType.OBJECT&&!!e.target}function u(e){return s(e)&&e.intersector===c.IntersectorType.HUD&&!!e.target&&"center"in e.target&&null!=e.target.center}const l=r.create();e.isHudIntersectorResult=u,e.isObjectIntersectorResult=o,e.isValidIntersectorResult=s,e.sliceFilterPredicate=i,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
