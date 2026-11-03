/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../request","../utils","../support/AddressCandidate","../support/AddressesToLocationsParameters"],(function(e,t,s,o,n){"use strict";async function r(e,o,r){o=n.from(o);const c=s.parseUrl(e),i={...o.toJSON?.(),f:"json"},d=s.encode({...c.query,...i}),u=s.asValidOptions(d,r),p=`${c.path}/geocodeAddresses`;return t(p,u).then(a)}function a(e){const{data:t}=e;if(!t)return[];const{locations:s,spatialReference:n}=t;return s?s.map((e=>{const{location:t}=e;return t&&(t.spatialReference=n),o.fromJSON(e)})):[]}e.addressesToLocations=r,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
