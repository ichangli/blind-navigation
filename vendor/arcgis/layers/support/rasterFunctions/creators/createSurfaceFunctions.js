/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./utils"],(function(e,t){"use strict";function r(e){const{raster:r,outputPixelType:o}=e;return t.createRasterFunction("Aspect",{raster:r},o)}function o(e){const{raster:r,zFactor:o,removeEdgeEffect:u,outputPixelType:n="unknown"}=e,c="degree"===e.slopeType?1:"percent-rise"===e.slopeType?2:3,a={raster:r,slopeType:c,zFactor:o,removeEdgeEffect:u};return 3===c&&(a.psPower=e.pixelSizePower,a.psZFactor=e.pixelSizeZFactor),t.createRasterFunction("Slope",a,n)}function u(e){const{raster:r,zFactor:o,outputPixelType:u="unknown"}=e,n={raster:r,curvatureType:"standard"===e.curvatureType?0:"platform"===e.curvatureType?1:2,zFactor:o};return t.createRasterFunction("Curvature",n,u)}e.aspect=r,e.curvature=u,e.slope=o,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
