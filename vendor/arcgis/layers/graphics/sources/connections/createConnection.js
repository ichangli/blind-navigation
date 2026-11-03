/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./GeoEventConnection","./WebSocketConnection","../../../support/ClientSideConnection"],(function(e,n,t,o){"use strict";function r(e,n){if(null==e&&null==n)return null;const t={};return null!=n&&(t.geometry=n),null!=e&&(t.where=e),t}function i(e,i,c,l,s,u,a,f,p){const m={source:e,sourceSpatialReference:i,spatialReference:c,geometryType:l,filter:r(s,u),maxReconnectionAttempts:a,maxReconnectionInterval:f,customParameters:p};if(!e)return new o.ClientSideConnection(m);return e.path.startsWith("wss://")||e.path.startsWith("ws://")?new t.WebSocketConnection(m):new n(m)}e.createConnection=i,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
