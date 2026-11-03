/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["require","exports","../icons","../../../chunks/componentsUtils","../../support/widgetUtils","../../support/jsxFactory"],(function(e,s,t,o,n,i){"use strict";const c={notice:"esri-editor__notice"},r=()=>o.loadCalciteComponents({notice:()=>new Promise(((s,t)=>e(["../../../chunks/calcite-notice"],s,t)))});function a({workflow:e,messages:s}){return i.tsx(i.tsxFragment,null,e?.reliesOnOwnerAdminPrivileges?i.tsx(l,{message:s.ownerAdminNotice}):void 0,e?.hasInvalidFormTemplate?i.tsx(l,{icon:t.warningIcon,message:s.formFieldUpdateError}):void 0)}function l({message:e,...s}){return i.tsx("calcite-notice",{class:c.notice,open:!0,scale:"s",...s},i.tsx("div",{slot:"message"},e))}s.Notice=l,s.Notices=a,s.css=c,s.loadNoticesComponents=r,Object.defineProperty(s,Symbol.toStringTag,{value:"Module"})}));
