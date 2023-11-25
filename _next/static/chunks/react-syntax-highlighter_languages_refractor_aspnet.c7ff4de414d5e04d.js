"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[8030,3318],{8734:function(e,s,r){var a=r(1958);function aspnet(e){e.register(a),e.languages.aspnet=e.languages.extend("markup",{"page-directive":{pattern:/<%\s*@.*%>/,alias:"tag",inside:{"page-directive":{pattern:/<%\s*@\s*(?:Assembly|Control|Implements|Import|Master(?:Type)?|OutputCache|Page|PreviousPageType|Reference|Register)?|%>/i,alias:"tag"},rest:e.languages.markup.tag.inside}},directive:{pattern:/<%.*%>/,alias:"tag",inside:{directive:{pattern:/<%\s*?[$=%#:]{0,2}|%>/,alias:"tag"},rest:e.languages.csharp}}}),e.languages.aspnet.tag.pattern=/<(?!%)\/?[^\s>\/]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/,e.languages.insertBefore("inside","punctuation",{directive:e.languages.aspnet.directive},e.languages.aspnet.tag.inside["attr-value"]),e.languages.insertBefore("aspnet","comment",{"asp-comment":{pattern:/<%--[\s\S]*?--%>/,alias:["asp","comment"]}}),e.languages.insertBefore("aspnet",e.languages.javascript?"script":"tag",{"asp-script":{pattern:/(<script(?=.*runat=['"]?server\b)[^>]*>)[\s\S]*?(?=<\/script>)/i,lookbehind:!0,alias:["asp","script"],inside:e.languages.csharp||{}}})}e.exports=aspnet,aspnet.displayName="aspnet",aspnet.aliases=[]},1958:function(e){function csharp(e){!function(e){function replace(e,s){return e.replace(/<<(\d+)>>/g,function(e,r){return"(?:"+s[+r]+")"})}function re(e,s,r){return RegExp(replace(e,s),r||"")}function nested(e,s){for(var r=0;r<s;r++)e=e.replace(/<<self>>/g,function(){return"(?:"+e+")"});return e.replace(/<<self>>/g,"[^\\s\\S]")}var s={type:"bool byte char decimal double dynamic float int long object sbyte short string uint ulong ushort var void",typeDeclaration:"class enum interface record struct",contextual:"add alias and ascending async await by descending from(?=\\s*(?:\\w|$)) get global group into init(?=\\s*;) join let nameof not notnull on or orderby partial remove select set unmanaged value when where with(?=\\s*{)",other:"abstract as base break case catch checked const continue default delegate do else event explicit extern finally fixed for foreach goto if implicit in internal is lock namespace new null operator out override params private protected public readonly ref return sealed sizeof stackalloc static switch this throw try typeof unchecked unsafe using virtual volatile while yield"};function keywordsToPattern(e){return"\\b(?:"+e.trim().replace(/ /g,"|")+")\\b"}var r=keywordsToPattern(s.typeDeclaration),a=RegExp(keywordsToPattern(s.type+" "+s.typeDeclaration+" "+s.contextual+" "+s.other)),n=keywordsToPattern(s.typeDeclaration+" "+s.contextual+" "+s.other),t=keywordsToPattern(s.type+" "+s.typeDeclaration+" "+s.other),i=nested(/<(?:[^<>;=+\-*/%&|^]|<<self>>)*>/.source,2),o=nested(/\((?:[^()]|<<self>>)*\)/.source,2),c=/@?\b[A-Za-z_]\w*\b/.source,l=replace(/<<0>>(?:\s*<<1>>)?/.source,[c,i]),p=replace(/(?!<<0>>)<<1>>(?:\s*\.\s*<<1>>)*/.source,[n,l]),u=/\[\s*(?:,\s*)*\]/.source,d=replace(/<<0>>(?:\s*(?:\?\s*)?<<1>>)*(?:\s*\?)?/.source,[p,u]),g=replace(/[^,()<>[\];=+\-*/%&|^]|<<0>>|<<1>>|<<2>>/.source,[i,o,u]),h=replace(/\(<<0>>+(?:,<<0>>+)+\)/.source,[g]),b=replace(/(?:<<0>>|<<1>>)(?:\s*(?:\?\s*)?<<2>>)*(?:\s*\?)?/.source,[h,p,u]),f={keyword:a,punctuation:/[<>()?,.:[\]]/},m=/'(?:[^\r\n'\\]|\\.|\\[Uux][\da-fA-F]{1,8})'/.source,y=/"(?:\\.|[^\\"\r\n])*"/.source,k=/@"(?:""|\\[\s\S]|[^\\"])*"(?!")/.source;e.languages.csharp=e.languages.extend("clike",{string:[{pattern:re(/(^|[^$\\])<<0>>/.source,[k]),lookbehind:!0,greedy:!0},{pattern:re(/(^|[^@$\\])<<0>>/.source,[y]),lookbehind:!0,greedy:!0}],"class-name":[{pattern:re(/(\busing\s+static\s+)<<0>>(?=\s*;)/.source,[p]),lookbehind:!0,inside:f},{pattern:re(/(\busing\s+<<0>>\s*=\s*)<<1>>(?=\s*;)/.source,[c,b]),lookbehind:!0,inside:f},{pattern:re(/(\busing\s+)<<0>>(?=\s*=)/.source,[c]),lookbehind:!0},{pattern:re(/(\b<<0>>\s+)<<1>>/.source,[r,l]),lookbehind:!0,inside:f},{pattern:re(/(\bcatch\s*\(\s*)<<0>>/.source,[p]),lookbehind:!0,inside:f},{pattern:re(/(\bwhere\s+)<<0>>/.source,[c]),lookbehind:!0},{pattern:re(/(\b(?:is(?:\s+not)?|as)\s+)<<0>>/.source,[d]),lookbehind:!0,inside:f},{pattern:re(/\b<<0>>(?=\s+(?!<<1>>|with\s*\{)<<2>>(?:\s*[=,;:{)\]]|\s+(?:in|when)\b))/.source,[b,t,c]),inside:f}],keyword:a,number:/(?:\b0(?:x[\da-f_]*[\da-f]|b[01_]*[01])|(?:\B\.\d+(?:_+\d+)*|\b\d+(?:_+\d+)*(?:\.\d+(?:_+\d+)*)?)(?:e[-+]?\d+(?:_+\d+)*)?)(?:[dflmu]|lu|ul)?\b/i,operator:/>>=?|<<=?|[-=]>|([-+&|])\1|~|\?\?=?|[-+*/%&|^!=<>]=?/,punctuation:/\?\.?|::|[{}[\];(),.:]/}),e.languages.insertBefore("csharp","number",{range:{pattern:/\.\./,alias:"operator"}}),e.languages.insertBefore("csharp","punctuation",{"named-parameter":{pattern:re(/([(,]\s*)<<0>>(?=\s*:)/.source,[c]),lookbehind:!0,alias:"punctuation"}}),e.languages.insertBefore("csharp","class-name",{namespace:{pattern:re(/(\b(?:namespace|using)\s+)<<0>>(?:\s*\.\s*<<0>>)*(?=\s*[;{])/.source,[c]),lookbehind:!0,inside:{punctuation:/\./}},"type-expression":{pattern:re(/(\b(?:default|sizeof|typeof)\s*\(\s*(?!\s))(?:[^()\s]|\s(?!\s)|<<0>>)*(?=\s*\))/.source,[o]),lookbehind:!0,alias:"class-name",inside:f},"return-type":{pattern:re(/<<0>>(?=\s+(?:<<1>>\s*(?:=>|[({]|\.\s*this\s*\[)|this\s*\[))/.source,[b,p]),inside:f,alias:"class-name"},"constructor-invocation":{pattern:re(/(\bnew\s+)<<0>>(?=\s*[[({])/.source,[b]),lookbehind:!0,inside:f,alias:"class-name"},"generic-method":{pattern:re(/<<0>>\s*<<1>>(?=\s*\()/.source,[c,i]),inside:{function:re(/^<<0>>/.source,[c]),generic:{pattern:RegExp(i),alias:"class-name",inside:f}}},"type-list":{pattern:re(/\b((?:<<0>>\s+<<1>>|record\s+<<1>>\s*<<5>>|where\s+<<2>>)\s*:\s*)(?:<<3>>|<<4>>|<<1>>\s*<<5>>|<<6>>)(?:\s*,\s*(?:<<3>>|<<4>>|<<6>>))*(?=\s*(?:where|[{;]|=>|$))/.source,[r,l,c,b,a.source,o,/\bnew\s*\(\s*\)/.source]),lookbehind:!0,inside:{"record-arguments":{pattern:re(/(^(?!new\s*\()<<0>>\s*)<<1>>/.source,[l,o]),lookbehind:!0,greedy:!0,inside:e.languages.csharp},keyword:a,"class-name":{pattern:RegExp(b),greedy:!0,inside:f},punctuation:/[,()]/}},preprocessor:{pattern:/(^[\t ]*)#.*/m,lookbehind:!0,alias:"property",inside:{directive:{pattern:/(#)\b(?:define|elif|else|endif|endregion|error|if|line|nullable|pragma|region|undef|warning)\b/,lookbehind:!0,alias:"keyword"}}}});var w=y+"|"+m,v=replace(/\/(?![*/])|\/\/[^\r\n]*[\r\n]|\/\*(?:[^*]|\*(?!\/))*\*\/|<<0>>/.source,[w]),x=nested(replace(/[^"'/()]|<<0>>|\(<<self>>*\)/.source,[v]),2),_=/\b(?:assembly|event|field|method|module|param|property|return|type)\b/.source,$=replace(/<<0>>(?:\s*\(<<1>>*\))?/.source,[p,x]);e.languages.insertBefore("csharp","class-name",{attribute:{pattern:re(/((?:^|[^\s\w>)?])\s*\[\s*)(?:<<0>>\s*:\s*)?<<1>>(?:\s*,\s*<<1>>)*(?=\s*\])/.source,[_,$]),lookbehind:!0,greedy:!0,inside:{target:{pattern:re(/^<<0>>(?=\s*:)/.source,[_]),alias:"keyword"},"attribute-arguments":{pattern:re(/\(<<0>>*\)/.source,[x]),inside:e.languages.csharp},"class-name":{pattern:RegExp(p),inside:{punctuation:/\./}},punctuation:/[:,]/}}});var B=/:[^}\r\n]+/.source,E=nested(replace(/[^"'/()]|<<0>>|\(<<self>>*\)/.source,[v]),2),I=replace(/\{(?!\{)(?:(?![}:])<<0>>)*<<1>>?\}/.source,[E,B]),P=nested(replace(/[^"'/()]|\/(?!\*)|\/\*(?:[^*]|\*(?!\/))*\*\/|<<0>>|\(<<self>>*\)/.source,[w]),2),R=replace(/\{(?!\{)(?:(?![}:])<<0>>)*<<1>>?\}/.source,[P,B]);function createInterpolationInside(s,r){return{interpolation:{pattern:re(/((?:^|[^{])(?:\{\{)*)<<0>>/.source,[s]),lookbehind:!0,inside:{"format-string":{pattern:re(/(^\{(?:(?![}:])<<0>>)*)<<1>>(?=\}$)/.source,[r,B]),lookbehind:!0,inside:{punctuation:/^:/}},punctuation:/^\{|\}$/,expression:{pattern:/[\s\S]+/,alias:"language-csharp",inside:e.languages.csharp}}},string:/[\s\S]+/}}e.languages.insertBefore("csharp","string",{"interpolation-string":[{pattern:re(/(^|[^\\])(?:\$@|@\$)"(?:""|\\[\s\S]|\{\{|<<0>>|[^\\{"])*"/.source,[I]),lookbehind:!0,greedy:!0,inside:createInterpolationInside(I,E)},{pattern:re(/(^|[^@\\])\$"(?:\\.|\{\{|<<0>>|[^\\"{])*"/.source,[R]),lookbehind:!0,greedy:!0,inside:createInterpolationInside(R,P)}],char:{pattern:RegExp(m),greedy:!0}}),e.languages.dotnet=e.languages.cs=e.languages.csharp}(e)}e.exports=csharp,csharp.displayName="csharp",csharp.aliases=["dotnet","cs"]}}]);