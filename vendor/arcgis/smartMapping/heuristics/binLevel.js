/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../core/Error"],(function(e){"use strict";const l=[{scale:565,level:9},{scale:9028,level:8},{scale:72224,level:7},{scale:288896,level:6},{scale:2311163,level:5},{scale:18489298,level:4},{scale:73957191,level:3},{scale:295828764,level:2}];async function n(l){if(!l.view)throw new e("bin-level:missing-parameters","'view' parameter is required");return await l.view.when(),{...l}}function r(e){let n=2;for(const r of l)if(!(r.scale<e)){n=r.level;break}return n}async function a(e){const{view:l}=await n(e);return r(l.scale)}return a}));
