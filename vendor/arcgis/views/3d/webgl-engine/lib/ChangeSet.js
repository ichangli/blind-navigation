/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../../../../core/PooledArray"],(function(e,t){"use strict";class r{constructor(){this.adds=new t,this.removes=new t,this.updates=new t({allocator:e=>e||new s,deallocator:e=>(e.renderGeometry=null,e)})}clear(){this.adds.clear(),this.removes.clear(),this.updates.clear()}prune(){this.adds.prune(),this.removes.prune(),this.updates.prune()}get empty(){return 0===this.adds.length&&0===this.removes.length&&0===this.updates.length}}class s{}class a{constructor(){this.adds=new Array,this.removes=new Array,this.updates=new Array}}e.ChangeSet=r,e.MaterialChangeSet=a,e.RenderGeometryUpdate=s,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
