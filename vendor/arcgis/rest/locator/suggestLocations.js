/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../request","../utils","../support/SuggestionCandidate","../support/SuggestLocationsParameters"],(function(t,e,s,n,o){"use strict";async function r(t,n,r){const a=s.parseUrl(t),i={...(n=o.from(n)).toJSON(),f:"json"},c=s.encode({...a.query,...i}),g=s.asValidOptions(c,r),p=`${a.path}/suggest`;return e(p,g).then(u)}function u(t){const{data:e}=t;if(!e)return[];const{suggestions:s}=e;return s?s.map((t=>new n(t))):[]}t.suggestLocations=r,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
