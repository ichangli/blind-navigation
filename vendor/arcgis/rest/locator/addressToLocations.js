/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../request","../utils","./utils","../support/AddressCandidate","../support/AddressToLocationsParameters"],(function(e,t,s,n,r,a){"use strict";async function o(e,n,r){n=a.from(n);const o=s.parseUrl(e),{address:d,...c}=n.toJSON(),u={...d,...c,f:"json"},f=s.encode({...o.query,...u}),l=s.asValidOptions(f,r),p=`${o.path}/findAddressCandidates`;return t(p,l).then(i)}function i({data:e}){if(!e)return[];const{candidates:t,spatialReference:s}=e;return t?t.map((e=>{if(!e)return;const{extent:t,location:a}=e,o=!t||n.isValidExtent(t);return n.isValidLocation(a)&&o?(t&&(t.spatialReference=s),a&&(a.spatialReference=s),r.fromJSON(e)):void 0})):[]}e.addressToLocations=o,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
