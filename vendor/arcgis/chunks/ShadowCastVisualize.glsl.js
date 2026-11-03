/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../core/libs/gl-matrix-2/factories/vec4f64","../views/3d/webgl-engine/core/shaderLibrary/ScreenSpacePass.glsl","../views/3d/webgl-engine/core/shaderLibrary/output/ReadDepth.glsl","../views/3d/webgl-engine/core/shaderLibrary/util/CameraSpace.glsl","../views/3d/webgl-engine/core/shaderLibrary/util/RgbaFloatEncoding.glsl","../views/3d/webgl-engine/core/shaderModules/Float4PassUniform","../views/3d/webgl-engine/core/shaderModules/FloatPassUniform","../views/3d/webgl-engine/core/shaderModules/interfaces","../views/3d/webgl-engine/core/shaderModules/ShaderBuilder","../views/3d/webgl-engine/core/shaderModules/Texture2DPassUniform","./ShadowCastAccumulate.glsl","../views/3d/webgl-engine/shaders/ShadowCastVisualizeTechniqueConfiguration"],(function(e,a,s,o,i,l,r,t,n,d,c,u,h){"use strict";class g extends n.NoParameters{constructor(e){super(),this._data=e,this.sampleScale=0,this.opacityFromElevation=1,this.color=a.clone(w),this.bandSize=.1,this.threshold=.5}get shadowCastMap(){return this._data.shadowCastTexture}}const w=a.fromValues(.01,0,.25,1);function m(e){const a=new d.ShaderBuilder,g=a.fragment;g.include(l.RgbaFloatEncoding),g.include(o.ReadLinearDepth),a.include(i.CameraSpace),a.include(s.ScreenSpacePass);const{visualization:w,bandsEnabled:m}=e;g.constants.add("inverseSampleValue","float",u.ShadowCastMaxSamples),g.uniforms.add(new c.Texture2DPassUniform("shadowCastMap",(e=>e.shadowCastMap)),new t.FloatPassUniform("sampleScale",(e=>e.sampleScale)),new t.FloatPassUniform("opacityFromElevation",(e=>e.opacityFromElevation)),new r.Float4PassUniform("uColor",(e=>e.color)));const S=w===h.ShadowCastVisualization.Gradient,p=w===h.ShadowCastVisualization.Threshold;return S&&m?g.uniforms.add(new t.FloatPassUniform("bandSize",(e=>e.bandSize))):p&&g.uniforms.add(new t.FloatPassUniform("threshold",(e=>e.threshold))),g.code.add(n.glsl`
    void main(void) {
      float record = texture(shadowCastMap, uv).r;
      float pixelSamples = record * inverseSampleValue;
      if (pixelSamples < 1.0) {
        discard;
      }

      float strength = pixelSamples * sampleScale;

      ${p?n.glsl`
          if (strength <= threshold) {
            discard;
          }`:""}

      ${S&&m?n.glsl`strength = ceil(strength / bandSize) * bandSize;`:""}

      fragColor = vec4(uColor.xyz, uColor.a * opacityFromElevation ${S?n.glsl`* strength`:""});
    }
  `),a}const S=Object.freeze(Object.defineProperty({__proto__:null,ShadowCastVisualizePassParameters:g,build:m},Symbol.toStringTag,{value:"Module"}));e.ShadowCastVisualize=S,e.ShadowCastVisualizePassParameters=g,e.build=m}));
