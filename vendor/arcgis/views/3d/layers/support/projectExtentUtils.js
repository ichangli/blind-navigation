/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../geometry/support/webMercatorUtils","../../../../portal/support/geometryServiceUtils"],(function(e,t,r){"use strict";function l(e){const l=e.view.spatialReference,o=e.layer.fullExtent,n=null!=o&&o.spatialReference;if(null==o||!n)return Promise.resolve(null);if(n.equals(l))return Promise.resolve(o.clone());const s=t.project(o,l);return null!=s?Promise.resolve(s):e.view.state.isLocal?r.projectGeometry(o,l,e.layer.portalItem).then((t=>!e.destroyed&&t?t:null)).catch((()=>null)):Promise.resolve(null)}e.toViewIfLocal=l,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
