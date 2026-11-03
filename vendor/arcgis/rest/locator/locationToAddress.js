/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../request","../utils","../support/AddressCandidate","../support/LocationToAddressParameters"],(function(e,t,o,r,s){"use strict";async function n(e,r,n){r=s.from(r);const d=o.parseUrl(e),i={...r.toJSON(),f:"json"},c=o.encode({...d.query,...i}),u=o.asValidOptions(c,n),f=`${d.path}/reverseGeocode`;return t(f,u).then(a)}function a({data:e}){if(!e)return;const{address:t,location:o}=e,s=t?.Match_addr||"";return r.fromJSON({address:s,attributes:t||{},location:o,score:100})}e.locationToAddress=n,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
