/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../support/requestPresets"],(function(t,e){"use strict";class a{constructor(){this._serviceMetadatas=new Map,this._itemDatas=new Map}async fetchServiceMetadata(t,a){const s=this._serviceMetadatas.get(t);if(s)return s;const r=await e.fetchArcGISServiceJSON(t,a);return this._serviceMetadatas.set(t,r),r}async fetchItemData(t){const{id:e}=t;if(!e)return null;const{_itemDatas:a}=this;if(a.has(e))return a.get(e);const s=await t.fetchData();return a.set(e,s),s}async fetchCustomParameters(t,e){const a=await this.fetchItemData(t);return a&&"object"==typeof a&&(e?e(a):a.customParameters)||null}}t.LayerLoadContext=a,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
