(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))c(s);new MutationObserver(s=>{for(const l of s)if(l.type==="childList")for(const d of l.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&c(d)}).observe(document,{childList:!0,subtree:!0});function i(s){const l={};return s.integrity&&(l.integrity=s.integrity),s.referrerPolicy&&(l.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?l.credentials="include":s.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function c(s){if(s.ep)return;s.ep=!0;const l=i(s);fetch(s.href,l)}})();var k={},g={};(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.countMap=e.Random=e.phi=e.radiansPerDegree=e.degreesPerRadian=e.FULL_CIRCLE=e.FIGURE_SPACE=e.NON_BREAKING_SPACE=e.MIN_DATE=e.MAX_DATE=e.csvStringToArray=void 0,e.assertClass=n,e.sleep=i,e.testXml=c,e.parseXml=s,e.followPath=l,e.getAttribute=d,e.parseFloatX=u,e.parseIntX=f,e.parseTimeT=p,e.pickAny=v,e.pick=A,e.take=M,e.filterMap=I,e.makePromise=$,e.dateIsValid=R,e.angleBetween=w,e.positiveModulo=y,e.rotateArray=N,e.rectUnion=O,e.rectAddPoint=U,e.dateToFileName=V,e.lerp=W,e.assertFinite=j,e.shuffleArray=Y,e.zip=Z,e.count=x,e.initializedArray=G,e.sum=K,e.makeLinear=J,e.makeBoundedLinear=Q,e.polarToRectangular=ee,e.permutations=H;function n(t,r,o="Assertion Failed."){const a=h=>{throw new Error(`${o}  Expected type:  ${r.name}.  Found type:  ${h}.`)};if(t===null)a("null");else if(typeof t!="object")a(typeof t);else if(!(t instanceof r))a(t.constructor.name);else return t;throw new Error("wtf")}function i(t){return new Promise(r=>{setTimeout(r,t)})}function c(t){const o=new DOMParser().parseFromString(t,"application/xml");for(const a of Array.from(o.querySelectorAll("parsererror")))if(a instanceof HTMLElement)return{error:a};return{parsed:o}}function s(t){if(t!==void 0)return c(t)?.parsed?.documentElement}function l(t,...r){for(const o of r){if(t===void 0)return;if(typeof o=="number")t=t.children[o];else{const a=t.getElementsByTagName(o);if(a.length!=1)return;t=a[0]}}return t}function d(t,r,...o){if(r=l(r,...o),r!==void 0&&r.hasAttribute(t))return r.getAttribute(t)??void 0}function u(t){if(t==null)return;const r=+t;if(isFinite(r))return r}function f(t){const r=u(t);if(r!==void 0)return r>Number.MAX_SAFE_INTEGER||r<Number.MIN_SAFE_INTEGER||r!=Math.floor(r)?void 0:r}function p(t){if(typeof t=="string"&&(t=f(t)),t!=null&&!(t<=0))return new Date(t*1e3)}const S=t=>{const r=/(,|\r?\n|\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^,\r\n]*))/gi,o=[[]];let a;for(;a=r.exec(t);)a[1].length&&a[1]!==","&&o.push([]),o[o.length-1].push(a[2]!==void 0?a[2].replace(/""/g,'"'):a[3]);return o};e.csvStringToArray=S;function v(t){const r=t.values().next();if(!r.done)return r.value}function A(t){if(t.length==0)throw new Error("wtf");return t[Math.random()*t.length|0]}function M(t){if(t.length<1)throw new Error("wtf");const r=Math.random()*t.length|0;return t.splice(r,1)[0]}function I(t,r){const o=[];return t.forEach((a,h)=>{const m=r(a,h);m!==void 0&&o.push(m)}),o}function $(){let t,r;return{promise:new Promise((a,h)=>{t=a,r=h}),resolve:t,reject:r}}e.MAX_DATE=new Date(864e13),e.MIN_DATE=new Date(-864e13);function R(t){return isFinite(t.getTime())}e.NON_BREAKING_SPACE=" ",e.FIGURE_SPACE=" ",e.FULL_CIRCLE=2*Math.PI,e.degreesPerRadian=360/e.FULL_CIRCLE,e.radiansPerDegree=e.FULL_CIRCLE/360,e.phi=(1+Math.sqrt(5))/2;function w(t,r){const o=y(t,e.FULL_CIRCLE);let h=y(r,e.FULL_CIRCLE)-o;const m=e.FULL_CIRCLE/2;if(h>m?h-=e.FULL_CIRCLE:h<-m&&(h+=e.FULL_CIRCLE),Math.abs(h)>m)throw new Error("wtf");return h}function y(t,r){const o=t%r;return o<0?o+Math.abs(r):o}function N(t,r){if((r|0)!=r)throw new Error(`invalid input: ${r}`);return r=y(r,t.length),r==0?t:[...t.slice(r),...t.slice(0,r)]}class F{static sfc32(r,o,a,h){return function(){r|=0,o|=0,a|=0,h|=0;let m=(r+o|0)+h|0;return h=h+1|0,r=o^o>>>9,o=a+(a<<3)|0,a=a<<21|a>>>11,a=a+m|0,(m>>>0)/4294967296}}static#e=42;static create(r=this.newSeed()){console.info(r);const o=JSON.parse(r);if(!(o instanceof Array))throw new Error("invalid seed");if(o.length!=4)throw new Error("invalid seed");const[a,h,m,D]=o;if(!(typeof a=="number"&&typeof h=="number"&&typeof m=="number"&&typeof D=="number"))throw new Error("invalid seed");return this.sfc32(a,h,m,D)}static newSeed(){const r=[];return r.push(Date.now()),r.push(this.#e++),r.push(Math.random()*2**31|0),r.push(Math.random()*2**31|0),JSON.stringify(r)}}e.Random=F;function O(t,r){const o=Math.min(t.x,r.x),a=Math.min(t.y,r.y),h=Math.max(t.x+t.width,r.x+r.width),m=Math.max(t.y+t.height,r.y+r.height),D=h-o,te=m-a;return{x:o,y:a,width:D,height:te}}function U(t,r,o){return O(t,{x:r,y:o,width:0,height:0})}function V(t){return isNaN(t.getTime())?"0000⸱00⸱00 00⦂00⦂00":`${t.getFullYear().toString().padStart(4,"0")}⸱${(t.getMonth()+1).toString().padStart(2,"0")}⸱${t.getDate().toString().padStart(2,"0")} ${t.getHours().toString().padStart(2,"0")}⦂${t.getMinutes().toString().padStart(2,"0")}⦂${t.getSeconds().toString().padStart(2,"0")}`}function W(t,r,o){return t+(r-t)*o}function j(...t){t.forEach(r=>{if(!isFinite(r))throw new Error("wtf")})}function Y(t){for(let r=t.length-1;r>0;r--){const o=Math.floor(Math.random()*(r+1));[t[r],t[o]]=[t[o],t[r]]}return t}function*Z(...t){const r=t.map(o=>o[Symbol.iterator]());for(;;){const o=r.map(a=>a.next());if(o.some(({done:a})=>a))break;yield o.map(({value:a})=>a)}}function*x(t=0,r=1/0,o=1){for(let a=t;a<r;a+=o)yield a}function G(t,r){const o=[];for(let a=0;a<t;a++)o.push(r(a));return o}e.countMap=G;function K(t){return t.reduce((r,o)=>r+o,0)}function J(t,r,o,a){const h=(a-r)/(o-t);return function(m){return(m-t)*h+r}}function Q(t,r,o,a){o<t&&([t,r,o,a]=[o,a,t,r]);const h=(a-r)/(o-t);return function(m){return m<=t?r:m>=o?a:(m-t)*h+r}}function ee(t,r){return{x:Math.cos(r)*t,y:Math.sin(r)*t}}function*H(t,r=[]){if(t.length==0)yield r;else for(let o=0;o<t.length;o++){const a=t[o],h=[...r,a],m=[...t.slice(0,o),...t.slice(o+1)];yield*H(m,h)}}})(g);Object.defineProperty(k,"__esModule",{value:!0});var P=k.AnimationLoop=void 0,T=k.getById=ne;k.loadDateTimeLocal=re;k.getBlobFromCanvas=oe;k.getAudioBalanceControl=ie;k.getHashInfo=se;k.createElementFromHTML=ae;k.download=ce;const X=g;function ne(e,n){const i=document.getElementById(e);if(!i)throw new Error("Could not find element with id "+e+".  Expected type:  "+n.name);if(i instanceof n)return i;throw new Error("Element with id "+e+" has type "+i.constructor.name+".  Expected type:  "+n.name)}function re(e,n,i="milliseconds"){let c;switch(i){case"minutes":{c=n.getSeconds()*1e3+n.getMilliseconds();break}case"seconds":{c=n.getMilliseconds();break}case"milliseconds":{c=0;break}default:throw new Error("wtf")}e.valueAsNumber=+n-n.getTimezoneOffset()*6e4-c}function oe(e){const{reject:n,resolve:i,promise:c}=(0,X.makePromise)();return e.toBlob(s=>{s?i(s):n(new Error("blob is null!"))}),c}function ie(e){const n=new AudioContext,i=n.createMediaElementSource(e),c=new StereoPannerNode(n,{pan:0});return i.connect(c).connect(n.destination),s=>{c.pan.value=s}}function se(){const e=new Map;return/^#?(.*)$/.exec(location.hash.replace("+","%20"))[1].split("&").forEach(c=>{const s=c.split("=",2);if(s.length==2){const l=decodeURIComponent(s[0]),d=decodeURIComponent(s[1]);e.set(l,d)}}),e}function ae(e,n){var i=document.createElement("div");return i.innerHTML=e.trim(),(0,X.assertClass)(i.firstChild,n,"createElementFromHTML:")}function ce(e,n){var i=document.createElement("a");if(i.setAttribute("href","data:text/plain;charset=utf-8,"+encodeURIComponent(n)),i.setAttribute("download",e),document.createEvent){var c=document.createEvent("MouseEvents");c.initEvent("click",!0,!0),i.dispatchEvent(c)}else i.click()}class le{onWake;constructor(n){this.onWake=n,this.callback=this.callback.bind(this),requestAnimationFrame(this.callback)}#e=!1;cancel(){this.#e=!0}callback(n){this.#e||(requestAnimationFrame(this.callback),this.onWake(n))}}P=k.AnimationLoop=le;function de(e,n){if(isNaN(e.slope)||isNaN(n.slope)||e.slope==n.slope)return;const i=e.slope==1/0||e.slope==-1/0,c=n.slope==1/0||n.slope==-1/0;if(i&&c)return;const s=i?e.x0:c?n.x0:(n.y0-n.slope*n.x0-e.y0+e.slope*e.x0)/(e.slope-n.slope),l=i?n.slope*(s-n.x0)+n.y0:e.slope*(s-e.x0)+e.y0;return{x:s,y:l}}const L=Math.PI,C=2*L,E=L/2,q=E/2;function ue(e){const n=g.initializedArray(e+1,s=>{const l=s/e,d=3*E-l*C,u=g.polarToRectangular(.5,d),f=d-E;return{t:l,point:u,direction:f}});return g.initializedArray(e,s=>({from:n[s],to:n[s+1]})).map(s=>{const l=de({x0:s.from.point.x,y0:s.from.point.y,slope:Math.tan(s.from.direction)},{x0:s.to.point.x,y0:s.to.point.y,slope:Math.tan(s.to.direction)});if(!l)throw new Error("wtf");return{controlPoint:l,segment:s}})}const _=ue(10);window.CIRCLE=_;class b{randomizeDirection(){this.yAngle=Math.random()*C-L,this.zAngle=Math.random()*C-L}async randomizeDirectionAndAnimate(n){const i=performance.now(),c=i+n,s=["yAngle","zAngle"].map(l=>{const d=this[l],u=(Math.random()*5|0)-2,f=Math.random()*C-L,p=f+u*C,S=g.makeBoundedLinear(i,d,c,p),v=new P(A=>{this[l]=S(A)});return{property:l,animationLoop:v,newAngle:f}});await g.sleep(n),s.forEach(({property:l,animationLoop:d,newAngle:u})=>{d.cancel(),this[l]=u})}static FORMAT=Intl.NumberFormat("en-US",{notation:"standard"}).format;static createHighlight(n,i){if(n<0||n>1||!isFinite(n))throw new Error("wtf");if(i<0||i>1||!isFinite(i))throw new Error("wtf");const c=g.makeLinear(0,1,1,-1),s=g.makeLinear(1,1,0,-1);return this.squashedCircle(c(n),s(i),"real")}static squashedCircle(n,i,c){const s=_.length/2,l=_.map(({controlPoint:u,segment:f},p)=>{const S=p<s?n:i,v={x:u.x*S,y:u.y},A=f.to.point,M={x:A.x*S,y:A.y};return{control:v,final:M}}),d=this.FORMAT;switch(c){case"real":{const u=l.at(-1).final;let f=`M ${d(u.x)}, ${d(u.y)} `;return l.forEach(p=>{f+=`Q ${d(p.control.x)},${d(p.control.y)} ${d(p.final.x)},${d(p.final.y)} `}),f}case"vertices":{let u="";return l.forEach(f=>{u+=`M ${d(f.final.x)},${d(f.final.y)} L ${d(f.final.x)},${d(f.final.y)} `}),u}case"control points":{let u="";return l.forEach(f=>{u+=`M ${d(f.control.x)},${d(f.control.y)} L ${d(f.control.x)},${d(f.control.y)} `}),u}case"control poly":{const u=l.at(-1).control;let f=`M ${d(u.x)}, ${d(u.y)} `;return l.forEach(p=>{f+=`L ${d(p.control.x)},${d(p.control.y)} `}),f}case"vectors":{let f="";return _.forEach((p,S)=>{const{point:v,direction:A}=p.segment.to,M=g.polarToRectangular(.2,A);f+=`M ${d(v.x)},${d(v.y)} L ${d(v.x+M.x)},${d(v.y+M.y)} `}),f+this.squashedCircle(1,1,"control points")}default:throw new Error("wtf")}}#e=document.createElementNS("http://www.w3.org/2000/svg","g");get top(){return this.#e}#r=document.createElementNS("http://www.w3.org/2000/svg","circle");#t=document.createElementNS("http://www.w3.org/2000/svg","path");#n=document.createElementNS("http://www.w3.org/2000/svg","circle");get listener(){return this.#n}constructor(){this.#e.append(this.#r,this.#t,this.#n),this.#e.classList.add("sphere")}#o=0;get yAngle(){return this.#o}set yAngle(n){const i=g.positiveModulo(n,C);if(i<L){const c=(1-Math.cos(i))/2;this.updateWhite(0,c)}else{const c=(1+Math.cos(i))/2;this.updateWhite(c,1)}this.#o=n,this.updateDetectors(...this.#s)}#i=0;get zAngle(){return this.#i}set zAngle(n){this.#t.style.transform=`rotate(${n}rad)`,this.#i=n,this.updateDetectors(...this.#s)}#a=0;get x(){return this.#a}set x(n){this.#a=n,this.#e.style.setProperty("--x",n+"px")}#c=0;get y(){return this.#c}set y(n){this.#c=n,this.#e.style.setProperty("--y",n+"px")}#l=1;get diameter(){return this.#l}set diameter(n){this.#l=n,this.#e.style.setProperty("--diameter",n.toString())}updateWhite(n,i){const c=b.createHighlight(n,i);return this.#t.setAttribute("d",c),c}#s=[];addDetector(n=0){const i=new fe(this.top);this.#s.push(i),i.direction=n;const c=this.updateDetectors.bind(this);return c(i),{get direction(){return i.direction},set direction(l){i.direction=l,c(i)},get orange(){return i.orange}}}updateDetectors(...n){if(n.length>0){const i=g.positiveModulo(this.#o,C)>L,c=g.positiveModulo(this.#i+(i?L:0),C);n.forEach(s=>{const d=g.positiveModulo(c-s.direction+E,C)<L;s.orange=d})}}}class fe{#e=document.createElementNS("http://www.w3.org/2000/svg","g");#r=document.createElementNS("http://www.w3.org/2000/svg","circle");constructor(n){const i=document.createElementNS("http://www.w3.org/2000/svg","polygon"),c=this.#r;this.#e.append(i,c),n.appendChild(this.#e),i.setAttribute("points","0.5 0,  0.6 -0.06,  0.6 -0.02,  0.77 -0.02,  0.77 0.02,  0.6 0.02,  0.6 0.06"),c.style.strokeWidth="0.03",c.style.stroke="black",c.style.fill="",c.cx.baseVal.value=.77,c.cy.baseVal.value=0,c.r.baseVal.value=.07}#t=!0;get orange(){return this.#t}set orange(n){this.#r.style.fill=n?"#ff7d00":"white"}#n=0;get direction(){return this.#n}set direction(n){this.#n=n,this.#e.style.transform=`rotate(${b.FORMAT(n)}rad)`}}{const e=T("overview1",SVGSVGElement),n=new b;n.x=.5,n.y=.5,e.appendChild(n.top)}async function he(){const e=[[{description:"<u>toward you</u>",yAngle:0},{description:"<u>away</u> from you",yAngle:L}],[{description:"<u>up</u> <canvas data-up-arrow></canvas>",yAngle:E,zAngle:-E},{description:"<u>down</u> <canvas data-down-arrow></canvas>",yAngle:E,zAngle:E}],[{description:"to your <u>left</u> <canvas data-left-arrow></canvas>",yAngle:E,zAngle:L},{description:"to your <u>right</u> <canvas data-right-arrow></canvas>",yAngle:E,zAngle:0}]],n=T("overview2svg",SVGSVGElement),i=new b;i.x=.5,i.y=.5,n.appendChild(i.top);const c=T("overview2text",HTMLDivElement);async function s(d,u){c.innerHTML=`The <span class="orange">orange</span> side is pointing <span class="fade-in">${u.description}</span>.`;const p=performance.now(),S=p+2e3,v=g.makeBoundedLinear(p,d.yAngle,S,u.yAngle);let A;d.zAngle===void 0?u.zAngle===void 0?i.zAngle=Math.random()*C:i.zAngle=u.zAngle:u.zAngle===void 0||(A=g.makeBoundedLinear(p,d.zAngle,S,u.zAngle));const M=new P(I=>{i.yAngle=v(I),A&&(i.zAngle=A(I))});await g.sleep(2e3),M.cancel(),i.yAngle=u.yAngle,typeof u.zAngle=="number"&&(i.zAngle=u.zAngle),await g.sleep(1e3)}let l={description:"",yAngle:0};for(;;){let d=function(w,y){let N=y-w;const F=N*.2;return w+=F,y-=F,N=y-w,Math.random()*N+w},u=function(w,y){function N(U){return g.makeBoundedLinear(0,.2,E,.4)(Math.abs(U-E))}let F=y-w;return w+=N(w)*F,y-=N(y)*F,F=y-w,Math.random()*F+w};const f=new Array;for(const w of g.shuffleArray([...e])){const y=w[Math.random()*2|0];await s(l,y),f.push(y),l=y}const p=f.map(w=>w.yAngle),S=Math.min(...p),v=Math.max(...p);if(S==v)throw new Error("wtf");const A=f.flatMap(({zAngle:w})=>typeof w=="number"?g.positiveModulo(w,C):[]);if(A.length!=2)throw new Error("wtf");let M=Math.min(...A),I=Math.max(...A),$=I-M;if($>L&&([M,I]=[I,M+C],$=I-M,$>L))throw new Error("");const R={description:`<i>kinda</i> ${f[0].description}, ${f[1].description} and ${f[2].description}`,yAngle:u(S,v),zAngle:d(M,I)};await s(l,R),l=R}}he();async function ge(){const e=T("overview3",SVGSVGElement),n=new b;n.x=.5,n.y=.5,e.appendChild(n.top),n.addDetector(),new P(i=>{const s=g.positiveModulo(i/480,C);n.zAngle=s;const l=15e3;n.yAngle=Math.abs(g.positiveModulo(i/l,L)-E)+q})}ge();const B=T("test",SVGSVGElement),z=g.initializedArray(5,e=>{const n=new b;switch(B.appendChild(n.top),e){case 0:{n.diameter=2,n.y=2,n.x=1,n.yAngle=q;break}case 1:{n.y=1.5,n.x=2.5,n.yAngle=E;break}case 2:{n.y=2.5,n.x=2.5,n.yAngle=E+.01;break}case 3:{n.y=.5,n.x=3.5;break}case 4:{n.y=1.5,n.x=3.5;break}default:throw new Error("wtf")}return n});window.spheres=z;new P(e=>{z[0].zAngle=e/700,z[3].yAngle=e/831,z[4].zAngle=e/607,z[4].yAngle=e/501});{const e=document.createElementNS("http://www.w3.org/2000/svg","path");e.setAttribute("d",b.squashedCircle(1,1,"real")),e.style.transform="translate(1.5px, 0.5px)",e.style.fill="orange",e.style.strokeWidth="0.1px",e.style.stroke="blue",e.style.strokeLinecap="round",B.appendChild(e)}{const e=document.createElementNS("http://www.w3.org/2000/svg","path");e.setAttribute("d",b.squashedCircle(-.6667,1,"real")),e.style.transform="translate(2.5px, 0.5px)",e.style.fill="lime",e.style.strokeLinecap="round",B.appendChild(e)}async function pe(){const e=new b;e.x=1.5,e.y=3.5,B.appendChild(e.top),e.addDetector();const n=e.addDetector(Math.PI);for(e.listener.addEventListener("mousemove",i=>{const c=i.clientX,s=e.listener.getBoundingClientRect(),l=(c-s.left)/s.width*2-1,d=Math.acos(Math.min(1,Math.max(-1,l)));n.direction=d});;)await e.randomizeDirectionAndAnimate(750),await g.sleep(1667)}pe();