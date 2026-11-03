/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./dom"],(function(e,t){"use strict";
/*!
     * All material copyright ESRI, All Rights Reserved, unless otherwise specified.
     * See https://github.com/Esri/calcite-design-system/blob/main/LICENSE.md for details.
     * v2.8.5
     */const n="CALCITE-COMBOBOX-ITEM",o="CALCITE-COMBOBOX-ITEM-GROUP",i=`${n}, ${o}`,l={input:"input",chipInvisible:"chip--invisible",selectionDisplayFit:"selection-display-fit",selectionDisplaySingle:"selection-display-single",listContainer:"list-container",icon:"icon"};function c(e){const t=e.parentElement?.closest(i),n=t?.parentElement?.closest(i);return[t,n].filter((e=>e))}function s(e){return e.ancestors?.filter((e=>"CALCITE-COMBOBOX-ITEM"===e.nodeName))||[]}function r(e){return t.nodeListToArray(e.querySelectorAll("calcite-combobox-item"))}function u(e){return t.nodeListToArray(e.querySelectorAll("calcite-combobox-item")).filter((e=>e.selected)).length>0}function a(e){return document.evaluate("ancestor::calcite-combobox-item | ancestor::calcite-combobox-item-group",e,null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null).snapshotLength}function m(e){return e.includes("single")}e.CSS=l,e.ComboboxChildSelector=i,e.ComboboxItem=n,e.ComboboxItemGroup=o,e.getAncestors=c,e.getDepth=a,e.getItemAncestors=s,e.getItemChildren=r,e.hasActiveChildren=u,e.isSingleLike=m}));
