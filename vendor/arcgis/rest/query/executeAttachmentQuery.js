/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../utils","./operations/queryAttachments","../support/AttachmentQuery"],(function(t,e,r,n){"use strict";async function u(t,u,c){const o=e.parseUrl(t);return r.executeAttachmentQuery(o,n.from(u),{...c}).then((t=>r.processAttachmentQueryResult(o,t)))}t.executeAttachmentQuery=u,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
