/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["require","exports","../../config","../../core/Logger"],(function(r,t,e,o){"use strict";async function a(t){const a="portalItem"in t?t:{portalItem:t},{fromItem:l}=await new Promise(((t,e)=>r(["../../portal/support/portalLayers"],t,e)));try{return await l(a)}catch(i){const r=a?.portalItem,t=r?.id||"unset",l=r?.portal?.url||e.portalUrl;throw o.getLogger("esri.layers.support.fromPortalItem").error("#fromPortalItem()","Failed to create layer from portal item (portal: '"+l+"', id: '"+t+"')",i),i}}t.fromPortalItem=a,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
