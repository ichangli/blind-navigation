/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["./Dictionary"],(function(e){"use strict";class t extends e{constructor(e,t,i,s,d,l,n){super(),this.attachmentUrl=d,this.declaredClass="esri.arcade.Attachment",this.immutable=!1,this.setField("id",e),this.setField("name",t),this.setField("contenttype",i),this.setField("size",s),this.setField("exifinfo",l),this.setField("keywords",n),this.immutable=!0}deepClone(){return new t(this.field("id"),this.field("name"),this.field("contenttype"),this.field("size"),this.attachmentUrl,this.field("exifinfo")?.deepClone()??null,this.field("keywords"))}}return t}));
