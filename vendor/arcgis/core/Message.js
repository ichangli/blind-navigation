/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["./object"],(function(t){"use strict";function e(e,s){return e.replaceAll(/\$\{([^\s:}]*)(?::([^\s:}]+))?\}/g,((e,n)=>{if(""===n)return"$";const r=t.getDeepValue(n,s);return(r??"").toString()}))}class s{constructor(t,s,n=void 0){this.name=t,this.details=n,this.message=(s&&e(s,n))??""}toString(){return"["+this.name+"]: "+this.message}}return s}));
