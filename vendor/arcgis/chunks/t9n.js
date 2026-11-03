/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./componentsUtils","./locale"],(function(e,s,n){"use strict";
/*!
     * All material copyright ESRI, All Rights Reserved, unless otherwise specified.
     * See https://github.com/Esri/calcite-design-system/blob/main/LICENSE.md for details.
     * v2.8.5
     */const t={};async function a(e,n){const a=`${n}_${e}`;return t[a]||(t[a]=fetch(s.getAssetPath(`./assets/${n}/t9n/messages_${e}.json`)).then((e=>(e.ok||c(),e.json()))).catch((()=>c()))),t[a]}function c(){throw new Error("could not fetch component message bundle")}function o(e){e.messages={...e.defaultMessages,...e.messageOverrides}}async function i(e){e.defaultMessages=await u(e,e.effectiveLocale),o(e)}async function u(e,s){const{el:t}=e,c=t.tagName.toLowerCase().replace("calcite-","");return a(n.getSupportedLocale(s,"t9n"),c)}async function f(e,s){e.defaultMessages=await u(e,s),o(e)}function g(e){e.onMessagesChange=l}function r(e){e.onMessagesChange=void 0}function l(){o(this)}e.connectMessages=g,e.disconnectMessages=r,e.setUpMessages=i,e.updateMessages=f}));
