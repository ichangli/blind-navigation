/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../core/unitUtils","../portal/Portal"],(function(t,e,r){"use strict";function n(t){const n="metric";if(null==t)return n;const i=t.map,l=(i&&"portalItem"in i?i.portalItem?.portal:null)??r.getDefault();switch(l.user?.units??l.units){case n:return n;case"english":return"imperial"}return e.getDefaultUnitSystem(t.spatialReference)??n}t.getDefaultUnitForView=n,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
