/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(e){"use strict";const r="ProfileGenerationError";var o;e.ProfileGenerationErrorCause=void 0,(o=e.ProfileGenerationErrorCause||(e.ProfileGenerationErrorCause={})).TooComplex="too-complex",o.InvalidGeometry="invalid-geometry",o.InvalidElevationInfo="invalid-elevation-info",o.ElevationQueryError="elevation-query-error";class n extends Error{constructor(e){super("profile could not be generated",{cause:e}),this.type=r}}function i(e){return e.type===r}e.ProfileGenerationError=n,e.isProfileGenerationError=i,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
