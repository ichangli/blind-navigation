/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../core/accessorSupport/layerContainerType","./FeatureReduction","./FeatureReductionBinning","./FeatureReductionCluster","./FeatureReductionSelection"],(function(e,t,n,i,r,o){"use strict";const a={key:"type",base:n.FeatureReduction,typeMap:{selection:o}},u={key:"type",base:n.FeatureReduction,typeMap:{cluster:r,binning:i}},c={types:{key:"type",base:n.FeatureReduction,typeMap:{selection:o,cluster:r,binning:i}},json:{name:"layerDefinition.featureReduction",write:{allowNull:!0},origins:{"web-map":{types:u},"portal-item":{types:u},"web-scene":{types:a,name:"layerDefinition.featureReduction",write:{layerContainerTypes:t.excludeTables}}}}};e.featureReductionProperty=c,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
