/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./_commonjsHelpers"],(function(t,o){"use strict";var r,n,e,f={exports:{}};r=f,n=function(){function t(t,r,e,f,a){o(t,r,e||0,f||t.length-1,a||n)}function o(t,n,e,f,a){for(;f>e;){if(f-e>600){var i=f-e+1,s=n-e+1,c=Math.log(i),u=.5*Math.exp(2*c/3),h=.5*Math.sqrt(c*u*(i-u)/i)*(s-i/2<0?-1:1);o(t,n,Math.max(e,Math.floor(n-s*u/i+h)),Math.min(f,Math.floor(n+(i-s)*u/i+h)),a)}var l=t[n],p=e,x=f;for(r(t,e,n),a(t[f],l)>0&&r(t,e,f);p<x;){for(r(t,p,x),p++,x--;a(t[p],l)<0;)p++;for(;a(t[x],l)>0;)x--}0===a(t[e],l)?r(t,e,x):r(t,++x,f),x<=n&&(e=x+1),n<=x&&(f=x-1)}}function r(t,o,r){var n=t[o];t[o]=t[r],t[r]=n}function n(t,o){return t<o?-1:t>o?1:0}return t},void 0!==(e=n())&&(r.exports=e);var a=f.exports;const i=o.getDefaultExportFromCjs(a);t.quickselect=i}));
