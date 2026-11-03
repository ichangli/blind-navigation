/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../SpatialReference","../spatialReferenceEllipsoidUtils","./spatialReferenceUtils","./SupportedGCSWkids"],(function(e,i,t,r,s){"use strict";function o(e){return r.equals(e,t.SphericalPCPFMars)||r.isMars(e)?{wkid:s.SupportedGCSWkids.GCSMARS2000}:r.equals(e,t.SphericalPCPFMoon)||r.isMoon(e)?{wkid:s.SupportedGCSWkids.GCSMOON2000}:i.WGS84}e.getCGSForPlanet=o,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
