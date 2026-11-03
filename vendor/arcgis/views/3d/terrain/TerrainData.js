/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(e){"use strict";function t(e){return null!=e&&"type"in e&&"vector-tile"===e.type}function i(e){return null!=e&&"type"in e&&"raster-tile"===e.type}function n(e){return null!=e&&"type"in e&&"tile-texture"===e.type}function r(e){return null!=e&&"type"in e&&"image+type"===e.type}e.isImageWithType=r,e.isRasterTile=i,e.isTileTexture=n,e.isVectorTile=t,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
