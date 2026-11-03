/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","./ContentObjectType","./Geometry"],(function(t,e,n){"use strict";class o extends n.Geometry{constructor(t,n,o,r,i,s){super(t,n,null,e.ContentObjectType.Mesh,s),this.path=o,this.geometrySR=r,this.stencilWidth=i}}var r;function i(t){return"path"in t}t.UpVectorAlignment=void 0,(r=t.UpVectorAlignment||(t.UpVectorAlignment={}))[r.World=0]="World",r[r.Path=1]="Path",t.PathGeometry=o,t.isPathGeometry=i,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
