/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../core/Version"],(function(e,s){"use strict";class r extends s.Version{constructor(e,s){super(e,s,"webscene")}get supportsGround(){return this.since(1,8)}get supportsVisibleElevationLayersInSlides(){return this.lessThan(1,8)}}e.Version=r,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
