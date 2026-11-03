/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["../../engine/webgl/enums","./AGraphicContainer","../support/util"],(function(e,r,i){"use strict";class t extends r.AGraphicContainer{renderChildren(r){for(const e of this.children)e.setTransform(r.state);if(super.renderChildren(r),this.attributeView.update(),this.children.some((e=>e.hasData))){switch(r.drawPhase){case e.WGLDrawPhase.MAP:this._renderChildren(r,e.FeatureSelection.All);break;case e.WGLDrawPhase.HIGHLIGHT:this.hasHighlight&&this._renderHighlight(r)}this._boundsRenderer&&this._boundsRenderer.doRender(r)}}_renderHighlight(r){i.renderHighlight(r,!1,(r=>{this._renderChildren(r,e.FeatureSelection.Highlight)}))}}return t}));
