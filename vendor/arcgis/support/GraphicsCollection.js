/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports","../chunks/tslib.es6","../Graphic","../core/Logger","../core/accessorSupport/ensureType","../core/RandomLCG","../core/has","../core/Error","../core/accessorSupport/decorators/shared","../core/accessorSupport/decorators/subclass","../core/support/OwningCollection"],(function(e,r,o,s,c,t,l,a,i,n,p){"use strict";e.GraphicsCollection=class extends p.OwningCollection{_own(e){e.layer&&"remove"in e.layer&&e.layer!==this.owner&&e.layer.remove(e),e.layer=this.owner}_release(e){e.layer===this.owner&&(e.layer=null)}},r.__decorate([i.shared({Type:o,ensureType:c.ensureType(o)})],e.GraphicsCollection.prototype,"itemType",void 0),e.GraphicsCollection=r.__decorate([n.subclass("esri.support.GraphicsCollection")],e.GraphicsCollection),Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
