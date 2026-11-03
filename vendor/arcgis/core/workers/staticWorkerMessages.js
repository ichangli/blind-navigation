/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../request","../urlUtils"],(function(e,t,a){"use strict";const s={async request(e,s){const r=e.options,n=r.responseType;r.signal=s?.signal,r.responseType="native"===n||"native-request-init"===n?"native-request-init":n&&["blob","json","text"].includes(n)&&a.getInterceptor(e.url)?.after?n:"array-buffer";const i=await t(e.url,r),o={data:i.data,httpStatus:i.httpStatus,ssl:i.ssl};switch(i.requestOptions?.responseType){case"native-request-init":return delete o.data.signal,o;case"blob":o.data=await o.data.arrayBuffer();break;case"json":o.data=(new TextEncoder).encode(JSON.stringify(o.data)).buffer;break;case"text":o.data=(new TextEncoder).encode(o.data).buffer}return{result:o,transferList:[o.data]}}};e.staticWorkerMessages=s,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
