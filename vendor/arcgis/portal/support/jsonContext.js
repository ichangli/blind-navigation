/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../core/urlUtils","../Portal"],(function(e,t,r){"use strict";function o(e,t){return{...n(e,t),readResourcePaths:[]}}function l(e,r,o){const l=t.urlToObject(e.itemUrl);return{...n(e,r),messages:[],writtenProperties:[],blockedRelativeUrls:[],verifyItemRelativeUrls:l?{rootPath:l.path,writtenUrls:[]}:null,resources:o?{toAdd:[],toUpdate:[],toKeep:[],pendingOperations:[]}:null}}function n(e,o){return{origin:o,url:t.urlToObject(e.itemUrl),portal:e.portal||r.getDefault(),portalItem:e}}e.createForItemRead=o,e.createForItemWrite=l,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
