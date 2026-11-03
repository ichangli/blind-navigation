/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./config","./request","./core/Error","./core/Logger","./core/urlUtils"],(function(e,t,s,o,r,n){"use strict";function i(e,t){return s(a(e),t)}function a(e){if(!t.assetsPath)throw r.getLogger("esri.assets").errorOnce("The API assets location needs to be set using config.assetsPath. More information: https://arcg.is/1OzLe50"),new o("assets:path-not-set","config.assetsPath is not set");return n.join(t.assetsPath,e)}e.fetchAsset=i,e.getAssetUrl=a,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
