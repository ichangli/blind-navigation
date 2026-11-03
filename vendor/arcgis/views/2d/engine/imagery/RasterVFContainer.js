/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./BrushVectorField","../webgl/enums","../webgl/WGLContainer"],(function(e,r,s,a){"use strict";class t extends a{constructor(){super(...arguments),this.symbolTypes=["triangle"]}prepareRenderPasses(e){const a=e.registerRenderPass({name:"imagery (vf)",brushes:[r],target:()=>this.children,drawPhase:s.WGLDrawPhase.MAP});return[...super.prepareRenderPasses(e),a]}doRender(e){this.visible&&e.drawPhase===s.WGLDrawPhase.MAP&&this.symbolTypes.forEach((r=>{e.renderPass=r,super.doRender(e)}))}}e.RasterVFContainer=t,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
