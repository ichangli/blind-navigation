/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../core/mathUtils","../core/libs/gl-matrix-2/math/mat4","../core/libs/gl-matrix-2/factories/mat4f64","../core/libs/gl-matrix-2/math/vec2","../core/libs/gl-matrix-2/factories/vec2f64","./vec32","../core/libs/gl-matrix-2/factories/vec3f64","../geometry/support/aaBoundingBox","../views/3d/webgl-engine/core/shaderLibrary/ShaderOutput","../views/3d/webgl-engine/core/shaderLibrary/Slice.glsl","../views/3d/webgl-engine/core/shaderLibrary/output/OutputHighlight.glsl","../views/3d/webgl-engine/core/shaderLibrary/util/RgbaFloatEncoding.glsl","../views/3d/webgl-engine/core/shaderModules/Float2DrawUniform","../views/3d/webgl-engine/core/shaderModules/Float2PassUniform","../views/3d/webgl-engine/core/shaderModules/Float3DrawUniform","../views/3d/webgl-engine/core/shaderModules/interfaces","../views/3d/webgl-engine/core/shaderModules/Matrix4DrawUniform","../views/3d/webgl-engine/core/shaderModules/Matrix4PassUniform","../views/3d/webgl-engine/core/shaderModules/ShaderBuilder","../views/3d/webgl-engine/lib/VertexAttribute"],(function(e,i,t,r,a,o,n,s,l,c,d,p,g,u,m,f,x,S,h,w,v){"use strict";class z extends x.NoParameters{constructor(){super(...arguments),this.clipBox=l.create(l.positiveInfinity),this.useFixedSizes=!1,this.useRealWorldSymbolSizes=!1,this.scaleFactor=1,this.minSizePx=0,this.size=0,this.sizePx=0}get fixedSize(){return this.drawScreenSpace?this.sizePx:this.size}get screenMinSize(){return this.useFixedSizes?0:this.minSizePx}get drawScreenSpace(){return this.useFixedSizes&&!this.useRealWorldSymbolSizes}}class b extends d.SlicePlaneParameters{constructor(e,i,t){super(e),this.origin=e,this.isLeaf=i,this.splatSize=t}}function M(e){const r=new w.ShaderBuilder,o=e.output===c.ShaderOutput.Color,s=e.output===c.ShaderOutput.Highlight,{vertex:l,fragment:z}=r;return r.include(d.SliceDraw,e),r.attributes.add(v.VertexAttribute.POSITION,"vec3"),r.attributes.add(v.VertexAttribute.COLOR,"vec3"),l.uniforms.add(new S.Matrix4DrawUniform("modelView",((e,i)=>t.multiply(y,i.camera.viewMatrix,t.fromTranslation(y,e.origin)))),new h.Matrix4PassUniform("proj",((e,i)=>i.camera.projectionMatrix)),new u.Float2DrawUniform("screenMinMaxSize",((e,i,t)=>a.set(O,t.useFixedSizes?0:t.minSizePx*i.camera.pixelRatio,P(e.isLeaf)*i.camera.pixelRatio))),e.useFixedSizes?new m.Float2PassUniform("pointScale",((e,i)=>a.set(O,e.fixedSize*i.camera.pixelRatio,i.camera.fullHeight))):new u.Float2DrawUniform("pointScale",((e,i,t)=>a.set(O,e.splatSize*t.scaleFactor*i.camera.pixelRatio,i.camera.fullHeight/i.camera.pixelRatio)))),e.clippingEnabled?l.uniforms.add(new f.Float3DrawUniform("clipMin",((e,i,t)=>n.set(F,t.clipBox[0]-e.origin[0],t.clipBox[1]-e.origin[1],t.clipBox[2]-e.origin[2]))),new f.Float3DrawUniform("clipMax",((e,i,t)=>n.set(F,t.clipBox[3]-e.origin[0],t.clipBox[4]-e.origin[1],t.clipBox[5]-e.origin[2])))):(l.constants.add("clipMin","vec3",[-i.numberMaxFloat32,-i.numberMaxFloat32,-i.numberMaxFloat32]),l.constants.add("clipMax","vec3",[i.numberMaxFloat32,i.numberMaxFloat32,i.numberMaxFloat32])),o&&r.varyings.add("vColor","vec3"),l.code.add(x.glsl`
    void main(void) {
      // Move clipped points outside of clipspace
      if (position.x < clipMin.x || position.y < clipMin.y || position.z < clipMin.z ||
        position.x > clipMax.x || position.y > clipMax.y || position.z > clipMax.z) {
        gl_Position = vec4(0.0,0.0,0.0,2.0);
        gl_PointSize = 0.0;
        return;
      }

      if (rejectBySlice(position)) {
        gl_Position = vec4(0.0,0.0,0.0,2.0);
        gl_PointSize = 0.0;
        return;
      }

      // Position in camera space
      vec4 camera = modelView * vec4(position, 1.0);

      float pointSize = pointScale.x;
      vec4 position = proj * camera;
     ${e.drawScreenSize?x.glsl`
      float clampedScreenSize = pointSize;`:x.glsl`
      float pointRadius = 0.5 * pointSize;
      vec4 cameraOffset = camera + vec4(0.0, pointRadius, 0.0, 0.0);
      vec4 positionOffset = proj * cameraOffset;
      float radius = abs(positionOffset.y - position.y);
      float viewHeight = pointScale.y;
      // screen diameter = (2 * r / w) * (h / 2)
      float screenPointSize = (radius / position.w) * viewHeight;
      float clampedScreenSize = clamp(screenPointSize, screenMinMaxSize.x, screenMinMaxSize.y);
      // Shift towards camera, to move rendered point out of terrain i.e. to
      // the camera-facing end of the virtual point when considering it as a
      // 3D sphere.
      camera.xyz -= normalize(camera.xyz) * pointRadius * clampedScreenSize / screenPointSize;
      position = proj * camera;`}

     gl_PointSize = clampedScreenSize;
     gl_Position = position;

     ${o?x.glsl`vColor = color;`:""}
    }
  `),z.include(g.RgbaFloatEncoding,e),s&&r.include(p.OutputHighlight,e),z.code.add(x.glsl`
    void main(void) {
        vec2 vOffset = gl_PointCoord - vec2(0.5, 0.5);
        float r2 = dot(vOffset, vOffset);

        if (r2 > 0.25) {
          discard;
        }
        ${s?x.glsl`outputHighlight();`:""}
        ${o?x.glsl`fragColor = vec4(vColor, 1.0);`:""}
    }
  `),r}function P(e){return e?256:64}const y=r.create(),F=s.create(),O=o.create(),R=Object.freeze(Object.defineProperty({__proto__:null,PointRendererDrawParameters:b,PointRendererPassParameters:z,build:M,getMaxPointSizeScreenspace:P},Symbol.toStringTag,{value:"Module"}));e.PointRendererDrawParameters=b,e.PointRendererPassParameters=z,e.PointRendererShader=R,e.build=M,e.getMaxPointSizeScreenspace=P}));
