"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[6247],{3336:function(e){function diff(e){var f;e.languages.diff={coord:[/^(?:\*{3}|-{3}|\+{3}).*$/m,/^@@.*@@$/m,/^\d.*$/m]},Object.keys(f={"deleted-sign":"-","deleted-arrow":"<","inserted-sign":"+","inserted-arrow":">",unchanged:" ",diff:"!"}).forEach(function(i){var n=f[i],a=[];/^\w+$/.test(i)||a.push(/\w+/.exec(i)[0]),"diff"===i&&a.push("bold"),e.languages.diff[i]={pattern:RegExp("^(?:["+n+"].*(?:\r\n?|\n|(?![\\s\\S])))+","m"),alias:a,inside:{line:{pattern:/(.)(?=[\s\S]).*(?:\r\n?|\n)?/,lookbehind:!0},prefix:{pattern:/[\s\S]/,alias:/\w+/.exec(i)[0]}}}}),Object.defineProperty(e.languages.diff,"PREFIXES",{value:f})}e.exports=diff,diff.displayName="diff",diff.aliases=[]}}]);