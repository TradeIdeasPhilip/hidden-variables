(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const c of s.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&r(c)}).observe(document,{childList:!0,subtree:!0});function n(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(o){if(o.ep)return;o.ep=!0;const s=n(o);fetch(o.href,s)}})();var a={},i={};Object.defineProperty(i,"__esModule",{value:!0});i.permutations=i.polarToRectangular=i.makeBoundedLinear=i.makeLinear=i.sum=i.countMap=A=i.initializedArray=i.count=i.zip=i.FIGURE_SPACE=i.NON_BREAKING_SPACE=i.dateIsValid=i.MIN_DATE=i.MAX_DATE=i.makePromise=i.filterMap=i.pick=i.pickAny=i.csvStringToArray=i.parseTimeT=i.parseIntX=i.parseFloatX=i.getAttribute=i.followPath=i.parseXml=i.testXml=i.sleep=i.assertClass=void 0;function S(t,e,n="Assertion Failed."){const r=o=>{throw new Error(`${n}  Expected type:  ${e.name}.  Found type:  ${o}.`)};if(t===null)r("null");else if(typeof t!="object")r(typeof t);else if(!(t instanceof e))r(t.constructor.name);else return t;throw new Error("wtf")}i.assertClass=S;function T(t){return new Promise(e=>setTimeout(e,t))}i.sleep=T;function h(t){const n=new DOMParser().parseFromString(t,"application/xml");for(const r of Array.from(n.querySelectorAll("parsererror")))if(r instanceof HTMLElement)return{error:r};return{parsed:n}}i.testXml=h;function P(t){if(t!==void 0)return h(t)?.parsed?.documentElement}i.parseXml=P;function m(t,...e){for(const n of e){if(t===void 0)return;if(typeof n=="number")t=t.children[n];else{const r=t.getElementsByTagName(n);if(r.length!=1)return;t=r[0]}}return t}i.followPath=m;function F(t,e,...n){if(e=m(e,...n),e!==void 0&&e.hasAttribute(t))return e.getAttribute(t)??void 0}i.getAttribute=F;function g(t){if(t==null)return;const e=parseFloat(t);if(isFinite(e))return e}i.parseFloatX=g;function w(t){const e=g(t);if(e!==void 0)return e>Number.MAX_SAFE_INTEGER||e<Number.MIN_SAFE_INTEGER||e!=Math.floor(e)?void 0:e}i.parseIntX=w;function N(t){if(typeof t=="string"&&(t=w(t)),t!=null&&!(t<=0))return new Date(t*1e3)}i.parseTimeT=N;const C=t=>{const e=/(,|\r?\n|\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^,\r\n]*))/gi,n=[[]];let r;for(;r=e.exec(t);)r[1].length&&r[1]!==","&&n.push([]),n[n.length-1].push(r[2]!==void 0?r[2].replace(/""/g,'"'):r[3]);return n};i.csvStringToArray=C;function L(t){const e=t.values().next();if(!e.done)return e.value}i.pickAny=L;function B(t){return t[Math.random()*t.length|0]}i.pick=B;function _(t,e){const n=[];return t.forEach((r,o)=>{const s=e(r,o);s!==void 0&&n.push(s)}),n}i.filterMap=_;function x(){let t,e;return{promise:new Promise((r,o)=>{t=r,e=o}),resolve:t,reject:e}}i.makePromise=x;i.MAX_DATE=new Date(864e13);i.MIN_DATE=new Date(-864e13);function $(t){return isFinite(t.getTime())}i.dateIsValid=$;i.NON_BREAKING_SPACE=" ";i.FIGURE_SPACE=" ";function*X(...t){const e=t.map(n=>n[Symbol.iterator]());for(;;){const n=e.map(r=>r.next());if(n.some(({done:r})=>r))break;yield n.map(({value:r})=>r)}}i.zip=X;function*z(t=0,e=1/0,n=1){for(let r=t;r<e;r+=n)yield r}i.count=z;function y(t,e){const n=[];for(let r=0;r<t;r++)n.push(e(r));return n}var A=i.initializedArray=y;i.countMap=y;function D(t){return t.reduce((e,n)=>e+n,0)}i.sum=D;function O(t,e,n,r){const o=(r-e)/(n-t);return function(s){return(s-t)*o+e}}i.makeLinear=O;function G(t,e,n,r){n<t&&([t,e,n,r]=[n,r,t,e]);const o=(r-e)/(n-t);return function(s){return s<=t?e:s>=n?r:(s-t)*o+e}}i.makeBoundedLinear=G;function H(t,e){return{x:Math.sin(e)*t,y:Math.cos(e)*t}}i.polarToRectangular=H;function*E(t,e=[]){if(t.length==0)yield e;else for(let n=0;n<t.length;n++){const r=t[n],o=[...e,r],s=[...t.slice(0,n),...t.slice(n+1)];yield*E(s,o)}}i.permutations=E;Object.defineProperty(a,"__esModule",{value:!0});a.download=a.createElementFromHTML=a.getHashInfo=a.getAudioBalanceControl=a.getBlobFromCanvas=a.loadDateTimeLocal=u=a.getById=void 0;const v=i;function R(t,e){const n=document.getElementById(t);if(!n)throw new Error("Could not find element with id "+t+".  Expected type:  "+e.name);if(n instanceof e)return n;throw new Error("Element with id "+t+" has type "+n.constructor.name+".  Expected type:  "+e.name)}var u=a.getById=R;function j(t,e,n="milliseconds"){let r;switch(n){case"minutes":{r=e.getSeconds()*1e3+e.getMilliseconds();break}case"seconds":{r=e.getMilliseconds();break}case"milliseconds":{r=0;break}default:throw new Error("wtf")}t.valueAsNumber=+e-e.getTimezoneOffset()*6e4-r}a.loadDateTimeLocal=j;function U(t){const{reject:e,resolve:n,promise:r}=(0,v.makePromise)();return t.toBlob(o=>{o?n(o):e(new Error("blob is null!"))}),r}a.getBlobFromCanvas=U;function V(t){const e=new AudioContext,n=e.createMediaElementSource(t),r=new StereoPannerNode(e,{pan:0});return n.connect(r).connect(e.destination),o=>{r.pan.value=o}}a.getAudioBalanceControl=V;function W(){const t=new Map;return/^#?(.*)$/.exec(location.hash.replace("+","%20"))[1].split("&").forEach(r=>{const o=r.split("=",2);if(o.length==2){const s=decodeURIComponent(o[0]),c=decodeURIComponent(o[1]);t.set(s,c)}}),t}a.getHashInfo=W;function q(t,e){var n=document.createElement("div");return n.innerHTML=t.trim(),(0,v.assertClass)(n.firstChild,e,"createElementFromHTML:")}a.createElementFromHTML=q;function K(t,e){var n=document.createElement("a");if(n.setAttribute("href","data:text/plain;charset=utf-8,"+encodeURIComponent(e)),n.setAttribute("download",t),document.createEvent){var r=document.createEvent("MouseEvents");r.initEvent("click",!0,!0),n.dispatchEvent(r)}else n.click()}a.download=K;function J(t,e){const n=t%e;return n<0?n+Math.abs(e):n}class Q{constructor(e){this.onWake=e,this.callback=this.callback.bind(this),requestAnimationFrame(this.callback)}#e=!1;cancel(){this.#e=!0}callback(e){this.#e||(requestAnimationFrame(this.callback),this.onWake(e))}}class d{static createHighlight(e,n){if(e<0||e>1||!isFinite(e))throw new Error("wtf");if(n<0||n>1||!isFinite(n))throw new Error("wtf");const r=Intl.NumberFormat("en-US",{notation:"standard"}).format,o=.5,s=`0,${-o}`,c=`0,${o}`,f="1",p="0",M=Math.abs(e-o),b=e>=.5?f:p,I=Math.abs(n-o),k=n<=.5?f:p;return`M ${s} A ${r(M)},${o} 3.14159 0 ${b} ${c} A ${r(I)},${o} 3.14159 0 ${k} ${s}`}#e=document.createElementNS("http://www.w3.org/2000/svg","g");get top(){return this.#e}#o=document.createElementNS("http://www.w3.org/2000/svg","circle");#t=document.createElementNS("http://www.w3.org/2000/svg","path");#s=document.createElementNS("http://www.w3.org/2000/svg","circle");constructor(){this.#e.append(this.#o,this.#t,this.#s),this.#e.classList.add("sphere")}#a=0;get yAngle(){return this.#a}set yAngle(e){const n=J(e,2*Math.PI);if(n<Math.PI){const r=(1-Math.cos(n))/2;this.updateWhite(0,r)}else{const r=(1+Math.cos(n))/2;this.updateWhite(r,1)}}#c=0;get zAngle(){return this.#c}set zAngle(e){this.#t.style.transform=`rotate(${e}rad)`}#n=0;get x(){return this.#n}set x(e){this.#n=e,this.#e.style.setProperty("--x",e+"px")}#r=0;get y(){return this.#r}set y(e){this.#r=e,this.#e.style.setProperty("--y",e+"px")}#i=1;get diameter(){return this.#i}set diameter(e){this.#i=e,this.#e.style.setProperty("--diameter",e.toString())}updateWhite(e,n){const r=d.createHighlight(e,n);return this.#t.setAttribute("d",r),r}}{const t=u("overview1",SVGSVGElement),e=new d;e.x=.5,e.y=.5,t.appendChild(e.top)}async function Y(){const t=u("overview2svg",SVGSVGElement),e=new d;e.x=.5,e.y=.5,e.yAngle=Math.PI/2,t.appendChild(e.top);const n=u("overview2text",HTMLDivElement);n.innerText="Orange side pointing to your right."}Y();const Z=u("test",SVGSVGElement),l=A(5,t=>{const e=new d;switch(Z.appendChild(e.top),t){case 0:{e.diameter=2,e.y=2,e.x=1,e.yAngle=Math.PI/4;break}case 1:{e.y=1.5,e.x=2.5,e.yAngle=Math.PI/2;break}case 2:{e.y=2.5,e.x=2.5,e.yAngle=3*Math.PI/2;break}case 3:{e.y=.5,e.x=3.5;break}case 4:{e.y=1.5,e.x=3.5;break}default:throw new Error("wtf")}return e});window.spheres=l;new Q(t=>{l[0].zAngle=t/700,l[3].yAngle=t/831,l[4].zAngle=t/607,l[4].yAngle=t/501});