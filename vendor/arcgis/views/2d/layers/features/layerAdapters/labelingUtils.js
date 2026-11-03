/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../../core/screenUtils","./featureReductionUtils","../../support/visualVariableSimpleUtils"],(function(e,n,t,i){"use strict";function l(e){return(e.labelsVisible&&e.labelingInfo?.every((e=>"none"!==e.deconflictionStrategy)))??!1}function o(e,n){const i=t.getEffectiveFeatureReduction(e,n);if(i?.labelsVisible&&i.labelingInfo?.length)return i.labelingInfo.every((e=>"none"!==e.deconflictionStrategy))}function r(e){return t=>n.pt2px(i.getSizeForValueSimple(t,e))}function a(e){const n=null!=e&&"visualVariables"in e&&e.visualVariables;if(!n)return null;for(const t of n)if("size"===t.type)return r(t);return null}e.createLabelVVEvaluator=a,e.getFeatureReductionDeconflictionEnabled=o,e.getLayerDeconflictionEnabled=l,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
