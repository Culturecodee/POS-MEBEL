var y=Object.defineProperty,A=Object.defineProperties;var j=Object.getOwnPropertyDescriptors;var n=Object.getOwnPropertySymbols;var f=Object.prototype.hasOwnProperty,g=Object.prototype.propertyIsEnumerable;var d=(e,t,r)=>t in e?y(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,i=(e,t)=>{for(var r in t||(t={}))f.call(t,r)&&d(e,r,t[r]);if(n)for(var r of n(t))g.call(t,r)&&d(e,r,t[r]);return e},p=(e,t)=>A(e,j(t));var u=(e,t)=>{var r={};for(var o in e)f.call(e,o)&&t.indexOf(o)<0&&(r[o]=e[o]);if(e!=null&&n)for(var o of n(e))t.indexOf(o)<0&&g.call(e,o)&&(r[o]=e[o]);return r};import{r as l}from"./app-YUm_mXyq.js";/**
 * @license @tabler/icons-react v3.44.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */var B={outline:{xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"},filled:{xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"currentColor",stroke:"none"}};/**
 * @license @tabler/icons-react v3.44.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const W=(e,t,r,o)=>{const a=l.forwardRef((L,C)=>{var h=L,{color:w="currentColor",size:c=24,stroke:k=2,title:m,className:v,children:s}=h,x=u(h,["color","size","stroke","title","className","children"]);return l.createElement("svg",i(i(p(i({ref:C},B[e]),{width:c,height:c,className:["tabler-icon",`tabler-icon-${t}`,v].join(" ")}),e==="filled"?{fill:w}:{strokeWidth:k,stroke:w}),x),[m&&l.createElement("title",{key:"svg-title"},m),...o.map(([E,b])=>l.createElement(E,b)),...Array.isArray(s)?s:[s]])});return a.displayName=`${r}`,a};export{W as c};
