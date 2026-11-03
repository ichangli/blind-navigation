/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../core/NestedMap","./ExternalRenderNode"],(function(e,r,n){"use strict";class t{constructor(){this._renderers=new r.NestedMap}add(e,r){const t={view:e,setup:"function"==typeof r.setup?e=>r.setup(e):null,dispose:"function"==typeof r.dispose?e=>r.dispose(e):null};"function"==typeof r.render&&(this._renderers.set(e,r,new n.ExternalRenderNode({...t,renderFunc:e=>r.render(e),produces:"opaque-color"})),t.setup=t.dispose=null),"function"==typeof r.renderTransparent&&this._renderers.set(e,r,new n.ExternalRenderNode({...t,renderFunc:e=>r.renderTransparent(e),produces:"transparent-color"}))}remove(e,r){const n=this._renderers.get(e,r);n&&(this._renderers.delete(e,r),n.destroy())}}e.ExternalRendererStore=t,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
