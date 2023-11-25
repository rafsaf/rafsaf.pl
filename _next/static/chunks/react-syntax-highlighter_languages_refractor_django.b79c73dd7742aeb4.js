"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[7899,3047],{3294:function(e,n,a){var t=a(3205);function django(e){var n,a;e.register(t),e.languages.django={comment:/^\{#[\s\S]*?#\}$/,tag:{pattern:/(^\{%[+-]?\s*)\w+/,lookbehind:!0,alias:"keyword"},delimiter:{pattern:/^\{[{%][+-]?|[+-]?[}%]\}$/,alias:"punctuation"},string:{pattern:/("|')(?:\\.|(?!\1)[^\\\r\n])*\1/,greedy:!0},filter:{pattern:/(\|)\w+/,lookbehind:!0,alias:"function"},test:{pattern:/(\bis\s+(?:not\s+)?)(?!not\b)\w+/,lookbehind:!0,alias:"function"},function:/\b[a-z_]\w+(?=\s*\()/i,keyword:/\b(?:and|as|by|else|for|if|import|in|is|loop|not|or|recursive|with|without)\b/,operator:/[-+%=]=?|!=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,number:/\b\d+(?:\.\d+)?\b/,boolean:/[Ff]alse|[Nn]one|[Tt]rue/,variable:/\b\w+\b/,punctuation:/[{}[\](),.:;]/},n=/\{\{[\s\S]*?\}\}|\{%[\s\S]*?%\}|\{#[\s\S]*?#\}/g,a=e.languages["markup-templating"],e.hooks.add("before-tokenize",function(e){a.buildPlaceholders(e,"django",n)}),e.hooks.add("after-tokenize",function(e){a.tokenizePlaceholders(e,"django")}),e.languages.jinja2=e.languages.django,e.hooks.add("before-tokenize",function(e){a.buildPlaceholders(e,"jinja2",n)}),e.hooks.add("after-tokenize",function(e){a.tokenizePlaceholders(e,"jinja2")})}e.exports=django,django.displayName="django",django.aliases=["jinja2"]},3205:function(e){function markupTemplating(e){!function(e){function getPlaceholder(e,n){return"___"+e.toUpperCase()+n+"___"}Object.defineProperties(e.languages["markup-templating"]={},{buildPlaceholders:{value:function(n,a,t,o){if(n.language===a){var i=n.tokenStack=[];n.code=n.code.replace(t,function(e){if("function"==typeof o&&!o(e))return e;for(var t,r=i.length;-1!==n.code.indexOf(t=getPlaceholder(a,r));)++r;return i[r]=e,t}),n.grammar=e.languages.markup}}},tokenizePlaceholders:{value:function(n,a){if(n.language===a&&n.tokenStack){n.grammar=e.languages[a];var t=0,o=Object.keys(n.tokenStack);!function walkTokens(i){for(var r=0;r<i.length&&!(t>=o.length);r++){var l=i[r];if("string"==typeof l||l.content&&"string"==typeof l.content){var s=o[t],u=n.tokenStack[s],g="string"==typeof l?l:l.content,c=getPlaceholder(a,s),p=g.indexOf(c);if(p>-1){++t;var k=g.substring(0,p),d=new e.Token(a,e.tokenize(u,n.grammar),"language-"+a,u),f=g.substring(p+c.length),h=[];k&&h.push.apply(h,walkTokens([k])),h.push(d),f&&h.push.apply(h,walkTokens([f])),"string"==typeof l?i.splice.apply(i,[r,1].concat(h)):l.content=h}}else l.content&&walkTokens(l.content)}return i}(n.tokens)}}}})}(e)}e.exports=markupTemplating,markupTemplating.displayName="markupTemplating",markupTemplating.aliases=[]}}]);