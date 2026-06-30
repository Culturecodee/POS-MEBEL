var m=Object.defineProperty;var s=Object.getOwnPropertySymbols;var o=Object.prototype.hasOwnProperty,x=Object.prototype.propertyIsEnumerable;var n=(e,a,r)=>a in e?m(e,a,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[a]=r,c=(e,a)=>{for(var r in a||(a={}))o.call(a,r)&&n(e,r,a[r]);if(s)for(var r of s(a))x.call(a,r)&&n(e,r,a[r]);return e};var i=(e,a)=>{var r={};for(var t in e)o.call(e,t)&&a.indexOf(t)<0&&(r[t]=e[t]);if(e!=null&&s)for(var t of s(e))a.indexOf(t)<0&&x.call(e,t)&&(r[t]=e[t]);return r};import{j as d}from"./app-CEqunyXf.js";function p(u){var l=u,{label:e,className:a,errors:r,rows:t=4}=l,f=i(l,["label","className","errors","rows"]);return d.jsxs("div",{className:"flex flex-col gap-2",children:[e&&d.jsx("label",{className:"text-sm font-medium text-[#6f4b36] dark:text-slate-300",children:e}),d.jsx("textarea",c({rows:t,className:`
                    w-full px-4 py-3 text-sm rounded-xl
                    border border-[#e2d1c0] dark:border-slate-700
                    bg-[#fffaf3] dark:bg-slate-800
                    text-[#5c4131] dark:text-slate-200
                    placeholder-[#b29d89] dark:placeholder-slate-500
                    focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
                    transition-all duration-200 resize-none
                    ${r?"border-danger-500 focus:border-danger-500 focus:ring-danger-500/20":""}
                    ${a||""}
                `},f)),r&&d.jsx("small",{className:"text-xs text-danger-500 dark:text-danger-400",children:r})]})}export{p as T};
