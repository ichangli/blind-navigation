/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../core/ObjectPool","./TileKey"],(function(o,l){"use strict";class e{constructor(){this.spans=[]}acquire(o){this.lodInfo=o}release(){this.lodInfo=null,this.spans.length=0}*keys(){const o=this.lodInfo;for(const{row:e,colFrom:n,colTo:s}of this.spans)for(let t=n;t<=s;t++){const n=o.getWorldForColumn(t);yield new l(o.level,e,o.normalizeCol(t),n)}}forEach(o,l){const{spans:e,lodInfo:n}=this,{level:s}=n;if(0!==e.length)for(const{row:t,colFrom:r,colTo:c}of e)for(let e=r;e<=c;e++)o.call(l,s,t,n.normalizeCol(e),n.getWorldForColumn(e))}}return e.pool=new o(e),e}));
