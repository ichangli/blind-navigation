/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(r){"use strict";class t{get hovering(){return this.someManipulator((r=>r.hovering))}get grabbing(){return this.someManipulator((r=>r.grabbing))}get dragging(){return this.someManipulator((r=>r.dragging))}hasManipulator(r){return this.someManipulator((t=>t===r))}someManipulator(r){let t=!1;return this.forEachManipulator((a=>{!t&&r(a)&&(t=!0)})),t}}var a;r.ManipulatorType=void 0,(a=r.ManipulatorType||(r.ManipulatorType={}))[a.TRANSLATE_XY=0]="TRANSLATE_XY",a[a.SCALE=1]="SCALE",a[a.ROTATE=2]="ROTATE",r.Manipulation=t,Object.defineProperty(r,Symbol.toStringTag,{value:"Module"})}));
