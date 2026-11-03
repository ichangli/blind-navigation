/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(e){"use strict";const t=8388607,a=8388608,i=254,s=255,d=0,l=1,r=e=>(e&a)>>>23,g=e=>e&t,n=e=>r(e)===l?i:s;function p(e){return r(e)===l}function y(e,t){return((t?a:0)|e)>>>0}e.aggregateValidFiltersMask=i,e.createDisplayId=y,e.displayIdTexelMask=t,e.displayIdTypeAggregate=l,e.displayIdTypeFeature=d,e.displayIdTypeMask=a,e.getDisplayIdFilterMask=n,e.getDisplayIdTexel=g,e.getDisplayIdType=r,e.isAggregateId=p,e.nonAggregateValidFiltersMask=s,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
