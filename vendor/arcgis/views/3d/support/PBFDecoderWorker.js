/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../rest/query/operations/pbfDehydratedFeatureSet","../../../rest/query/operations/pbfQueryUtils"],(function(e,t){"use strict";class r{_parseFeatureQuery(r){const s=new e.DehydratedFeatureSetParserContext(r.options),i=t.parsePBFFeatureQuery(r.buffer,s),n={...i,spatialReference:i.spatialReference?.toJSON(),fields:i.fields?i.fields.map((e=>e.toJSON())):void 0,missingAttributes:s.missingAttributes};return Promise.resolve(n)}}function s(){return new r}return s}));
