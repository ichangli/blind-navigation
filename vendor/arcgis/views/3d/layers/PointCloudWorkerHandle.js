/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../core/workers/WorkerHandle"],(function(t,r){"use strict";class e extends r.WorkerHandle{constructor(t){super("PointCloudWorker","transform",{transform:t=>u(t)},t)}}function u(t){const r=[t.geometryBuffer];if(null!=t.primaryAttributeData&&t.primaryAttributeData.buffer&&r.push(t.primaryAttributeData.buffer),null!=t.modulationAttributeData&&t.modulationAttributeData.buffer&&r.push(t.modulationAttributeData.buffer),null!=t.filterAttributesData)for(const e of t.filterAttributesData)null!=e&&e.buffer&&r.push(e.buffer);for(const e of t.userAttributesData)e.buffer&&r.push(e.buffer);return r}t.PointCloudWorkerHandle=e,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
