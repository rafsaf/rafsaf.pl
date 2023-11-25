"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[2509,4657,9461],{6412:function(e){function jsx(e){!function(e){var t=e.util.clone(e.languages.javascript),n=/(?:\s|\/\/.*(?!.)|\/\*(?:[^*]|\*(?!\/))\*\/)/.source,s=/(?:\{(?:\{(?:\{[^{}]*\}|[^{}])*\}|[^{}])*\})/.source,a=/(?:\{<S>*\.{3}(?:[^{}]|<BRACES>)*\})/.source;function re(e,t){return RegExp(e=e.replace(/<S>/g,function(){return n}).replace(/<BRACES>/g,function(){return s}).replace(/<SPREAD>/g,function(){return a}),t)}a=re(a).source,e.languages.jsx=e.languages.extend("markup",t),e.languages.jsx.tag.pattern=re(/<\/?(?:[\w.:-]+(?:<S>+(?:[\w.:$-]+(?:=(?:"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*'|[^\s{'"/>=]+|<BRACES>))?|<SPREAD>))*<S>*\/?)?>/.source),e.languages.jsx.tag.inside.tag.pattern=/^<\/?[^\s>\/]*/,e.languages.jsx.tag.inside["attr-value"].pattern=/=(?!\{)(?:"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*'|[^\s'">]+)/,e.languages.jsx.tag.inside.tag.inside["class-name"]=/^[A-Z]\w*(?:\.[A-Z]\w*)*$/,e.languages.jsx.tag.inside.comment=t.comment,e.languages.insertBefore("inside","attr-name",{spread:{pattern:re(/<SPREAD>/.source),inside:e.languages.jsx}},e.languages.jsx.tag),e.languages.insertBefore("inside","special-attr",{script:{pattern:re(/=<BRACES>/.source),alias:"language-javascript",inside:{"script-punctuation":{pattern:/^=(?=\{)/,alias:"punctuation"},rest:e.languages.jsx}}},e.languages.jsx.tag);var stringifyToken=function(e){return e?"string"==typeof e?e:"string"==typeof e.content?e.content:e.content.map(stringifyToken).join(""):""},walkTokens=function(t){for(var n=[],s=0;s<t.length;s++){var a=t[s],r=!1;if("string"!=typeof a&&("tag"===a.type&&a.content[0]&&"tag"===a.content[0].type?"</"===a.content[0].content[0].content?n.length>0&&n[n.length-1].tagName===stringifyToken(a.content[0].content[1])&&n.pop():"/>"===a.content[a.content.length-1].content||n.push({tagName:stringifyToken(a.content[0].content[1]),openedBraces:0}):n.length>0&&"punctuation"===a.type&&"{"===a.content?n[n.length-1].openedBraces++:n.length>0&&n[n.length-1].openedBraces>0&&"punctuation"===a.type&&"}"===a.content?n[n.length-1].openedBraces--:r=!0),(r||"string"==typeof a)&&n.length>0&&0===n[n.length-1].openedBraces){var i=stringifyToken(a);s<t.length-1&&("string"==typeof t[s+1]||"plain-text"===t[s+1].type)&&(i+=stringifyToken(t[s+1]),t.splice(s+1,1)),s>0&&("string"==typeof t[s-1]||"plain-text"===t[s-1].type)&&(i=stringifyToken(t[s-1])+i,t.splice(s-1,1),s--),t[s]=new e.Token("plain-text",i,null,i)}a.content&&"string"!=typeof a.content&&walkTokens(a.content)}};e.hooks.add("after-tokenize",function(e){("jsx"===e.language||"tsx"===e.language)&&walkTokens(e.tokens)})}(e)}e.exports=jsx,jsx.displayName="jsx",jsx.aliases=[]},7041:function(e,t,n){var s=n(6412),a=n(4979);function tsx(e){var t,n;e.register(s),e.register(a),t=e.util.clone(e.languages.typescript),e.languages.tsx=e.languages.extend("jsx",t),delete e.languages.tsx.parameter,delete e.languages.tsx["literal-property"],(n=e.languages.tsx.tag).pattern=RegExp(/(^|[^\w$]|(?=<\/))/.source+"(?:"+n.pattern.source+")",n.pattern.flags),n.lookbehind=!0}e.exports=tsx,tsx.displayName="tsx",tsx.aliases=[]},4979:function(e){function typescript(e){var t;e.languages.typescript=e.languages.extend("javascript",{"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|type)\s+)(?!keyof\b)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?:\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>)?/,lookbehind:!0,greedy:!0,inside:null},builtin:/\b(?:Array|Function|Promise|any|boolean|console|never|number|string|symbol|unknown)\b/}),e.languages.typescript.keyword.push(/\b(?:abstract|declare|is|keyof|readonly|require)\b/,/\b(?:asserts|infer|interface|module|namespace|type)\b(?=\s*(?:[{_$a-zA-Z\xA0-\uFFFF]|$))/,/\btype\b(?=\s*(?:[\{*]|$))/),delete e.languages.typescript.parameter,delete e.languages.typescript["literal-property"],t=e.languages.extend("typescript",{}),delete t["class-name"],e.languages.typescript["class-name"].inside=t,e.languages.insertBefore("typescript","function",{decorator:{pattern:/@[$\w\xA0-\uFFFF]+/,inside:{at:{pattern:/^@/,alias:"operator"},function:/^[\s\S]+/}},"generic-function":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>(?=\s*\()/,greedy:!0,inside:{function:/^#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*/,generic:{pattern:/<[\s\S]+/,alias:"class-name",inside:t}}}}),e.languages.ts=e.languages.typescript}e.exports=typescript,typescript.displayName="typescript",typescript.aliases=["ts"]}}]);