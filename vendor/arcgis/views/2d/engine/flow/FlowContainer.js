/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["./BrushFlow","../webgl/enums","../webgl/WGLContainer"],(function(e,r,s){"use strict";class n extends s{constructor(){super(...arguments),this.flowStyle=null}doRender(e){super.doRender(e)}prepareRenderPasses(s){const n=s.registerRenderPass({name:"flow",brushes:[e],target:()=>this.children,drawPhase:r.WGLDrawPhase.MAP});return[...super.prepareRenderPasses(s),n]}}return n}));
