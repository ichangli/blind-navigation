/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../views/3d/webgl-engine/core/shaderLibrary/terrain/BackgroundGrid.glsl","../views/3d/webgl-engine/core/shaderLibrary/terrain/BlendLayersOutput","../views/3d/webgl-engine/core/shaderLibrary/terrain/TileBackground.glsl","../views/3d/webgl-engine/core/shaderLibrary/terrain/TileComposite.glsl","../views/3d/webgl-engine/core/shaderModules/Float3PassUniform","../views/3d/webgl-engine/core/shaderModules/FloatPassUniform","../views/3d/webgl-engine/core/shaderModules/interfaces","../views/3d/webgl-engine/core/shaderModules/ShaderBuilder","../views/3d/webgl-engine/core/shaderModules/Texture2DPassUniform"],(function(e,r,o,n,d,i,a,l,s,u){"use strict";var t;function g(t){const g=new s.ShaderBuilder,c=g.fragment;if(g.include(d.TileComposite),t.background===e.BackgroundMode.Only){const e=t.output===o.BlendLayersOutput.ColorComposite;return e?c.uniforms.add(new i.Float3PassUniform("backgroundColor",(e=>e.backgroundColor))):c.include(r.BackgroundGrid),c.code.add(l.glsl`
      void main() {
        fragColor = vec4(${e?l.glsl`backgroundColor`:l.glsl`gridColor(uv)`}, 1.0);
      }
    `),g}return g.include(n.TileBackground,t),c.uniforms.add(new u.Texture2DPassUniform("tex",(e=>e.texture)),new a.FloatPassUniform("opacity",(e=>e.opacity))).code.add(l.glsl`void main() {
fragColor = blendLayers(uv, texture(tex, uv), opacity);
}`),g}e.BackgroundMode=void 0,(t=e.BackgroundMode||(e.BackgroundMode={}))[t.BelowLayer=0]="BelowLayer",t[t.Only=1]="Only",t[t.COUNT=2]="COUNT";const c=Object.freeze(Object.defineProperty({__proto__:null,get BackgroundMode(){return e.BackgroundMode},build:g},Symbol.toStringTag,{value:"Module"}));e.BlendLayers=c,e.build=g}));
