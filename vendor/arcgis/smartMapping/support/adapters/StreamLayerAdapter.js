/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../../chunks/tslib.es6","../../../core/Logger","../../../core/has","../../../core/RandomLCG","../../../core/Error","../../../core/accessorSupport/decorators/subclass","../../../layers/support/fieldUtils","../utils","./InMemoryLayerAdapter","./support/utils","../../../statistics/utils"],(function(t,s,e,r,a,i,o,u,c,l,m){"use strict";let n=class extends c{async _summaryStatsFromClientQuery(t,s){const{signal:e,view:r}=t,a=l.getSummaryStatsQuery(this,t,s);a.outStatistics=a.outStatistics?.filter((t=>"totalcount_value"!==t.outStatisticFieldName));const i=await this._fetchFeatureSetFromMemory(a,r,e),c=l.getSummaryStatisticsFromFeatureSet(i,u.isAnyDateField(s)||o.isTimeOnlyField(s));return m.processSummaryStatisticsResult(c)}};n=t.__decorate([i.subclass("esri.smartMapping.support.adapters.StreamLayerAdapter")],n);return n}));
