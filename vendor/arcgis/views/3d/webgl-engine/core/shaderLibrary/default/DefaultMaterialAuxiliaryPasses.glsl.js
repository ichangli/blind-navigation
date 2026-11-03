/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../ForwardLinearDepth.glsl","../ShaderOutput","../Slice.glsl","../Transform.glsl","../attributes/NormalAttribute.glsl","../attributes/ObjectAndLayerIdColor.glsl","../attributes/TextureCoordinateAttribute.glsl","../attributes/VertexNormal.glsl","../output/OutputDepth.glsl","../output/OutputHighlight.glsl","../shading/VisualVariables.glsl","../util/AlphaDiscard.glsl","../util/View.glsl","../../shaderModules/interfaces","../../shaderModules/Texture2DPassUniform","../../../lib/basicInterfaces"],(function(e,r,o,t,a,i,l,s,d,u,n,c,p,v,g,m,h){"use strict";function x(e,x){const{vertex:O,fragment:f}=e,T=x.hasColorTexture&&x.alphaDiscardMode!==h.AlphaDiscardMode.Opaque;switch(x.output){case o.ShaderOutput.Depth:v.addProjViewLocalOrigin(O,x),e.include(a.Transform,x),e.include(t.SliceDraw,x),e.include(s.TextureCoordinateAttribute,x),T&&f.uniforms.add(new m.Texture2DPassUniform("tex",(e=>e.texture))),O.code.add(g.glsl`void main(void) {
vpos = getVertexInLocalOriginSpace();
vpos = subtractOrigin(vpos);
vpos = addVerticalOffset(vpos, localOrigin);
gl_Position = transformPosition(proj, view, vpos);
forwardTextureCoordinates();
}`),e.include(p.DiscardOrAdjustAlphaPass,x),f.code.add(g.glsl`
          void main(void) {
            discardBySlice(vpos);
            ${T?g.glsl`
                    vec4 texColor = texture(tex, ${x.hasColorTextureTransform?g.glsl`colorUV`:g.glsl`vuv0`});
                    discardOrAdjustAlpha(texColor);`:""}
          }
        `);break;case o.ShaderOutput.Shadow:case o.ShaderOutput.ShadowHighlight:case o.ShaderOutput.ShadowExcludeHighlight:case o.ShaderOutput.ViewshedShadow:case o.ShaderOutput.ObjectAndLayerIdColor:v.addProjViewLocalOrigin(O,x),e.include(a.Transform,x),e.include(s.TextureCoordinateAttribute,x),e.include(c.VisualVariables,x),e.include(u.OutputDepth,x),e.include(t.SliceDraw,x),e.include(l.ObjectAndLayerIdColor,x),r.addNearFar(e),e.varyings.add("depth","float"),T&&f.uniforms.add(new m.Texture2DPassUniform("tex",(e=>e.texture))),O.code.add(g.glsl`void main(void) {
vpos = getVertexInLocalOriginSpace();
vpos = subtractOrigin(vpos);
vpos = addVerticalOffset(vpos, localOrigin);
gl_Position = transformPositionWithDepth(proj, view, vpos, nearFar, depth);
forwardTextureCoordinates();
forwardObjectAndLayerIdColor();
}`),e.include(p.DiscardOrAdjustAlphaPass,x),f.code.add(g.glsl`
          void main(void) {
            discardBySlice(vpos);
            ${T?g.glsl`
                    vec4 texColor = texture(tex, ${x.hasColorTextureTransform?g.glsl`colorUV`:g.glsl`vuv0`});
                    discardOrAdjustAlpha(texColor);`:""}
            ${x.output===o.ShaderOutput.ObjectAndLayerIdColor?g.glsl`outputObjectAndLayerIdColor();`:g.glsl`outputDepth(depth);`}
          }
        `);break;case o.ShaderOutput.Normal:{v.addProjViewLocalOrigin(O,x),e.include(a.Transform,x),e.include(i.NormalAttribute,x),e.include(d.VertexNormal,x),e.include(s.TextureCoordinateAttribute,x),e.include(c.VisualVariables,x),T&&f.uniforms.add(new m.Texture2DPassUniform("tex",(e=>e.texture))),x.normalType===i.NormalType.ScreenDerivative&&e.varyings.add("vPositionView","vec3");const r=x.normalType===i.NormalType.Attribute||x.normalType===i.NormalType.Compressed;O.code.add(g.glsl`
          void main(void) {
            vpos = getVertexInLocalOriginSpace();

            ${r?g.glsl`vNormalWorld = dpNormalView(vvLocalNormal(normalModel()));`:g.glsl`
                  // Get vertex position in camera space for screen-space derivative normals
                  vPositionView = (view * vec4(vpos, 1.0)).xyz;
                `}
            vpos = subtractOrigin(vpos);
            vpos = addVerticalOffset(vpos, localOrigin);
            gl_Position = transformPosition(proj, view, vpos);
            forwardTextureCoordinates();
          }
        `),e.include(t.SliceDraw,x),e.include(p.DiscardOrAdjustAlphaPass,x),f.code.add(g.glsl`
          void main() {
            discardBySlice(vpos);
            ${T?g.glsl`
                    vec4 texColor = texture(tex, ${x.hasColorTextureTransform?g.glsl`colorUV`:g.glsl`vuv0`});
                    discardOrAdjustAlpha(texColor);`:""}

            ${x.normalType===i.NormalType.ScreenDerivative?g.glsl`vec3 normal = screenDerivativeNormal(vPositionView);`:g.glsl`
                  vec3 normal = normalize(vNormalWorld);
                  if (gl_FrontFacing == false){
                    normal = -normal;
                  }`}
            fragColor = vec4(0.5 + 0.5 * normal, 1.0);
          }
        `);break}case o.ShaderOutput.Highlight:v.addProjViewLocalOrigin(O,x),e.include(a.Transform,x),e.include(s.TextureCoordinateAttribute,x),e.include(c.VisualVariables,x),T&&f.uniforms.add(new m.Texture2DPassUniform("tex",(e=>e.texture))),O.code.add(g.glsl`void main(void) {
vpos = getVertexInLocalOriginSpace();
vpos = subtractOrigin(vpos);
vpos = addVerticalOffset(vpos, localOrigin);
gl_Position = transformPosition(proj, view, vpos);
forwardTextureCoordinates();
}`),e.include(t.SliceDraw,x),e.include(p.DiscardOrAdjustAlphaPass,x),e.include(n.OutputHighlight,x),f.code.add(g.glsl`
          void main() {
            discardBySlice(vpos);
            ${T?g.glsl`
                    vec4 texColor = texture(tex, ${x.hasColorTextureTransform?g.glsl`colorUV`:g.glsl`vuv0`});
                    discardOrAdjustAlpha(texColor);`:""}
            outputHighlight();
          }
        `)}}e.DefaultMaterialAuxiliaryPasses=x,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
