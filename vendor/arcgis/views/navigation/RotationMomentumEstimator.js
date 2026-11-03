/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./MomentumEstimator"],(function(t,e){"use strict";class o extends e.MomentumEstimator{constructor(t=3,e=.01,o=.95,a=12){super(t,e,o,a)}add(t,e){const o=this.value.lastValue;if(null!=o){let e=t-o;for(;e>Math.PI;)e-=2*Math.PI;for(;e<-Math.PI;)e+=2*Math.PI;t=o+e}super.add(t,e)}}t.RotationMomentumEstimator=o,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
