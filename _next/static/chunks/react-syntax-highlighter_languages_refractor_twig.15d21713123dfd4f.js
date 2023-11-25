"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[8827,3047],{3205:function(e){function markupTemplating(e){!function(e){function getPlaceholder(e,n){return"___"+e.toUpperCase()+n+"___"}Object.defineProperties(e.languages["markup-templating"]={},{buildPlaceholders:{value:function(n,t,a,o){if(n.language===t){var i=n.tokenStack=[];n.code=n.code.replace(a,function(e){if("function"==typeof o&&!o(e))return e;for(var a,r=i.length;-1!==n.code.indexOf(a=getPlaceholder(t,r));)++r;return i[r]=e,a}),n.grammar=e.languages.markup}}},tokenizePlaceholders:{value:function(n,t){if(n.language===t&&n.tokenStack){n.grammar=e.languages[t];var a=0,o=Object.keys(n.tokenStack);!function walkTokens(i){for(var r=0;r<i.length&&!(a>=o.length);r++){var s=i[r];if("string"==typeof s||s.content&&"string"==typeof s.content){var l=o[a],u=n.tokenStack[l],g="string"==typeof s?s:s.content,p=getPlaceholder(t,l),c=g.indexOf(p);if(c>-1){++a;var k=g.substring(0,c),d=new e.Token(t,e.tokenize(u,n.grammar),"language-"+t,u),f=g.substring(c+p.length),m=[];k&&m.push.apply(m,walkTokens([k])),m.push(d),f&&m.push.apply(m,walkTokens([f])),"string"==typeof s?i.splice.apply(i,[r,1].concat(m)):s.content=m}}else s.content&&walkTokens(s.content)}return i}(n.tokens)}}}})}(e)}e.exports=markupTemplating,markupTemplating.displayName="markupTemplating",markupTemplating.aliases=[]},9892:function(e,n,t){var a=t(3205);function twig(e){e.register(a),e.languages.twig={comment:/^\{#[\s\S]*?#\}$/,"tag-name":{pattern:/(^\{%-?\s*)\w+/,lookbehind:!0,alias:"keyword"},delimiter:{pattern:/^\{[{%]-?|-?[%}]\}$/,alias:"punctuation"},string:{pattern:/("|')(?:\\.|(?!\1)[^\\\r\n])*\1/,inside:{punctuation:/^['"]|['"]$/}},keyword:/\b(?:even|if|odd)\b/,boolean:/\b(?:false|null|true)\b/,number:/\b0x[\dA-Fa-f]+|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee][-+]?\d+)?/,operator:[{pattern:/(\s)(?:and|b-and|b-or|b-xor|ends with|in|is|matches|not|or|same as|starts with)(?=\s)/,lookbehind:!0},/[=<>]=?|!=|\*\*?|\/\/?|\?:?|[-+~%|]/],punctuation:/[()\[\]{}:.,]/},e.hooks.add("before-tokenize",function(n){"twig"===n.language&&e.languages["markup-templating"].buildPlaceholders(n,"twig",/\{(?:#[\s\S]*?#|%[\s\S]*?%|\{[\s\S]*?\})\}/g)}),e.hooks.add("after-tokenize",function(n){e.languages["markup-templating"].tokenizePlaceholders(n,"twig")})}e.exports=twig,twig.displayName="twig",twig.aliases=[]}}]);