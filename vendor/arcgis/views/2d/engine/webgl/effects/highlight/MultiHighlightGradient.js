/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../highlightReasons","./HighlightGradient"],(function(t,i,s){"use strict";class n{constructor(){this.type="multi";const t={};for(const n in i.highlightConfigurator)t[n]=new s;this.gradients=t}setHighlightOptions(t){for(const s in i.highlightConfigurator){const n=i.highlightConfigurator[s](t);this.gradients[s].setHighlightOptions(n)}}applyHighlightOptions(t,i,s){this.gradients[s].applyHighlightOptions(t,i)}destroy(){for(const t in i.highlightConfigurator)this.gradients[t].destroy()}getReasonsWithGradients(){let t=1;const i=[];for(const s in this.gradients){const n=this.gradients[s];i.push({activeReasons:t,activeGradient:n}),t<<=1}return i}}t.MultiHighlightGradient=n,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
