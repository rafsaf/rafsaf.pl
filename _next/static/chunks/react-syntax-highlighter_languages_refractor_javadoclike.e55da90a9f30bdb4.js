"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[902],{9858:function(a){function javadoclike(a){var e;Object.defineProperty(e=a.languages.javadoclike={parameter:{pattern:/(^[\t ]*(?:\/{3}|\*|\/\*\*)\s*@(?:arg|arguments|param)\s+)\w+/m,lookbehind:!0},keyword:{pattern:/(^[\t ]*(?:\/{3}|\*|\/\*\*)\s*|\{)@[a-z][a-zA-Z-]+\b/m,lookbehind:!0},punctuation:/[{}]/},"addSupport",{value:function(e,n){"string"==typeof e&&(e=[e]),e.forEach(function(e){!function(e,n){var t="doc-comment",i=a.languages[e];if(i){var o=i[t];if(!o){var r={};r[t]={pattern:/(^|[^\\])\/\*\*[^/][\s\S]*?(?:\*\/|$)/,lookbehind:!0,alias:"comment"},o=(i=a.languages.insertBefore(e,"comment",r))[t]}if(o instanceof RegExp&&(o=i[t]={pattern:o}),Array.isArray(o))for(var s=0,c=o.length;s<c;s++)o[s]instanceof RegExp&&(o[s]={pattern:o[s]}),n(o[s]);else n(o)}}(e,function(a){a.inside||(a.inside={}),a.inside.rest=n})})}}),e.addSupport(["java","javascript","php"],e)}a.exports=javadoclike,javadoclike.displayName="javadoclike",javadoclike.aliases=[]}}]);