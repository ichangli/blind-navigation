/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./SingleKey"],(function(e,t){"use strict";class i extends t.SingleKey{constructor(e,t,i){super(t,i),this.view=e}activate(){this.view.goTo({heading:0}).catch((()=>{}))}}e.SingleKeyResetHeading=i,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
