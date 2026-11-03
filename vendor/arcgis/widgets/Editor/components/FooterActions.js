/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["require","exports","../../../core/arrayUtils","../../../chunks/componentsUtils","../../support/widgetUtils","../../support/jsxFactory"],(function(t,o,e,s,i,n){"use strict";const c={base:"esri-editor__actions"},r=()=>s.loadCalciteComponents({button:()=>new Promise(((o,e)=>t(["../../../chunks/calcite-button"],o,e)))});function l({buttons:t,key:o}){return n.tsx("div",{class:c.base,key:o??"footer-actions",slot:"footer"},t.filter(e.isSome).map((({disabled:t,onClick:o,label:e,...s},i)=>n.tsx("calcite-button",{disabled:t??!1,key:`action-${i}`,onclick:()=>{t||o()},slot:"footer-actions",width:"full",...s},e))))}o.FooterActions=l,o.css=c,o.loadFooterActionsComponents=r,Object.defineProperty(o,Symbol.toStringTag,{value:"Module"})}));
