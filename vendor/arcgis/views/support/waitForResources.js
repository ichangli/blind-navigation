/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../core/promiseUtils","../../core/reactiveUtils","../../core/scheduling","../../core/accessorSupport/watch"],(function(e,t,r,n){"use strict";function c(e){switch(e.type){case"2d":return o(e);case"3d":if(e)return n.dispatch(),r.debug.dispatch(),t.whenOnce((()=>!e.updating))}return Promise.resolve()}function o(t){const c=e.createResolver();let o=performance.now();const i=()=>(n.dispatch(),r.debug.dispatch(),!t.ready||t.updating||!t.stationary||t.rendering);function s(){if(!t.destroyed&&i())o=null,setTimeout(s,16);else{o||(o=performance.now());performance.now()-o>=100?c():setTimeout(s,16)}}return setTimeout(s,16),c.promise}return c}));
