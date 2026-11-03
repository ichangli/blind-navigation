/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/tslib.es6","../../../core/accessorSupport/decorators/property","../../../core/has","../../../core/Logger","../../../core/RandomLCG","../../../core/accessorSupport/decorators/subclass","./ColumnTemplateBase","./EditableColumnTemplateMixin"],(function(e,t,r,o,s,c,a,p){"use strict";let l=class extends(p.EditableColumnTemplateMixin(a)){constructor(e){super(e),this.type="column"}};e.__decorate([t.property({type:String,json:{read:!1,write:!0}})],l.prototype,"type",void 0),l=e.__decorate([c.subclass("esri.widgets.FeatureTable.support.ColumnTemplate")],l);return l}));
