/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../chunks/vec32","./ConstraintOptions","./ConstraintTypes"],(function(n,t,a,i){"use strict";function o(n,t){return!!(n&t)}function e(n,t,a,i,o,e){0!==n&&(a?(e.min=Math.min(e.min,t),e.max=Math.max(e.max,t)):null!=i?(e.min-=Math.max(0,(t-e.min)*(1-i)),e.max+=Math.max(0,(t-e.max)*(1-i))):o&&(e.min-=Math.max(0,t-e.min-o),e.max+=Math.max(0,t-e.max-o)))}const r=new a.ConstraintOptions(i.ConstraintTypes.NONE);function s(n,a,i,o){return a=a||n.viewForward,t.copy(o,a),t.scale(o,o,Math.sign(t.dot(a,i))),o}n.adjustRangeForInteraction=e,n.defaultConstraintOptions=r,n.hasConstraintType=o,n.interactionDirectionTowardsConstraintMinimization=s,Object.defineProperty(n,Symbol.toStringTag,{value:"Module"})}));
