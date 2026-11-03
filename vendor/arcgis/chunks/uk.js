/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./calcite-input-time-picker"],(function(_,t){"use strict";
/*!
   * All material copyright ESRI, All Rights Reserved, unless otherwise specified.
   * See https://github.com/Esri/calcite-design-system/blob/main/LICENSE.md for details.
   * v2.8.5
   */var e="січня_лютого_березня_квітня_травня_червня_липня_серпня_вересня_жовтня_листопада_грудня".split("_"),s="січень_лютий_березень_квітень_травень_червень_липень_серпень_вересень_жовтень_листопад_грудень".split("_"),n=/D[oD]?(\[[^[\]]*\]|\s)+MMMM?/;function r(_,t){var e=_.split("_");return t%10==1&&t%100!=11?e[0]:t%10>=2&&t%10<=4&&(t%100<10||t%100>=20)?e[1]:e[2]}function M(_,t,e){return"m"===e?t?"хвилина":"хвилину":"h"===e?t?"година":"годину":_+" "+r({ss:t?"секунда_секунди_секунд":"секунду_секунди_секунд",mm:t?"хвилина_хвилини_хвилин":"хвилину_хвилини_хвилин",hh:t?"година_години_годин":"годину_години_годин",dd:"день_дні_днів",MM:"місяць_місяці_місяців",yy:"рік_роки_років"}[e],+_)}var i=function(_,t){return n.test(t)?e[_.month()]:s[_.month()]};i.s=s,i.f=e;var m={name:"uk",weekdays:"неділя_понеділок_вівторок_середа_четвер_п’ятниця_субота".split("_"),weekdaysShort:"ндл_пнд_втр_срд_чтв_птн_сбт".split("_"),weekdaysMin:"нд_пн_вт_ср_чт_пт_сб".split("_"),months:i,monthsShort:"січ_лют_бер_квіт_трав_черв_лип_серп_вер_жовт_лист_груд".split("_"),weekStart:1,relativeTime:{future:"за %s",past:"%s тому",s:"декілька секунд",m:M,mm:M,h:M,hh:M,d:"день",dd:M,M:"місяць",MM:M,y:"рік",yy:M},ordinal:function(_){return _},formats:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY р.",LLL:"D MMMM YYYY р., HH:mm",LLLL:"dddd, D MMMM YYYY р., HH:mm"}};t.d.locale(m,null,!0),_.default=m,Object.defineProperty(_,Symbol.toStringTag,{value:"Module"})}));
