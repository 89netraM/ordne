if(!self.define){let e,i={};const f=(f,t)=>(f=new URL(f+".js",t).href,i[f]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=f,e.onload=i,document.head.appendChild(e)}else e=f,importScripts(f),i()})).then((()=>{let e=i[f];if(!e)throw new Error(`Module ${f} didn’t register its module`);return e})));self.define=(t,n)=>{const s=e||("document"in self?document.currentScript.src:"")||location.href;if(i[s])return;let c={};const d=e=>f(e,s),r={module:{uri:s},exports:c,require:d};i[s]=Promise.all(t.map((e=>r[e]||d(e)))).then((e=>(n(...e),c)))}}define(["./workbox-873c5e43"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"index.js",revision:"3054f63c0abe7f8e73fd20e2dcdfa1dc"},{url:"index.js.LICENSE.txt",revision:"fb6fca4f0fa26a7e27d26480a74532c9"},{url:"static/fav-128.png",revision:"5db4545d84bc9c6fc027afa5fb9726c3"},{url:"static/fav-256.png",revision:"8f7798b29605195ddd0f61abde18d7d8"},{url:"static/fav-32.png",revision:"ee7f04e8ef5fe4bb6147adac357e6be4"},{url:"static/fav-64.png",revision:"d2cf586cf13b0b7c7741da3c6c2d4afe"},{url:"static/image.png",revision:"cf560a245b0d0bb8d31def445f7047ea"},{url:"static/manifest.webmanifest",revision:"affb517f9d8d08d0a9d78a1107488767"}],{})}));
