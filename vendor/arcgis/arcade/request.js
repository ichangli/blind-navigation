/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../request"],(function(e,n){"use strict";async function o(e,o,t,r,s=null){if(null!==s){if(e=e+="?token="+await s.getToken(),"get"===r.toLowerCase())return n(e,{responseType:"json",query:o});if(o)for(const n in o)e.includes("?")?e+="&":e+="?",e+=encodeURIComponent(n)+"="+encodeURIComponent(o[n]);return n(e,{method:"post",query:t,responseType:"json"})}if("get"===r.toLowerCase())return n(e,{responseType:"json",query:o});if(o)for(const n in o)e.includes("?")?e+="&":e+="?",e+=encodeURIComponent(n)+"="+encodeURIComponent(o[n]);return await n(e,{method:"post",responseType:"json",query:t})}e.serviceRequest=o,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
