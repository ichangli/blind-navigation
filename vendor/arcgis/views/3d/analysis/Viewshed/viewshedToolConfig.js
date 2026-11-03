/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../core/mathUtils","../Slice/sliceToolConfig"],(function(e,i,r){"use strict";const l=r.resizeHandleCornerWidth,t=r.displayFocusMultiplier*l,n=5,o=.0025,s=1,c=Math.sin(i.deg2rad(2)),a=r.displayFocusMultiplier/1.5,d=5,u=1;e.angleOpenThreshold=u,e.fovFocusedArcWidth=t,e.fovUnfocusedArcWidth=l,e.observerManipulatorSize=d,e.scaleOrientArcAngle=n,e.scaleOrientArrowTipFocusMultiplier=a,e.scaleOrientArrowTipLength=c,e.scaleOrientHandleRadius=o,e.scaleOrientMinDistance=s,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
