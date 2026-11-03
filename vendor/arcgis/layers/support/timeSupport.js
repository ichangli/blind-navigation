/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../support/timeUtils"],(function(e,t){"use strict";function n(e,n,i){if(null==e?.timeInfo)return null;const{datesInUnknownTimezone:o=!1,timeOffset:l,useViewTime:s}=e;let u=e.timeExtent;o&&(u=t.toLocalTimeExtent(u));let m=s?n&&u?n.intersection(u):n||u:u;return!m||m.isEmpty||m.isAllTime?m:(l&&(m=m.offset(-l.value,l.unit)),o&&(m=t.toUTCTimeExtent(m)),m.equals(i)?i:m)}e.combineTimeExtent=n,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
