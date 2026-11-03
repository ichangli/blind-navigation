/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/tslib.es6","../../../core/accessorSupport/decorators/property","../../../core/has","../../../core/Logger","../../../core/RandomLCG","../../../core/accessorSupport/decorators/subclass","./Column"],(function(e,r,o,s,t,c,a){"use strict";let l=class extends a{constructor(e){super(e),this.columns=null,this.sortable=!1}initialize(){this._set("fieldName",`group:${this.label}`)}};e.__decorate([r.property()],l.prototype,"columns",void 0),e.__decorate([r.property({readOnly:!0})],l.prototype,"sortable",void 0),l=e.__decorate([c.subclass("esri.widgets.FeatureTable.Grid.GroupColumn")],l);return l}));
