/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(e){"use strict";function t({associatedLayer:e,serviceUpdateTimeStamp:t}){const n=e?.editingInfo?.lastEditDate,r=e?.serverGens,i=null!=n,s=null!=t,a=i&&s&&t.lastUpdate!==n.getTime();return i&&(a||!s&&r?.minServerGen!==r?.serverGen)}e.cacheIsOutOfSync=t,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
