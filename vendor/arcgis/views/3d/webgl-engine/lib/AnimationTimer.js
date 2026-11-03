/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../core/time"],(function(e,t){"use strict";class i{constructor(){this.enabled=!0,this._time=t.Milliseconds(0)}get time(){return this._time}advance({deltaTime:e,fixedTime:i}){return null!=i?this._time!==i&&(this._time=i,!0):(this._time=t.Milliseconds(this._time+e),0!==e)}}class s{constructor(e,t){this.deltaTime=e,this.fixedTime=t}}e.AnimationTimer=i,e.Parameters=s,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
