(self.webpackChunklektor_front=self.webpackChunklektor_front||[]).push([[3384],{3384:(e,n,t)=>{"use strict";t.r(n),t.d(n,{GeolocationWeb:()=>i,Geolocation:()=>a});var o=t(8384);class i extends o.Uw{async getCurrentPosition(e){return new Promise((n,t)=>{navigator.geolocation.getCurrentPosition(e=>{n(e)},e=>{t(e)},Object.assign({enableHighAccuracy:!1,timeout:1e4,maximumAge:0},e))})}async watchPosition(e,n){return`${navigator.geolocation.watchPosition(e=>{n(e)},e=>{n(null,e)},Object.assign({enableHighAccuracy:!1,timeout:1e4,maximumAge:0},e))}`}async clearWatch(e){window.navigator.geolocation.clearWatch(parseInt(e.id,10))}async checkPermissions(){if("undefined"==typeof navigator||!navigator.permissions)throw this.unavailable("Permissions API not available in this browser");return{location:(await window.navigator.permissions.query({name:"geolocation"})).state}}async requestPermissions(){throw this.unimplemented("Not implemented on web.")}}const a=new i}}]);