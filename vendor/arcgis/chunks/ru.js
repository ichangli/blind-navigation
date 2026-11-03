/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./calcite-input-time-picker"],(function(_,t){"use strict";
/*!
   * All material copyright ESRI, All Rights Reserved, unless otherwise specified.
   * See https://github.com/Esri/calcite-design-system/blob/main/LICENSE.md for details.
   * v2.8.5
   */var e="января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря".split("_"),n="январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь".split("_"),r="янв._февр._мар._апр._мая_июня_июля_авг._сент._окт._нояб._дек.".split("_"),i="янв._февр._март_апр._май_июнь_июль_авг._сент._окт._нояб._дек.".split("_"),s=/D[oD]?(\[[^[\]]*\]|\s)+MMMM?/;function m(_,t){var e=_.split("_");return t%10==1&&t%100!=11?e[0]:t%10>=2&&t%10<=4&&(t%100<10||t%100>=20)?e[1]:e[2]}function M(_,t,e){return"m"===e?t?"минута":"минуту":_+" "+m({mm:t?"минута_минуты_минут":"минуту_минуты_минут",hh:"час_часа_часов",dd:"день_дня_дней",MM:"месяц_месяца_месяцев",yy:"год_года_лет"}[e],+_)}var o=function(_,t){return s.test(t)?e[_.month()]:n[_.month()]};o.s=n,o.f=e;var u=function(_,t){return s.test(t)?r[_.month()]:i[_.month()]};u.s=i,u.f=r;var a={name:"ru",weekdays:"воскресенье_понедельник_вторник_среда_четверг_пятница_суббота".split("_"),weekdaysShort:"вск_пнд_втр_срд_чтв_птн_сбт".split("_"),weekdaysMin:"вс_пн_вт_ср_чт_пт_сб".split("_"),months:o,monthsShort:u,weekStart:1,yearStart:4,formats:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY г.",LLL:"D MMMM YYYY г., H:mm",LLLL:"dddd, D MMMM YYYY г., H:mm"},relativeTime:{future:"через %s",past:"%s назад",s:"несколько секунд",m:M,mm:M,h:"час",hh:M,d:"день",dd:M,M:"месяц",MM:M,y:"год",yy:M},ordinal:function(_){return _},meridiem:function(_){return _<4?"ночи":_<12?"утра":_<17?"дня":"вечера"}};t.d.locale(a,null,!0),_.default=a,Object.defineProperty(_,Symbol.toStringTag,{value:"Module"})}));
