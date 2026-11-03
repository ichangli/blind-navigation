/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./AlignPixel.glsl","../shading/MultipassTerrainTest.glsl","../../shaderModules/interfaces"],(function(e,o,t,i){"use strict";function s(e,s){const{vertex:r,fragment:l}=e;r.include(o.AlignPixel),s.multipassEnabled&&e.varyings.add("depth","float"),r.code.add(i.glsl`
  void main(void) {
    vec4 posProjCenter;
    if (dot(position, position) > 0.0) {
      // Render single point to center of the pixel to avoid subpixel filtering to affect the marker color
      ProjectHUDAux projectAux;
      vec4 posProj = projectPositionHUD(projectAux);
      posProjCenter = alignToPixelCenter(posProj, viewport.zw);

      ${s.multipassEnabled?"depth = projectAux.posView.z;":""}
      vec3 vpos = projectAux.posModel;
      if (rejectBySlice(vpos)) {
        // Project out of clip space
        posProjCenter = vec4(1e038, 1e038, 1e038, 1.0);
      }

    } else {
      // Project out of clip space
      posProjCenter = vec4(1e038, 1e038, 1e038, 1.0);
    }

    gl_Position = posProjCenter;
    gl_PointSize = 1.0;
  }
  `),e.include(t.multipassTerrainTest,s),l.code.add(i.glsl`
  void main() {
    fragColor = vec4(1);
    ${s.multipassEnabled?i.glsl`
        if(terrainDepthTest(depth)) {
          fragColor.g = 0.5;
        }`:""}
  }
  `)}e.HUDOcclusionPass=s,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
