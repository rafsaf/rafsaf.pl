"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[8614],{6500:function(e){function ebnf(e){e.languages.ebnf={comment:/\(\*[\s\S]*?\*\)/,string:{pattern:/"[^"\r\n]*"|'[^'\r\n]*'/,greedy:!0},special:{pattern:/\?[^?\r\n]*\?/,greedy:!0,alias:"class-name"},definition:{pattern:/^([\t ]*)[a-z]\w*(?:[ \t]+[a-z]\w*)*(?=\s*=)/im,lookbehind:!0,alias:["rule","keyword"]},rule:/\b[a-z]\w*(?:[ \t]+[a-z]\w*)*\b/i,punctuation:/\([:/]|[:/]\)|[.,;()[\]{}]/,operator:/[-=|*/!]/}}e.exports=ebnf,ebnf.displayName="ebnf",ebnf.aliases=[]}}]);