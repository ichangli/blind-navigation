/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(t){"use strict";
/*!
     * All material copyright ESRI, All Rights Reserved, unless otherwise specified.
     * See https://github.com/Esri/calcite-design-system/blob/main/LICENSE.md for details.
     * v2.8.5
     */const e="calcite-list",i="calcite-list-item-group",l="calcite-list-item";function n(t){return Array.from(t.assignedElements({flatten:!0}).filter((t=>t.matches(e))))}function s(t){const n=t.assignedElements({flatten:!0}),s=n.filter((t=>t?.matches(i))).map((t=>Array.from(t.querySelectorAll(l)))).reduce(((t,e)=>[...t,...e]),[]),r=n.filter((t=>t?.matches(l)));return[...n.filter((t=>t?.matches(e))).map((t=>Array.from(t.querySelectorAll(l)))).reduce(((t,e)=>[...t,...e]),[]),...s,...r]}function r(t){t.forEach((e=>{e.setPosition=t.indexOf(e)+1,e.setSize=t.length}))}function c(t,e=!1){const i=e?"ancestor::calcite-list-item | ancestor::calcite-list-item-group":"ancestor::calcite-list-item";return document.evaluate(i,t,null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null).snapshotLength}t.getDepth=c,t.getListItemChildLists=n,t.getListItemChildren=s,t.updateListItemChildren=r}));
