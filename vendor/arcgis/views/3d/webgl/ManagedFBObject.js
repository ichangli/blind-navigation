/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(e){"use strict";class t{constructor(e,t){this.key=e,this.free=t,this.incarnation=0,this._refCount=1}retain(e=1){this._refCount+=e}release(){return 0===this._refCount?(console.log(`Releasing already released FBO attachment in ${(new Error).stack}`),!0):(--this._refCount,0===this._refCount&&(this.free(),!0))}}var n;e.AttachmentType=void 0,(n=e.AttachmentType||(e.AttachmentType={}))[n.FBO=0]="FBO",n[n.DEPTH=1]="DEPTH",n[n.COLOR=2]="COLOR",e.ManagedFBObject=t,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
