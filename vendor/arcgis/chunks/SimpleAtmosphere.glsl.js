/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../core/libs/gl-matrix-2/factories/vec2f64","../core/libs/gl-matrix-2/factories/vec3f64","../views/3d/environment/SimpleAtmosphereTechniqueConfiguration","../views/3d/webgl-engine/core/shaderLibrary/Transform.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/MainLighting.glsl","../views/3d/webgl-engine/core/shaderModules/Float2PassUniform","../views/3d/webgl-engine/core/shaderModules/Float3PassUniform","../views/3d/webgl-engine/core/shaderModules/FloatPassUniform","../views/3d/webgl-engine/core/shaderModules/interfaces","../views/3d/webgl-engine/core/shaderModules/Matrix4PassUniform","../views/3d/webgl-engine/core/shaderModules/ShaderBuilder","../views/3d/webgl-engine/core/shaderModules/Texture2DPassUniform","../views/3d/webgl-engine/lib/VertexAttribute"],(function(e,o,i,r,t,s,a,n,l,d,c,m,g,f){"use strict";class u extends d.NoParameters{constructor(){super(...arguments),this.texV=o.create(),this.altitudeFade=0,this.innerScale=0,this.undergroundFadeAlpha=0,this.silhouette=new h}}class h{constructor(){this.center=i.create(),this.v1=i.create(),this.v2=i.create()}}function p(e){const o=new m.ShaderBuilder,{vertex:i,fragment:u}=o;if(s.addMainLightDirection(i),e.geometry===r.SimpleAtmosphereGeometry.Underground)o.attributes.add(f.VertexAttribute.POSITION,"vec2"),o.varyings.add("color","vec4"),i.uniforms.add(new n.Float3PassUniform("cameraPosition",((e,o)=>o.camera.eye)),new l.FloatPassUniform("undergroundFadeAlpha",(e=>e.undergroundFadeAlpha))),i.code.add(d.glsl`void main(void) {
float ndotl = dot(normalize(cameraPosition), mainLightDirection);
float lighting = max(0.0, smoothstep(-1.0, 0.8, 2.0 * ndotl));
color = vec4(vec3(lighting), undergroundFadeAlpha);
gl_Position = vec4(position.xy, 1.0, 1.0);
}`),u.code.add(d.glsl`void main() {
fragColor = color;
}`);else{o.include(t.Transform,e),o.attributes.add(f.VertexAttribute.POSITION,"vec3"),o.varyings.add("vtc","vec2"),o.varyings.add("falloff","float");const s=e.geometry===r.SimpleAtmosphereGeometry.Cylinder;i.uniforms.add(new c.Matrix4PassUniform("proj",((e,o)=>o.camera.projectionMatrix)),new c.Matrix4PassUniform("view",((e,o)=>o.camera.viewMatrix))),s||(o.varyings.add("innerFactor","float"),i.uniforms.add(new n.Float3PassUniform("silCircleCenter",(e=>e.silhouette.center))),i.uniforms.add(new n.Float3PassUniform("silCircleV1",(e=>e.silhouette.v1))),i.uniforms.add(new n.Float3PassUniform("silCircleV2",(e=>e.silhouette.v2))),i.uniforms.add(new a.Float2PassUniform("texV",(e=>e.texV))),i.uniforms.add(new l.FloatPassUniform("innerScale",(e=>e.innerScale))));const m=6.2831853,h=1/128;i.code.add(d.glsl`
		void main(void) {
      ${s?d.glsl`
      vec3 pos = position;
      float ndotl = mainLightDirection.z;
      vtc = vec2(0.0, position.z + 0.05);`:d.glsl`
      innerFactor = clamp(-position.z, 0.0, 1.0);
      float scale = position.y * (1.0 + innerFactor * innerScale);
      float phi = position.x * ${d.glsl.float(m*h)} + 1.0;
      vec3 pos =  (silCircleCenter + sin(phi) * silCircleV1 + cos(phi) * silCircleV2) * scale;
      float ndotl = dot(normalize(position.y > 0.0 ? pos: silCircleCenter), mainLightDirection);
      vtc.x = position.x  * ${d.glsl.float(h)};
      vtc.y = texV.x * (1.0 - position.z) + texV.y * position.z;
      `}
      falloff = max(0.0, smoothstep(-1.0, 0.8, 2.0 * ndotl));

		  gl_Position = transformPosition(proj, view, pos);
		  gl_Position.z = gl_Position.w; // project atmosphere onto the far plane
    }
	  `),u.uniforms.add(new g.Texture2DPassUniform("tex",(e=>e.texture))),s||u.uniforms.add(new l.FloatPassUniform("altitudeFade",(e=>e.altitudeFade))),u.code.add(d.glsl`
		void main() {
			vec4 atmosphereColor = texture(tex, vtc) * falloff;
      ${s?d.glsl`fragColor = atmosphereColor;`:d.glsl`
			vec4 innerColor = vec4(atmosphereColor.rgb, 1.0 - altitudeFade);
			fragColor = mix(atmosphereColor, innerColor, smoothstep(0.0, 1.0, innerFactor));
      `}
    }`)}return o}const v=Object.freeze(Object.defineProperty({__proto__:null,SilhouetteCircle:h,SimpleAtmospherePassParameters:u,build:p},Symbol.toStringTag,{value:"Module"}));e.SilhouetteCircle=h,e.SimpleAtmosphere=v,e.SimpleAtmospherePassParameters=u,e.build=p}));
