/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./ChangeSet"],(function(e,r){"use strict";var t,n;function a(e){const t=new Map,n=e=>{let n=t.get(e);return n||(n=new r.MaterialChangeSet,t.set(e,n)),n};return e.removes.forAll((e=>{d(e)&&n(e.material).removes.push(e)})),e.adds.forAll((e=>{d(e)&&n(e.material).adds.push(e)})),e.updates.forAll((e=>{d(e.renderGeometry)&&n(e.renderGeometry.material).updates.push(e)})),t}function d(e){return e.geometry.indexCount>=1}e.RendererTarget=void 0,(t=e.RendererTarget||(e.RendererTarget={}))[t.Default=0]="Default",t[t.Screenshot=1]="Screenshot",t[t.ObjectAndLayerID=2]="ObjectAndLayerID",e.PaddingSide=void 0,(n=e.PaddingSide||(e.PaddingSide={}))[n.TOP=0]="TOP",n[n.RIGHT=1]="RIGHT",n[n.BOTTOM=2]="BOTTOM",n[n.LEFT=3]="LEFT",e.splitRenderGeometryChangeSetByMaterial=a,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
