/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./ArcadeModule","../chunks/languageUtils"],(function(e,r,a){"use strict";function t(e){i=e}let i;function n(e){return null===e?null:a.isDate(e)?e.clone():a.isSimpleType(e)?e:a.isGeometry(e)?e.clone():a.isImmutableArray(e)?e.toArray().map((e=>n(e))):a.isArray(e)?e.map((e=>n(e))):a.isFeature(e)?i.createFromArcadeFeature(e):a.isFeatureSetCollection(e)||a.isFeatureSet(e)?e:a.isDictionary(e)||"esri.arcade.Attachment"===e?.declaredClass?e.deepClone():("esri.arcade.Portal"===e?.declaredClass||a.isKnowledgeGraph(e)||e instanceof r.ArcadeModule||a.isFunctionParameter(e),e)}e.configureDeepClone=t,e.deepClone=n,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
