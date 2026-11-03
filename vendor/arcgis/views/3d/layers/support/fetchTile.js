/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../core/Logger","../../../../core/promiseUtils","../../../../layers/mixins/RefreshableLayer","../../terrain/terrainUtils"],(function(e,r,t,s,i){"use strict";async function o(e,o,a){const l=e.layer;if(i.useFetchTileForLayer(l)){const s=await l.fetchTile(o[0],o[1],o[2],a);if(t.isAborted(a))throw r.getLogger(e).warnOnce("A call to fetchTile resolved even though the request was aborted. fetchTile should not resolve if options.signal.aborted is true."),t.createAbortError();return s}let n=e.getTileUrl(o);s.isRefreshableLayer(l)&&l.refreshTimestamp&&(n+=`${n.includes("?")?"&":"?"}_ts=${l.refreshTimestamp}`);const c=e.hasMixedImageFormats?"image+type":"image";return a.requester.request(n,c,a)}e.fetchTile=o,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
