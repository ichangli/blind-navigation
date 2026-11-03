/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../../core/libs/gl-matrix-2/factories/vec3f64","../output/BlendOptions","./BackgroundGrid.glsl","./BaseOpacityMode","./BlendLayersOutput","./PremultipliedAlphaSource","../util/BlendModes.glsl","../../shaderModules/Float3PassUniform","../../shaderModules/FloatPassUniform","../../shaderModules/interfaces","../../shaderModules/Texture2DPassUniform"],(function(o,e,r,l,a,t,s,c,u,d,n,i){"use strict";class g extends n.NoParameters{constructor(){super(...arguments),this.baseOpacity=1,this.backgroundColor=e.ZEROS,this.fboTexture=null}}function p(o,e){const g=e.output===t.BlendLayersOutput.GridComposite,p=e.output===t.BlendLayersOutput.ColorComposite,b=e.output===t.BlendLayersOutput.GroupBackgroundComposite,y=e.output===t.BlendLayersOutput.Composite,m=e.baseOpacityMode===a.BaseOpacityMode.Required,f=o.fragment;m&&f.uniforms.add(new d.FloatPassUniform("baseOpacity",(o=>o.baseOpacity))),g?f.include(l.BackgroundGrid):p?f.uniforms.add(new u.Float3PassUniform("backgroundColor",(o=>o.backgroundColor))):y&&f.uniforms.add(new i.Texture2DPassUniform("fboColor",(o=>o.fboTexture)));const C=e.blendMode!==r.LayerBlendMode.Normal,B=e.premultipliedSource===s.PremultipliedAlphaSource.On,v=!C&&!B&&(y&&!m||b);f.include(c.BlendModes,e),f.code.add(n.glsl`
    vec4 getBackground(vec2 uv) {
      return ${m?n.glsl`baseOpacity *`:""} ${b?n.glsl`vec4(0.0, 0.0, 0.0, 0.0)`:p?n.glsl`vec4(backgroundColor, 1.0)`:g?n.glsl`vec4(gridColor(uv), 1.0)`:n.glsl`texelFetch(fboColor, ivec2(gl_FragCoord.xy), 0)`};
    }

    vec4 blendLayers(vec2 bgUV, vec4 colorLayer, float opacity) {
      ${C?n.glsl`
          vec3 cl = colorLayer.a == 0.0 ? colorLayer.rgb : colorLayer.rgb / colorLayer.a;
          vec4 bgColor = getBackground(bgUV);
          vec3 cb = bgColor.a == 0.0 ? bgColor.rgb : bgColor.rgb / bgColor.a;
          return applyBlendMode(clamp(cl, vec3(0.0), vec3(1.0)), colorLayer.a * opacity, cb, bgColor.a);`:n.glsl`
          float composeAlpha = colorLayer.a * opacity;
          ${v?n.glsl`return colorLayer * opacity;`:n.glsl`
            vec4 bgColor = getBackground(bgUV);
            return bgColor * (1.0 - composeAlpha) + colorLayer * opacity;`}`}
    }`)}o.TileBackground=p,o.TileBackgroundPassParameters=g,Object.defineProperty(o,Symbol.toStringTag,{value:"Module"})}));
