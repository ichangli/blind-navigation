/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define(["require","exports"],(function(e,t){"use strict";let n;const o=["blockquote","html","hr","checkbox","table","tablerow","tablecell","image"];async function r(e){return n||await a(),n.parse(e)}async function a(){const{Marked:t}=await new Promise(((t,n)=>e(["../../../chunks/marked.esm"],t,n))),r=e=>`<span style="text-decoration:line-through;">${e}</span>`,a=(e,t,n)=>`<a${null!=e?` href="${e}"`:""}${null!=t?` title="${t}"`:""} target="_blank">${n??""}</a>`,l=()=>"",c={};for(const e of o)c[e]=l;n=new t({renderer:{del:r,link:a,...c}})}t.compileTextElementMarkdownToHTML=r,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
