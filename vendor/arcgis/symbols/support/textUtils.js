/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../core/mathUtils","../../core/accessorSupport/ensureType"],(function(e,t,n){"use strict";const o=["none","underline","line-through"],l=["normal","italic","oblique"],r=["normal","lighter","bold","bolder"],i={type:Number,cast:e=>{const o=n.ensureNumber(e);return 0===o?1:t.clamp(o,.1,4)},nonNullable:!0},a=["left","right","center"],c=["baseline","top","middle","bottom"],s={type:a,nonNullable:!0},u={type:c,nonNullable:!0},b=8;e.backgroundPadding=b,e.fontDecorations=o,e.fontStyles=l,e.fontWeights=r,e.horizontalAlignmentProperty=s,e.horizontalAlignments=a,e.lineHeightProperty=i,e.verticalAlignmentProperty=u,e.verticalAlignments=c,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
