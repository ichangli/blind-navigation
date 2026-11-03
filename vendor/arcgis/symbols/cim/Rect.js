/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define((function(){"use strict";class t{constructor(t=0,i=0,h=0,s=0){this.x=t,this.y=i,this.width=h,this.height=s}static fromExtent(i){return new t(i.xmin,-i.ymax,i.xmax-i.xmin,i.ymax-i.ymin)}get isEmpty(){return this.width<=0||this.height<=0}union(t){this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.width=Math.max(this.width,t.width),this.height=Math.max(this.height,t.height)}}return t}));
