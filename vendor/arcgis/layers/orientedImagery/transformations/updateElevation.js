/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../core/ElevationSourceDefinitions","./updateElevationUtils"],(function(e,n){"use strict";async function t(t,i,o){const a="elevationSample"in i&&null!=i.elevationSample,l="elevationSource"in i?i.elevationSource:void 0,s="extent"in i?i.extent:void 0;return a?n.updateUsingElevationSampler(t,i.elevationSample,o):e.isConstantElevation(l)?n.updateUsingConstant(t,l.constantElevation,!0,o):e.isElevationSource(l)?n.updateUsingElevationSource(t,{...l,extent:s},o):n.updateUsingCameraProperties(i,t)}return t}));
