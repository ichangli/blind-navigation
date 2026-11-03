/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(e){"use strict";class s{constructor(){this._candidateTiles=[]}schedule(e){this._candidateTiles.includes(e)||this._candidateTiles.push(e)}reshuffle(e){const s=[];for(const i of this._candidateTiles)e>0?(i.reshuffle(),e--):s.push(i);this._candidateTiles=s}}e.TileReshuffleManager=s,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
