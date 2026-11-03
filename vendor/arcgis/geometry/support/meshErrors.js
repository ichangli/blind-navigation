/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../core/Error"],(function(o,e){"use strict";const n="Mesh must be loaded before applying operations",t="Provided component is not part of the list of components",s="Expected polygon to be a Polygon instance",i="Expected location to be a Point instance";class a extends e{constructor(){super("invalid-input:location",i)}}o.InvalidLocationError=a,o.componentNotFoundMessage=t,o.invalidLocationMessage=i,o.invalidPolygonMessage=s,o.meshNotLoadedMessage=n,Object.defineProperty(o,Symbol.toStringTag,{value:"Module"})}));
