/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./TerrainConst","./TileAgent"],(function(e,t,n){"use strict";class r extends n.TileAgent{constructor(){super(),this.type="map",this._scaleRangeEnabled=!0}get _desiredMinLevelDelta(){return 0}get _progressiveLevelModulo(){return t.progressiveLoadingModulo}}function i(e){return"map"===e.type}e.MapTileAgent=r,e.isMapTileAgent=i,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
