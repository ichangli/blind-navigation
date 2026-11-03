/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../../chunks/boundedPlane"],(function(e){"use strict";const n=e.create();class t{constructor(){this._plane=e.create()}get isEnabled(){return!e.equals(this.plane,n)}get plane(){return this._plane}set plane(t){e.copy(t||n,this._plane)}}return t}));
