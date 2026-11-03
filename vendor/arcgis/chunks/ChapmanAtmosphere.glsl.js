/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../core/libs/gl-matrix-2/math/mat4","../core/libs/gl-matrix-2/factories/mat4f64","../core/libs/gl-matrix-2/factories/vec3f64","../views/3d/environment/atmosphereUtils","../views/3d/webgl-engine/core/shaderLibrary/attributes/TextureCoordinateAttribute.glsl","../views/3d/webgl-engine/core/shaderLibrary/output/ReadDepth.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/Gamma.glsl","../views/3d/webgl-engine/core/shaderLibrary/shading/MainLighting.glsl","../views/3d/webgl-engine/core/shaderModules/Float2PassUniform","../views/3d/webgl-engine/core/shaderModules/Float3PassUniform","../views/3d/webgl-engine/core/shaderModules/Float4PassUniform","../views/3d/webgl-engine/core/shaderModules/FloatPassUniform","../views/3d/webgl-engine/core/shaderModules/interfaces","../views/3d/webgl-engine/core/shaderModules/Matrix4PassUniform","../views/3d/webgl-engine/core/shaderModules/ShaderBuilder","../views/3d/webgl-engine/core/shaderModules/Texture2DPassUniform","../views/3d/webgl-engine/lib/VertexAttribute"],(function(e,t,a,r,i,o,l,s,n,c,h,d,p,m,g,u,f,x){"use strict";const v=r.fromValues(parseFloat(Number(5802e-9).toFixed(6)),parseFloat(Number(13558e-9).toFixed(6)),parseFloat(Number(331e-7).toFixed(6))),y=3,b=r.fromValues(y*parseFloat(Number(65e-8).toFixed(6)),y*parseFloat(Number(1881e-9).toFixed(6)),y*parseFloat(Number(85e-9).toFixed(6))),D=3996e-9,P=r.fromValues(parseFloat(Number(v[0]+b[0]).toFixed(6)),parseFloat(Number(v[1]+b[1]).toFixed(6)),parseFloat(Number(v[2]+b[2]).toFixed(6)));function w(e){const a=new u.ShaderBuilder;a.attributes.add(x.VertexAttribute.POSITION,"vec2"),a.include(o.TextureCoordinateAttribute,{textureCoordinateType:o.TextureCoordinateAttributeType.Default}),a.varyings.add("worldRay","vec3"),a.varyings.add("eyeDir","vec3");const{vertex:r,fragment:y}=a;return r.uniforms.add(new g.Matrix4PassUniform("inverseProjectionMatrix",((e,t)=>t.camera.inverseProjectionMatrix)),new g.Matrix4PassUniform("inverseViewMatrix",((e,a)=>t.invertOrIdentity(S,a.camera.viewMatrix)))),r.code.add(m.glsl`void main(void) {
vec3 posViewNear = (inverseProjectionMatrix * vec4(position, -1, 1)).xyz;
eyeDir = posViewNear;
worldRay = (inverseViewMatrix * vec4(posViewNear, 0)).xyz;
forwardTextureCoordinates();
gl_Position = vec4(position, 1, 1);
}`),y.uniforms.add(new h.Float3PassUniform("backgroundColor",(e=>e.backgroundColor)),new c.Float2PassUniform("radii",(e=>e.radii)),new h.Float3PassUniform("cameraPosition",((e,t)=>t.camera.eye)),new d.Float4PassUniform("heightParameters",(e=>e.heightParameters)),new p.FloatPassUniform("innerFadeDistance",(e=>e.innerFadeDistance)),new p.FloatPassUniform("altitudeFade",(e=>e.altitudeFade)),new f.Texture2DPassUniform("depthTexture",(e=>e.depthTexture)),new p.FloatPassUniform("hazeStrength",(e=>e.hazeStrength))),y.constants.add("betaRayleigh","vec3",v),y.constants.add("betaCombined","vec3",P),y.constants.add("betaMie","float",D),y.constants.add("scaleHeight","float",i.rayLeighScaleHeight*i.atmosphereHeight),n.addMainLightDirection(y),a.include(s.Gamma),e.haze&&y.include(l.ReadDepth),y.code.add(m.glsl`vec2 sphereIntersect(vec3 start, vec3 dir, float radius, bool planet) {
float a = dot(dir, dir);
float b = 2.0 * dot(dir, start);
float c = planet ? heightParameters[1] - radius * radius : heightParameters[2];
float d = (b * b) - 4.0 * a * c;
if (d < 0.0) {
return vec2(1e5, -1e5);
}
return vec2((-b - sqrt(d)) / (2.0 * a), (-b + sqrt(d)) / (2.0 * a));
}`),y.code.add(m.glsl`float chapmanApproximation(float X, float h, float cosZenith) {
float c = sqrt(X + h);
float cExpH = c * exp(-h);
if (cosZenith >= 0.0) {
return cExpH / (c * cosZenith + 1.0);
} else {
float x0 = sqrt(1.0 - cosZenith * cosZenith) * (X + h);
float c0 = sqrt(x0);
return 2.0 * c0 * exp(X - x0) - cExpH / (1.0 - c * cosZenith);
}
}`),y.code.add(m.glsl`float getOpticalDepth(vec3 position, vec3 dir, float h) {
return scaleHeight * chapmanApproximation(radii[0] / scaleHeight, h, dot(normalize(position), dir));
}`),y.code.add(m.glsl`
    const int STEPS = 6;

    vec3 getAtmosphereColour(vec3 cameraPos, vec3 rayDir, vec3 lightDir, float terrainDepth) {
      float reducedPlanetRadius = radii[0] - 20000.0;
      vec2 rayPlanetIntersect = sphereIntersect(cameraPos, rayDir, reducedPlanetRadius, true);
      vec2 rayAtmosphereIntersect = sphereIntersect(cameraPos, rayDir, radii[1], false);
      bool hitsAtmosphere = (rayAtmosphereIntersect.x <= rayAtmosphereIntersect.y) && rayAtmosphereIntersect.x > 0.0;
      bool insideAtmosphere = heightParameters[0] < radii[1];

      if (!(hitsAtmosphere || insideAtmosphere)) {
        return vec3(0);
      }

      bool hitsPlanet = (rayPlanetIntersect.x <= rayPlanetIntersect.y) && rayPlanetIntersect.x > 0.0;

      float start = insideAtmosphere ? 0.0 : rayAtmosphereIntersect.x;

      if (heightParameters[0] < reducedPlanetRadius) {
        // Long light rays from the night side of the planet lead to numerical instability
        // Do not render the atmosphere in such cases
        if (dot(rayDir, normalize(cameraPos)) < -0.025) {
          return vec3(0);
        }
        start = rayPlanetIntersect.y;
      }

      float end = hitsPlanet ? rayPlanetIntersect.x : rayAtmosphereIntersect.y;
      float maxEnd = end;

      ${e.haze?m.glsl`if (terrainDepth != -1.0) { end = terrainDepth; }`:""}

      vec3 samplePoint = cameraPos + rayDir * end;
      float multiplier = hitsPlanet ? -1.0 : 1.0;

      vec3 scattering = vec3(0);
      float scaleFract = (length(samplePoint) - radii[0]) / scaleHeight;
      float lastOpticalDepth = getOpticalDepth(samplePoint, rayDir, scaleFract);
      float stepSize = (end - start) / float(STEPS);
      for (int i = 0; i < STEPS; i++) {
        samplePoint -= stepSize * rayDir;
        scaleFract = (length(samplePoint) - radii[0]) / scaleHeight;
        float opticalDepth = multiplier * getOpticalDepth(samplePoint, rayDir * multiplier, scaleFract);

        if (i > 0) {
          scattering *= ${e.haze?"":m.glsl`mix(2.5, 1.0, clamp((length(cameraPos) - radii[0]) / 50e3, 0.0, 1.0)) * `} exp(-(mix(betaCombined, betaRayleigh, 0.5) + betaMie) * max(0.0, (opticalDepth - lastOpticalDepth)));
        }

        if (dot(normalize(samplePoint), lightDir) > -0.3) {

          float scale = exp(-scaleFract);
          float lightDepth = getOpticalDepth(samplePoint, lightDir, scaleFract);

          scattering += scale * exp(-(betaCombined + betaMie) * lightDepth);
          ${e.haze?"":m.glsl`scattering += scale * exp(-(0.25 * betaCombined ) * lightDepth);`}
        }

        lastOpticalDepth = opticalDepth;

      }

      float mu = dot(rayDir, lightDir);
      float mumu = 1.0 + mu * mu;

      float phaseRayleigh = 0.0596831 * mumu;

      ${e.haze?m.glsl`return 3.0 * scattering * stepSize * phaseRayleigh * betaRayleigh;`:m.glsl`
            const float g = 0.8;
            const float gg = g * g;
            float phaseMie = end == maxEnd ? 0.1193662 * ((1.0 - gg) * mumu) / (pow(1.0 + gg - 2.0 * mu * g, 1.5) * (2.0 + gg)) : 0.0;
            phaseMie = clamp(phaseMie, 0.0, 128.0);
            return 3.0 * scattering * stepSize * (phaseRayleigh * betaRayleigh + 0.025 * phaseMie * betaMie);`}
    }

    ${e.haze?"":m.glsl`
            vec4 applyUndergroundAtmosphere(vec3 rayDir, vec3 lightDirection, vec4 fragColor) {
              vec2 rayPlanetIntersect = sphereIntersect(cameraPosition, rayDir, radii[0], true);
              if (!((rayPlanetIntersect.x <= rayPlanetIntersect.y) && rayPlanetIntersect.y > 0.0)) {
                return fragColor;
              }

              float lightAngle = dot(lightDirection, normalize(cameraPosition + rayDir * max(0.0, rayPlanetIntersect.x)));
              vec4 surfaceColor = vec4(vec3(max(0.0, (smoothstep(-1.0, 0.8, 2.0 * lightAngle)))), 1.0 - altitudeFade);
              float relDist = (rayPlanetIntersect.y - max(0.0, rayPlanetIntersect.x)) / innerFadeDistance;
              if (relDist > 1.0) {
                return surfaceColor;
              }

              return mix(fragColor, surfaceColor, smoothstep(0.0, 1.0, relDist * relDist));
            }

            float getGlow(float dist, float radius, float intensity) {
              return pow(radius / max(dist, 1e-6), intensity);
            }

            vec3 getSun(vec3 cameraPos, vec3 rayDir, vec3 lightDir){

              // Get the amount of atmosphere between camera and the Sun along the view ray
              float scaleFract = (length(cameraPos) - radii[0]) / scaleHeight;
              float sunOpticalDepth = getOpticalDepth(cameraPos, rayDir, max(scaleFract, 0.0));

              // Find the amount of light that remains after travelling through the atmosphere from the Sun along the view ray
              // This will make the colour of the Sun reddish on the horizon and white from space
              vec3 sunTransmittance = exp(-(mix(betaCombined, betaRayleigh, 0.5)) * max(0.0, sunOpticalDepth));

              // Alignment of light direction and view ray
              float mu = clamp(dot(rayDir, lightDir), 0.0, 1.0);
              // Draw the Sun as a bright disc
              float sunDisc = 256.0 * smoothstep(0.0, 128.0, clamp(getGlow(1.0 - mu, 3e-5, 3.0), 0.0, 128.0));

              return normalize(sunTransmittance) * sunDisc;
            }`}

    ${e.haze&&e.reduced?m.glsl`
        float getDepth(vec2 uv){
          return linearDepthFromTexture(depthTexture, uv);
        }

        float textureBilinear(vec2 uv) {
          // Information about the high-resolution depth texture
          vec2 depthTextureSize = vec2(textureSize(depthTexture, 0));
          vec2 texelSize = 1.0 / depthTextureSize;

          // The uv inside the upper right pixel - of the tile of 4 pixels -
          // that the atmosphere uv maps to in the depth texture
          vec2 depthUV = (uv * depthTextureSize) - vec2(0.5);

          // Relative distance of the uv coordinates inside the depth texture pixel
          vec2 f = fract(depthUV);

          // Snap to the centre of the depth texture pixel
          vec2 snapUV = (floor(depthUV) + vec2(0.5)) / depthTextureSize;

          // Read the depth texture pixel and its three neighbours
          float d0 = getDepth(snapUV);
          float d1 = getDepth(snapUV + vec2(texelSize.x, 0.0));
          float d2 = getDepth(snapUV + vec2(0.0, texelSize.y));
          float d3 = getDepth(snapUV + texelSize);

          // Return the bilinearly interpolated value of the neighbouring pixels based
          // on the sample position in the depth texture pixel
          return mix(mix(d0, d1, f.x), mix(d2, d3, f.x), f.y);
        }
        `:""}

    vec3 tonemapACES(vec3 x) {
      return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
    }

    void main() {
      vec3 rayDir = normalize(worldRay);
      float terrainDepth = -1.0;
      ${e.haze?m.glsl`
          float depthSample = texture(depthTexture, vuv0).r;
          if (depthSample != 1.0) {
            vec3 cameraSpaceRay = normalize(eyeDir);
            cameraSpaceRay /= cameraSpaceRay.z;

              ${e.reduced?m.glsl`cameraSpaceRay *= -textureBilinear(vuv0);`:m.glsl`cameraSpaceRay *= -linearDepthFromTexture(depthTexture, vuv0);`}

            terrainDepth = max(0.0, length(cameraSpaceRay));
          }else{
            discard;
          }
          `:m.glsl`${e.reduced?"":m.glsl`
                float depthSample = texture(depthTexture, vuv0).r;
                if (depthSample != 1.0) {
                  fragColor = vec4(0);
                  return;
                }`}`}

      ${e.haze?m.glsl`
            vec3 col = vec3(0);
            float fadeOut = smoothstep(-10000.0, -15000.0, heightParameters[0] - radii[0]);
            if(depthSample != 1.0){
              col = (1.0 - fadeOut) * hazeStrength * getAtmosphereColour(cameraPosition, rayDir, mainLightDirection, terrainDepth);
            }
            // Alpha is ignored for haze blending
            float alpha = 1.0;
            `:m.glsl`
            vec3 col = linearizeGamma(backgroundColor);
            col += getAtmosphereColour(cameraPosition, rayDir, mainLightDirection, terrainDepth);
            col += getSun(cameraPosition, rayDir, mainLightDirection);
            float alpha = smoothstep(0.0, mix(0.15, 0.01, heightParameters[3]), length(col));`}

      col = tonemapACES(col);
      fragColor = delinearizeGamma(vec4(col, alpha));
      ${e.haze?"":m.glsl`fragColor = applyUndergroundAtmosphere(rayDir, mainLightDirection, fragColor);`}
    }
  `),a}const S=a.create(),F=Object.freeze(Object.defineProperty({__proto__:null,betaRayleigh:v,build:w},Symbol.toStringTag,{value:"Module"}));e.ChapmanAtmosphere=F,e.betaRayleigh=v,e.build=w}));
