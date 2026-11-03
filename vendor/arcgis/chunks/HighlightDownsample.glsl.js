/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../views/3d/webgl-engine/core/shaderLibrary/ScreenSpacePass.glsl","../views/3d/webgl-engine/core/shaderModules/interfaces","../views/3d/webgl-engine/core/shaderModules/ShaderBuilder","../views/3d/webgl-engine/core/shaderModules/Texture2DDrawUniform"],(function(e,r,l,i,a){"use strict";class t extends l.NoParameters{}function n(){const e=new i.ShaderBuilder,{outputs:t,fragment:n}=e;return e.include(r.ScreenSpacePass),n.uniforms.add(new a.Texture2DDrawUniform("textureInput",(e=>e.input))),n.constants.add("sampleArea","int",Math.ceil(d/2)),t.add("fragGrid","vec2"),n.code.add(l.glsl`
    void main() {
      float red = 0.0;
      float green = 1.0;
      int cellSize = ${l.glsl.int(o)};
      vec2 texelSize = 1.0 / vec2(textureSize(textureInput, 0));
      vec2 offset = floor(gl_FragCoord.xy) * vec2(float(cellSize));

      for(int x = -sampleArea; x < cellSize + sampleArea; x += 2) {
        for(int y = -sampleArea; y < cellSize + sampleArea; y += 2) {
          vec2 coord = (offset + vec2(float(x), float(y))) * texelSize;
          vec4 value = texture(textureInput, coord);
          float mx = floor(max(value.g, value.b));

          red = max(red, ceil(value.r));
          green = min(green, mx);
          if(red == 1.0 && green == 0.0) {
            fragGrid = vec2(red, green);
            return;
          }
        }
      }
      fragGrid = vec2(red, green);
    }`),e}const o=32,d=9,s=.4,c=Object.freeze(Object.defineProperty({__proto__:null,HighlightDownsampleDrawParameters:t,blurSize:s,build:n,gridCellPixelSize:o,outlineSize:d},Symbol.toStringTag,{value:"Module"}));e.HighlightDownsample=c,e.HighlightDownsampleDrawParameters=t,e.blurSize=s,e.build=n,e.gridCellPixelSize=o,e.outlineSize=d}));
