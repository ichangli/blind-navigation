/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../chunks/tslib.es6","../core/Clonable","../core/JSONSupport","../core/accessorSupport/decorators/property","../core/has","../core/Logger","../core/RandomLCG","../core/accessorSupport/decorators/subclass","./geotriggersInfo/support/geotriggerTypes"],(function(e,r,o,s,t,c,p,i,g){"use strict";let n=class extends(r.ClonableMixin(o.JSONSupport)){constructor(e){super(e),this.geotriggers=null}};e.__decorate([s.property({types:[g.types],json:{write:{isRequired:!0}}})],n.prototype,"geotriggers",void 0),n=e.__decorate([i.subclass("esri.webdoc.GeotriggersInfo")],n);return n}));
