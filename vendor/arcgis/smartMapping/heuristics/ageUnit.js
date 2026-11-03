/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../core/Error","../statistics/summaryStatisticsForAge","../statistics/support/ageUtils","../support/utils"],(function(t,i,s,n){"use strict";function a(t){const i=Math.abs(t.avg);let a=null;return s.supportedAgeUnits.some((t=>{const s=n.unitValueInDays[t];return i>2*s&&(a=t),!!a})),a}async function u(s){const n="days",u={...s,unit:n},e=await i(u);if(null==e.avg)throw new t("age-unit:insufficient-info","'avg' statistics is invalid");const r=a({...e,avg:e.avg});if(r===n)return{unit:r,statistics:e};u.unit=r;const c=await i(u);if(null==c.avg)throw new t("age-unit:insufficient-info","'avg' statistics is invalid");return{unit:r,statistics:c}}return u}));
