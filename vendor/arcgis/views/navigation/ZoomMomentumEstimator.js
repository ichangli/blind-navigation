/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./Momentum","./MomentumEstimator"],(function(e,t,o){"use strict";class u extends t.Momentum{constructor(e,t,o){super(e,t,o)}value(e){const t=super.value(e);return Math.exp(t)}valueDelta(e,t){const o=super.value(e),u=super.value(e+t)-o;return Math.exp(u)}}class r extends o.MomentumEstimator{constructor(e=2.5,t=.01,o=.95,u=12){super(e,t,o,u)}add(e,t){super.add(Math.log(e),t)}createMomentum(e,t,o){return new u(e,t,o)}}e.ZoomMomentum=u,e.ZoomMomentumEstimator=r,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
