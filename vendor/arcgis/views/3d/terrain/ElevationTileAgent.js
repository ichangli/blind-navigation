/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./TileAgent"],(function(e,t){"use strict";class i extends t.TileAgent{constructor(){super(...arguments),this.type="elevation",this._scaleRangeEnabled=!1}get _desiredMinLevelDelta(){return this.tile.elevationLevelDelta-(this.tile.elevationLevel-this.tile.level)}get _progressiveLevelModulo(){return 0}}function l(e){return"elevation"===e.type}e.ElevationTileAgent=i,e.isElevationTileAgent=l,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
