/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(t){"use strict";
/*!
     * All material copyright ESRI, All Rights Reserved, unless otherwise specified.
     * See https://github.com/Esri/calcite-design-system/blob/main/LICENSE.md for details.
     * v2.8.5
     */class e{constructor(){this._formatterCache=new Map,this._commonDateTimeFormatterOptions={year:"numeric",month:"2-digit",day:"2-digit",timeZoneName:"shortOffset"}}get name(){return"native"}create(t){return new Date(t)}increase(t){const e=864e5;return new Date(t.getTime()+e)}formatToIsoDateString(t){const e=t.getFullYear(),r=t.getMonth()+1,n=t.getDate();return`${e}-${r.toString().padStart(2,"0")}-${n.toString().padStart(2,"0")}`}isoToTimeZone(t,e){const r=this._toDate(t),n=this._getFormatter(e).formatToParts(r),[i]=n.filter((({type:t})=>"timeZoneName"===t)).map((({value:t})=>t)),o=this._getTimeZoneOffsetInMins(i),a=r.getMinutes()-(r.getTimezoneOffset()-o);return r.setMinutes(a),r}same(t,e){return t.getTime()===e.getTime()}_toDate(t){return new Date(t)}_getFormatter(t){let e=this._formatterCache.get(t);return e||(e=new Intl.DateTimeFormat("en-US",{timeZone:t,...this._commonDateTimeFormatterOptions}),this._formatterCache.set(t,e)),e}_getTimeZoneOffsetInMins(t){const[e,...r]=t.slice(3),[n,i]=r.join("").split(":");return("+"===e?1:-1)*(60*Number(n)+Number(i||0))}}t.DateEngine=e,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
