/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../core/mathUtils","../../../geometry/support/aaBoundingRect","./TilingScheme"],(function(e,o,t,a){"use strict";const r=64,l=512,i=2.5,n=o.clampFloat32(o.numberMaxFloat32/10),s=2,c=t.create();a.TilingScheme.WebMercatorAuxiliarySphere.getExtent(0,0,0,c);const u=t.create([-180,-90,180,90]),g="Cannot extend surface to encompass all layers because it would result in too many root tiles.",m="Surface extent is too large for tile resolution at level 0.",x=4;e.elevationNoDataValue=n,e.geographicWorldExtent=u,e.maxMemoryLodBias=i,e.maxPatchTesselation=l,e.maxRootTiles=r,e.maxTileNeighborLevelDelta=x,e.progressiveLoadingModulo=s,e.tooManyRootTilesAfterChangeError=g,e.tooManyRootTilesForLayerError=m,e.webMercatorWorldExtent=c,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
