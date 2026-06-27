var V=Object.defineProperty,W=Object.defineProperties;var G=Object.getOwnPropertyDescriptors;var F=Object.getOwnPropertySymbols;var J=Object.prototype.hasOwnProperty,ee=Object.prototype.propertyIsEnumerable;var H=(e,t,a)=>t in e?V(e,t,{enumerable:!0,configurable:!0,writable:!0,value:a}):e[t]=a,l=(e,t)=>{for(var a in t||(t={}))J.call(t,a)&&H(e,a,t[a]);if(F)for(var a of F(t))ee.call(t,a)&&H(e,a,t[a]);return e},y=(e,t)=>W(e,G(t));import{c as w}from"./createReactComponent-D09FyUxv.js";import{r as d}from"./app-BU3bJwxS.js";/**
 * @license @tabler/icons-react v3.44.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const te=[["path",{d:"M6 9l6 6l6 -6",key:"svg-0"}]],et=w("outline","chevron-down","ChevronDown",te);/**
 * @license @tabler/icons-react v3.44.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const ae=[["path",{d:"M6 15l6 -6l6 6",key:"svg-0"}]],tt=w("outline","chevron-up","ChevronUp",ae);/**
 * @license @tabler/icons-react v3.44.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const oe=[["path",{d:"M5 12l-2 0l9 -9l9 9l-2 0",key:"svg-0"}],["path",{d:"M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7",key:"svg-1"}],["path",{d:"M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6",key:"svg-2"}]],at=w("outline","home","Home",oe);/**
 * @license @tabler/icons-react v3.44.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const se=[["path",{d:"M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2",key:"svg-0"}],["path",{d:"M9 12h12l-3 -3",key:"svg-1"}],["path",{d:"M18 15l3 -3",key:"svg-2"}]],ot=w("outline","logout","Logout",se);/**
 * @license @tabler/icons-react v3.44.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const re=[["path",{d:"M4 6l16 0",key:"svg-0"}],["path",{d:"M4 12l16 0",key:"svg-1"}],["path",{d:"M4 18l16 0",key:"svg-2"}]],st=w("outline","menu-2","Menu2",re);/**
 * @license @tabler/icons-react v3.44.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const ie=[["path",{d:"M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454l0 .008",key:"svg-0"}]],rt=w("outline","moon","Moon",ie);/**
 * @license @tabler/icons-react v3.44.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const ne=[["path",{d:"M4 19a2 2 0 1 0 4 0a2 2 0 1 0 -4 0",key:"svg-0"}],["path",{d:"M15 19a2 2 0 1 0 4 0a2 2 0 1 0 -4 0",key:"svg-1"}],["path",{d:"M17 17h-11v-14h-2",key:"svg-2"}],["path",{d:"M6 5l14 1l-1 7h-13",key:"svg-3"}]],it=w("outline","shopping-cart","ShoppingCart",ne);/**
 * @license @tabler/icons-react v3.44.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const le=[["path",{d:"M8 12a4 4 0 1 0 8 0a4 4 0 1 0 -8 0",key:"svg-0"}],["path",{d:"M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7",key:"svg-1"}]],nt=w("outline","sun","Sun",le);/**
 * @license @tabler/icons-react v3.44.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const ce=[["path",{d:"M18 6l-12 12",key:"svg-0"}],["path",{d:"M6 6l12 12",key:"svg-1"}]],lt=w("outline","x","X",ce);let de={data:""},pe=e=>{if(typeof window=="object"){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||de},ue=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,me=/\/\*[^]*?\*\/|  +/g,R=/\n+/g,M=(e,t)=>{let a="",s="",i="";for(let r in e){let o=e[r];r[0]=="@"?r[1]=="i"?a=r+" "+o+";":s+=r[1]=="f"?M(o,r):r+"{"+M(o,r[1]=="k"?"":t)+"}":typeof o=="object"?s+=M(o,t?t.replace(/([^,])+/g,n=>r.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,c=>/&/.test(c)?c.replace(/&/g,n):n?n+" "+c:c)):r):o!=null&&(r=r[1]=="-"?r:r.replace(/[A-Z]/g,"-$&").toLowerCase(),i+=M.p?M.p(r,o):r+":"+o+";")}return a+(t&&i?t+"{"+i+"}":i)+s},k={},U=e=>{if(typeof e=="object"){let t="";for(let a in e)t+=a+U(e[a]);return t}return e},fe=(e,t,a,s,i)=>{let r=U(e),o=k[r]||(k[r]=(c=>{let u=0,m=11;for(;u<c.length;)m=101*m+c.charCodeAt(u++)>>>0;return"go"+m})(r));if(!k[o]){let c=r!==e?e:(u=>{let m,p,f=[{}];for(;m=ue.exec(u.replace(me,""));)m[4]?f.shift():m[3]?(p=m[3].replace(R," ").trim(),f.unshift(f[0][p]=f[0][p]||{})):f[0][m[1]]=m[2].replace(R," ").trim();return f[0]})(e);k[o]=M(i?{["@keyframes "+o]:c}:c,a?"":"."+o)}let n=a&&k.g;return a&&(k.g=k[o]),((c,u,m,p)=>{p?u.data=u.data.replace(p,c):u.data.indexOf(c)===-1&&(u.data=m?c+u.data:u.data+c)})(k[o],t,s,n),o},ge=(e,t,a)=>e.reduce((s,i,r)=>{let o=t[r];if(o&&o.call){let n=o(a),c=n&&n.props&&n.props.className||/^go/.test(n)&&n;o=c?"."+c:n&&typeof n=="object"?n.props?"":M(n,""):n===!1?"":n}return s+i+(o==null?"":o)},"");function D(e){let t=this||{},a=e.call?e(t.p):e;return fe(a.unshift?a.raw?ge(a,[].slice.call(arguments,1),t.p):a.reduce((s,i)=>Object.assign(s,i&&i.call?i(t.p):i),{}):a,pe(t.target),t.g,t.o,t.k)}let B,A,S;D.bind({g:1});let x=D.bind({k:1});function he(e,t,a,s){M.p=t,B=e,A=a,S=s}function E(e,t){let a=this||{};return function(){let s=arguments;function i(r,o){let n=Object.assign({},r),c=n.className||i.className;a.p=Object.assign({theme:A&&A()},n),a.o=/go\d/.test(c),n.className=D.apply(a,s)+(c?" "+c:"");let u=e;return e[0]&&(u=n.as||e,delete n.as),S&&u[0]&&S(n),B(u,n)}return i}}var ye=e=>typeof e=="function",N=(e,t)=>ye(e)?e(t):e,ve=(()=>{let e=0;return()=>(++e).toString()})(),X=(()=>{let e;return()=>{if(e===void 0&&typeof window<"u"){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})(),be=20,P="default",Y=(e,t)=>{let{toastLimit:a}=e.settings;switch(t.type){case 0:return y(l({},e),{toasts:[t.toast,...e.toasts].slice(0,a)});case 1:return y(l({},e),{toasts:e.toasts.map(o=>o.id===t.toast.id?l(l({},o),t.toast):o)});case 2:let{toast:s}=t;return Y(e,{type:e.toasts.find(o=>o.id===s.id)?1:0,toast:s});case 3:let{toastId:i}=t;return y(l({},e),{toasts:e.toasts.map(o=>o.id===i||i===void 0?y(l({},o),{dismissed:!0,visible:!1}):o)});case 4:return t.toastId===void 0?y(l({},e),{toasts:[]}):y(l({},e),{toasts:e.toasts.filter(o=>o.id!==t.toastId)});case 5:return y(l({},e),{pausedAt:t.time});case 6:let r=t.time-(e.pausedAt||0);return y(l({},e),{pausedAt:void 0,toasts:e.toasts.map(o=>y(l({},o),{pauseDuration:o.pauseDuration+r}))})}},I=[],Z={toasts:[],pausedAt:void 0,settings:{toastLimit:be}},b={},q=(e,t=P)=>{b[t]=Y(b[t]||Z,e),I.forEach(([a,s])=>{a===t&&s(b[t])})},K=e=>Object.keys(b).forEach(t=>q(e,t)),xe=e=>Object.keys(b).find(t=>b[t].toasts.some(a=>a.id===e)),O=(e=P)=>t=>{q(t,e)},we={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},ke=(e={},t=P)=>{let[a,s]=d.useState(b[t]||Z),i=d.useRef(b[t]);d.useEffect(()=>(i.current!==b[t]&&s(b[t]),I.push([t,s]),()=>{let o=I.findIndex(([n])=>n===t);o>-1&&I.splice(o,1)}),[t]);let r=a.toasts.map(o=>{var n,c,u;return y(l(l(l({},e),e[o.type]),o),{removeDelay:o.removeDelay||((n=e[o.type])==null?void 0:n.removeDelay)||(e==null?void 0:e.removeDelay),duration:o.duration||((c=e[o.type])==null?void 0:c.duration)||(e==null?void 0:e.duration)||we[o.type],style:l(l(l({},e.style),(u=e[o.type])==null?void 0:u.style),o.style)})});return y(l({},a),{toasts:r})},Me=(e,t="blank",a)=>y(l({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0},a),{id:(a==null?void 0:a.id)||ve()}),_=e=>(t,a)=>{let s=Me(t,e,a);return O(s.toasterId||xe(s.id))({type:2,toast:s}),s.id},g=(e,t)=>_("blank")(e,t);g.error=_("error");g.success=_("success");g.loading=_("loading");g.custom=_("custom");g.dismiss=(e,t)=>{let a={type:3,toastId:e};t?O(t)(a):K(a)};g.dismissAll=e=>g.dismiss(void 0,e);g.remove=(e,t)=>{let a={type:4,toastId:e};t?O(t)(a):K(a)};g.removeAll=e=>g.remove(void 0,e);g.promise=(e,t,a)=>{let s=g.loading(t.loading,l(l({},a),a==null?void 0:a.loading));return typeof e=="function"&&(e=e()),e.then(i=>{let r=t.success?N(t.success,i):void 0;return r?g.success(r,l(l({id:s},a),a==null?void 0:a.success)):g.dismiss(s),i}).catch(i=>{let r=t.error?N(t.error,i):void 0;r?g.error(r,l(l({id:s},a),a==null?void 0:a.error)):g.dismiss(s)}),e};var Ee=1e3,_e=(e,t="default")=>{let{toasts:a,pausedAt:s}=ke(e,t),i=d.useRef(new Map).current,r=d.useCallback((p,f=Ee)=>{if(i.has(p))return;let h=setTimeout(()=>{i.delete(p),o({type:4,toastId:p})},f);i.set(p,h)},[]);d.useEffect(()=>{if(s)return;let p=Date.now(),f=a.map(h=>{if(h.duration===1/0)return;let C=(h.duration||0)+h.pauseDuration-(p-h.createdAt);if(C<0){h.visible&&g.dismiss(h.id);return}return setTimeout(()=>g.dismiss(h.id,t),C)});return()=>{f.forEach(h=>h&&clearTimeout(h))}},[a,s,t]);let o=d.useCallback(O(t),[t]),n=d.useCallback(()=>{o({type:5,time:Date.now()})},[o]),c=d.useCallback((p,f)=>{o({type:1,toast:{id:p,height:f}})},[o]),u=d.useCallback(()=>{s&&o({type:6,time:Date.now()})},[s,o]),m=d.useCallback((p,f)=>{let{reverseOrder:h=!1,gutter:C=8,defaultPosition:T}=f||{},j=a.filter(v=>(v.position||T)===(p.position||T)&&v.height),Q=j.findIndex(v=>v.id===p.id),L=j.filter((v,z)=>z<Q&&v.visible).length;return j.filter(v=>v.visible).slice(...h?[L+1]:[0,L]).reduce((v,z)=>v+(z.height||0)+C,0)},[a]);return d.useEffect(()=>{a.forEach(p=>{if(p.dismissed)r(p.id,p.removeDelay);else{let f=i.get(p.id);f&&(clearTimeout(f),i.delete(p.id))}})},[a,r]),{toasts:a,handlers:{updateHeight:c,startPause:n,endPause:u,calculateOffset:m}}},Ce=x`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,$e=x`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Ie=x`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,Ne=E("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${Ce} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${$e} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${Ie} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,De=x`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,Oe=E("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${De} 1s linear infinite;
`,je=x`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,ze=x`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,Ae=E("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${je} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${ze} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,Se=E("div")`
  position: absolute;
`,Pe=E("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,Te=x`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Le=E("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${Te} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,Fe=({toast:e})=>{let{icon:t,type:a,iconTheme:s}=e;return t!==void 0?typeof t=="string"?d.createElement(Le,null,t):t:a==="blank"?null:d.createElement(Pe,null,d.createElement(Oe,l({},s)),a!=="loading"&&d.createElement(Se,null,a==="error"?d.createElement(Ne,l({},s)):d.createElement(Ae,l({},s))))},He=e=>`
0% {transform: translate3d(0,${e*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,Re=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e*-150}%,-1px) scale(.6); opacity:0;}
`,Ue="0%{opacity:0;} 100%{opacity:1;}",Be="0%{opacity:1;} 100%{opacity:0;}",Xe=E("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,Ye=E("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,Ze=(e,t)=>{let a=e.includes("top")?1:-1,[s,i]=X()?[Ue,Be]:[He(a),Re(a)];return{animation:t?`${x(s)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${x(i)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},qe=d.memo(({toast:e,position:t,style:a,children:s})=>{let i=e.height?Ze(e.position||t||"top-center",e.visible):{opacity:0},r=d.createElement(Fe,{toast:e}),o=d.createElement(Ye,l({},e.ariaProps),N(e.message,e));return d.createElement(Xe,{className:e.className,style:l(l(l({},i),a),e.style)},typeof s=="function"?s({icon:r,message:o}):d.createElement(d.Fragment,null,r,o))});he(d.createElement);var Ke=({id:e,className:t,style:a,onHeightUpdate:s,children:i})=>{let r=d.useCallback(o=>{if(o){let n=()=>{let c=o.getBoundingClientRect().height;s(e,c)};n(),new MutationObserver(n).observe(o,{subtree:!0,childList:!0,characterData:!0})}},[e,s]);return d.createElement("div",{ref:r,className:t,style:a},i)},Qe=(e,t)=>{let a=e.includes("top"),s=a?{top:0}:{bottom:0},i=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return l(l({left:0,right:0,display:"flex",position:"absolute",transition:X()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(a?1:-1)}px)`},s),i)},Ve=D`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,$=16,ct=({reverseOrder:e,position:t="top-center",toastOptions:a,gutter:s,children:i,toasterId:r,containerStyle:o,containerClassName:n})=>{let{toasts:c,handlers:u}=_e(a,r);return d.createElement("div",{"data-rht-toaster":r||"",style:l({position:"fixed",zIndex:9999,top:$,left:$,right:$,bottom:$,pointerEvents:"none"},o),className:n,onMouseEnter:u.startPause,onMouseLeave:u.endPause},c.map(m=>{let p=m.position||t,f=u.calculateOffset(m,{reverseOrder:e,gutter:s,defaultPosition:t}),h=Qe(p,f);return d.createElement(Ke,{id:m.id,key:m.id,onHeightUpdate:u.updateHeight,className:m.visible?Ve:"",style:h},m.type==="custom"?N(m.message,m):i?i(m):d.createElement(qe,{toast:m,position:p}))}))},dt=g;export{ct as F,it as I,lt as a,et as b,st as c,at as d,nt as e,rt as f,ot as g,tt as h,dt as z};
