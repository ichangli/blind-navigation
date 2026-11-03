/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../PixelBlock","../rasterFormats/pixelRangeUtils"],(function(e,t,i){"use strict";function a(e,a,l){const{pixels:n,width:s,height:r,mask:o,bandMasks:h}=e,c=s*r,g=h?.length?t.combineBandMasks(h):o,p=Math.min(a.length,n.length),d=l.startsWith("f"),f=!d&&l!==e.pixelType,[u,x]=i.getPixelValueRange(l),m=t.createEmptyBand(l,c);for(let t=0;t<r;t++){let e=t*s;for(let t=0;t<s;t++,e++)if(!g||g[e]){let t=0;for(let i=0;i<p;i++)t+=a[i]*n[i][e];d||(t=Math.round(t),f&&(t=t>x?x:t<u?u:t)),m[e]=t}}const y=new t({width:s,height:r,pixels:[m],pixelType:l,mask:g});return y.updateStatistics(),y}e.grayscale=a,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
