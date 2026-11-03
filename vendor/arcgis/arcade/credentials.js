/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.30/esri/copyright.txt for details.
*/
define((function(){"use strict";class e{constructor(){this._username="",this._password="",this._token=null}static fromUserName(s,n){const t=new e;return t._username=s,t._password=n,t._token=null,t}static fromArcadeDictionary(s){const n=new e;return s.hasField("username")&&(n._username=s.field("username")),s.hasField("password")&&(n._password=s.field("password")),s.hasField("token")&&(n._token=s.field("token")),n}static fromToken(s){const n=new e;return n._token=s,n}get username(){return this._username}get password(){return this._password}async getToken(){return null===this._token?"No Token Provided":this._token}}return e}));
