/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../core/Error","../../core/promiseUtils"],(function(e,r,t){"use strict";async function o(e,o,a){let c;try{c=await createImageBitmap(e)}catch(i){throw new r("request:server",`Unable to load ${o}`,{url:o,error:i})}return t.throwIfAborted(a),c}async function a(e,o,a,c,i){let n;try{n=await createImageBitmap(e)}catch(l){throw new r("request:server",`Unable to load tile ${o}/${a}/${c}`,{error:l,level:o,row:a,col:c})}return t.throwIfAborted(i),n}e.createBitmap=o,e.createTileBitmap=a,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
