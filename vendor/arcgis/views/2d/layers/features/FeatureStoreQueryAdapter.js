/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(e){"use strict";class t{getObjectId(e){return e.getObjectId()}getAttributes(e){return e.readAttributes()}getAttribute(e,t){return e.readAttribute(t)}getAttributeAsTimestamp(e,t){return e.readAttributeAsTimestamp(t)}cloneWithGeometry(e,t){return e}getGeometry(e){return e.readGeometryWorldSpace()}getCentroid(e,t){return e.readCentroidForDisplay()}}t.Shared=new t,e.FeatureStoreQueryAdapter=t,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
