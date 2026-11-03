/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../core/urlUtils"],(function(t,i){"use strict";function n(t){return p[e(t)]||g}function e(t){return"json"===t.type?"application/json":"blob"===t.type?t.blob.type:o(t.url)}function o(t){const n=i.getPathExtension(t);return l[n]||a}const p={},a="text/plain",g=p[a],l={png:"image/png",jpeg:"image/jpeg",jpg:"image/jpg",bmp:"image/bmp",gif:"image/gif",json:"application/json",txt:"text/plain",xml:"application/xml",svg:"image/svg+xml",zip:"application/zip",pbf:"application/vnd.mapbox-vector-tile",gz:"application/gzip","bin.gz":"application/octet-stream"};for(const c in l)p[l[c]]=c;t.getResourceContentExtension=n,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
