/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["./DisplayRecord","./util/serializationUtils"],(function(i,e){"use strict";class t{constructor(i,e){this.id=i,this.sortKey=e,this.records=[]}serialize(i){return i.push(this.id),i.writeF32(this.sortKey),e.serializeList(i,this.records),i}static deserialize(r){const s=r.readInt32(),n=r.readF32(),a=new t(s,n);return a.records=e.deserializeList(r,i)??[],a}}return t.byteSizeHint=2*Uint32Array.BYTES_PER_ELEMENT+i.byteSizeHint,t}));
