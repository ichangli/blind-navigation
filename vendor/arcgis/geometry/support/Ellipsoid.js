/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["exports"],(function(i){"use strict";class t{constructor(i,t,e,s){this.semiMajorAxis=i,this.flattening=t,this.outerAtmosphereRimWidth=e;const n=1-this.flattening;this.semiMinorAxis=this.semiMajorAxis*n,this.halfSemiMajorAxis=this.semiMajorAxis/2,this.halfCircumference=Math.PI*this.semiMajorAxis,this.metersPerDegree=this.halfCircumference/180,this.inverseFlattening=1/(1-this.flattening)-1,this.eccentricitySquared=s||2*this.flattening-this.flattening*this.flattening,this.meanRadiusSemiAxes=(2*this.semiMajorAxis+this.semiMinorAxis)/3}get radius(){return this.semiMajorAxis}}const e=new t(6378137,1/298.257223563,3e5,.006694379990137799),s=new t(3396190,1/169.8944472236118,23e4),n=new t(1737400,0,0);i.Ellipsoid=t,i.earth=e,i.mars=s,i.moon=n,Object.defineProperty(i,Symbol.toStringTag,{value:"Module"})}));
