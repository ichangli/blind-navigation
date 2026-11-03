/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define((function(){"use strict";class t{constructor(t=e){this._data=[],this._compare=t}get size(){return this._data.length}enqueue(t){if(null==t)return;const{_data:e,_compare:n}=this;e.push(t);let l=e.length-1>>>0;const r=e[l];for(;l>0;){const t=l-1>>1,s=e[t];if(!(n(s,r)<=0))break;e[t]=r,e[l]=s,l=t}}dequeue(){const{_data:t,_compare:e}=this,n=t[0],l=t.pop();if(0===t.length)return n;t[0]=l;let r=0;const s=t.length,u=t[0];let o,c,a=null;for(;;){const n=2*r+1,l=2*r+2;if(a=null,n<s&&(o=t[n],e(o,u)>0&&(a=n)),l<s&&(c=t[l],(null===a&&e(c,u)<=0||null!==a&&e(c,o)<=0)&&(a=l)),null===a)break;t[r]=t[a],t[a]=u,r=a}return n}}const e=(t,e)=>t<e?-1:t>e?1:0;return t}));
