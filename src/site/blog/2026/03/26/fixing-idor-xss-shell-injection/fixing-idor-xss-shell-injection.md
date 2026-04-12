# Fixing IDOR, XSS, shell injection

## Introduction

Evening 28 February 2026. I was having some usual maintance over [plemiona-planer.pl](https://plemiona-planer.pl/) that I do on my free time for many years. At the end of session after merging changes (irrevelant from the point of this read), for some reason I used the following prompt in Copilot that I usually use in personal environment:

> in #file:views.py look for permission bugs eg forgot to get owner=request.user

> Findings
>
> \* Found 3 object-level authorization gaps (IDOR style) in authenticated endpoints where object lookups were not fully scoped to the current user.


> please help me find all other IDOR-style risks in other views on backend
>
>i suspect #file:outline_initial_changes.py may also have bugs like this
>
> but scan #file:views and handle it as you did - fix and add regression test. Dont add unnecessary select_related please


> how serious is each of this problems? off_troops field in outline view is the most important one and its derivaties, that someone can easily see targets or weight of someone else, this is disaster
>
> changing other outline time is bad thing but not getting data

```
Severity (based on audited endpoints)

Critical if exploited: cross-outline read path in outline_initial_views.py (the previous target mismatch). This could expose another user’s target/weights data; that is a confidentiality breach and closest to your “disaster” scenario.

High: cross-outline write paths in outline_initial_changes.py and part of views.py. These let an attacker alter/delete/reorder commands or bindings for someone else (integrity impact), even when data theft is limited.

Medium: outline-time manipulation endpoints in outline_initial_views.py and target-time/building updates in views.py. Mostly unauthorized state changes, not broad data exfiltration.

Low/Design-dependent: shipment token behavior in views.py. If token secrecy is the intended trust model, this is acceptable; risk is token leakage, not ID guessing.
```
---

Last updated: 2026-04-06

Content license: CC BY-NC 4.0 — share and adapt with attribution, no commercial use.