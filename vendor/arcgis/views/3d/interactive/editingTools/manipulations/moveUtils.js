/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../interactive/dragEventPipeline"],(function(e,t){"use strict";function n(e,n,a){const r=(t,a)=>{n({action:t,object:e,dxScreen:a.screenDeltaX,dyScreen:a.screenDeltaY})};return a(((n,a,i)=>(a.next((e=>("start"===e.action&&r("start",e),e))).next(t.dragManipulatedObject(e)).next((e=>{switch(e.action){case"start":case"update":(e.translationX||e.translationY||e.translationZ)&&r("update",e);break;case"end":r("end",e)}return e})),{steps:a,cancel:i=i.next(t.resetManipulatedObject(e)).next((e=>(r("end",{screenDeltaX:0,screenDeltaY:0}),e)))})))}function a(e){if(null==e?.axis)return 1;const{mapStart:t,mapEnd:n,axis:a}=e,r=[n.x-t.x,n.y-t.y];return r[0]*a[0]+r[1]*a[1]>0?1:-1}e.axisConstrainedDragSign=a,e.createManipulatedMoveDragPipeline=n,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
