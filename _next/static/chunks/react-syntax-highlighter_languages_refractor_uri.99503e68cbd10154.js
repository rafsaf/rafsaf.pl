"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[2943],{8521:function(e){function i(e){e.languages.uri={scheme:{pattern:/^[a-z][a-z0-9+.-]*:/im,greedy:!0,inside:{"scheme-delimiter":/:$/}},fragment:{pattern:/#[\w\-.~!$&'()*+,;=%:@/?]*/,inside:{"fragment-delimiter":/^#/}},query:{pattern:/\?[\w\-.~!$&'()*+,;=%:@/?]*/,inside:{"query-delimiter":{pattern:/^\?/,greedy:!0},"pair-delimiter":/[&;]/,pair:{pattern:/^[^=][\s\S]*/,inside:{key:/^[^=]+/,value:{pattern:/(^=)[\s\S]+/,lookbehind:!0}}}}},authority:{pattern:RegExp(/^\/\//.source+/(?:[\w\-.~!$&'()*+,;=%:]*@)?/.source+("(?:"+/\[(?:[0-9a-fA-F:.]{2,48}|v[0-9a-fA-F]+\.[\w\-.~!$&'()*+,;=]+)\]/.source)+"|"+/[\w\-.~!$&'()*+,;=%]*/.source+")"+/(?::\d*)?/.source,"m"),inside:{"authority-delimiter":/^\/\//,"user-info-segment":{pattern:/^[\w\-.~!$&'()*+,;=%:]*@/,inside:{"user-info-delimiter":/@$/,"user-info":/^[\w\-.~!$&'()*+,;=%:]+/}},"port-segment":{pattern:/:\d*$/,inside:{"port-delimiter":/^:/,port:/^\d+/}},host:{pattern:/[\s\S]+/,inside:{"ip-literal":{pattern:/^\[[\s\S]+\]$/,inside:{"ip-literal-delimiter":/^\[|\]$/,"ipv-future":/^v[\s\S]+/,"ipv6-address":/^[\s\S]+/}},"ipv4-address":/^(?:(?:[03-9]\d?|[12]\d{0,2})\.){3}(?:[03-9]\d?|[12]\d{0,2})$/}}}},path:{pattern:/^[\w\-.~!$&'()*+,;=%:@/]+/m,inside:{"path-separator":/\//}}},e.languages.url=e.languages.uri}e.exports=i,i.displayName="uri",i.aliases=["url"]}}]);