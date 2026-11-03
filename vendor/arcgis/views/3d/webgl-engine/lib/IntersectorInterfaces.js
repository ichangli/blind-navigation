/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(e){"use strict";var t,s;e.IntersectorType=void 0,(t=e.IntersectorType||(e.IntersectorType={}))[t.OBJECT=0]="OBJECT",t[t.HUD=1]="HUD",t[t.TERRAIN=2]="TERRAIN",t[t.OVERLAY=3]="OVERLAY",t[t.I3S=4]="I3S",t[t.PCL=5]="PCL",t[t.LOD=6]="LOD",t[t.VOXEL=7]="VOXEL",t[t.TILES3D=8]="TILES3D";class r{constructor(){this.verticalOffset=0,this.selectionMode=!1,this.hud=!0,this.selectOpaqueTerrainOnly=!0,this.invisibleTerrain=!1,this.backfacesTerrain=!0,this.isFiltered=!1,this.filteredLayerUids=[],this.store=e.StoreResults.ALL,this.normalRequired=!0}}e.StoreResults=void 0,(s=e.StoreResults||(e.StoreResults={}))[s.MIN=0]="MIN",s[s.MINMAX=1]="MINMAX",s[s.ALL=2]="ALL",e.IntersectorOptions=r,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
