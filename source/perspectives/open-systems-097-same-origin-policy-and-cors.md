---
title: "Same-Origin Policy and CORS"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-097-same-origin-policy-and-cors.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "Browsers isolate origins so one site cannot freely read another site's data. CORS is a controlled browser permission mechanism for cross-origin HTTP access, not an authentication system or network firewall."
eyebrow: "Open Systems Course · Lesson 97 of 180"
---

A browser can reach many servers.

That does not mean JavaScript from one site should be allowed to read data from all of them.

If arbitrary code loaded from one page could freely read your bank, webmail, router UI, and internal dashboards, the browser would turn every visited site into a universal credentialed HTTP client.

The web platform therefore has a security boundary based heavily on **origin**.

## An origin is more specific than a domain name

At a practical level, an origin is determined by the tuple:

```text
scheme + host + port
```

For example:

```text
https://example.com
https://api.example.com
http://example.com
https://example.com:8443
```

are not all the same origin.

RFC 6454 defines the web-origin concept, and the HTML and Fetch standards define the current browser behavior around origins and fetching.

This matters because two services owned by the same organization can still be cross-origin to the browser.

Administrative ownership and browser origin are different concepts.

## Same-origin policy limits script access

The same-origin policy is not one single rule implemented in one place.

It is a broad browser security principle used across APIs and resources.

A useful mental model is:

```text
document from origin A
        ↓
script execution
        ↓
browser asks:
"may this context read or manipulate data from origin B?"
```

Many cross-origin operations are restricted.

Some cross-origin actions are still allowed. For example, pages have long been able to embed images, navigate to other sites, and submit certain forms.

The important distinction is often not "can a request be sent?" but:

**can script read the response or access the other origin's protected state?**

## CORS relaxes one browser boundary

Cross-Origin Resource Sharing, or CORS, is integrated into the Fetch standard.

A server can return response fields that tell a browser which origins are permitted to access a response through CORS-enabled fetch APIs.

A simple conceptual response might include:

```http
Access-Control-Allow-Origin: https://app.example
```

That tells a conforming browser that the specified origin is allowed to access the response under the applicable CORS rules.

CORS does not create network reachability.

CORS does not authenticate the user.

CORS does not authorize a business operation by itself.

CORS is browser-enforced cross-origin sharing policy.

## A CORS error can happen after the server responded

This is one of the most confusing parts of browser debugging.

A browser script can issue a cross-origin request.

The server can receive it.

The server can process it.

The server can even return HTTP 200.

Then the browser can block script access to the response because the CORS policy does not permit it.

From the server:

```text
request received
response sent
```

From JavaScript:

```text
fetch failed due to browser policy
```

Both observations can be true.

This is why "CORS error" does not automatically mean the API never saw the request.

## Some requests trigger a preflight

For certain cross-origin requests, the browser first sends a CORS preflight request, normally using the OPTIONS method.

The browser is asking whether the intended cross-origin request is permitted.

Conceptually:

```text
browser
   ↓
OPTIONS preflight
   ↓
server CORS policy response
   ↓
browser decision
   ↓
actual request, if permitted
```

The Fetch standard defines which requests are CORS-safelisted and when preflight is required.

Do not memorize a tiny list without understanding the reason.

A preflight exists because some cross-origin requests can carry methods or fields that web pages historically could not send through simpler mechanisms.

The browser asks permission before sending the actual operation.

## Preflight success and request authorization are separate

Suppose a server responds to preflight with permission for:

```text
origin: https://app.example
method: PUT
field: Authorization
```

That does not mean every PUT request is authorized.

The actual request still needs normal authentication, authorization, validation, and application policy.

Think of the layers:

```text
CORS:
may this browser origin make/read this cross-origin request?

authentication:
who is the caller?

authorization:
may that identity perform this operation?

application validation:
is the requested state transition valid?
```

Combining these into one "security check" makes systems harder to reason about.

## Credentials make policy stricter

Cross-origin requests can interact with cookies and other credentials.

When credentials are involved, CORS rules require more explicit handling. A wildcard origin is not a substitute for deliberate credentialed access policy.

This matters because a server that reflects arbitrary origins while permitting credentials can undermine the browser boundary it was supposed to control.

The origin allowlist should come from actual application architecture.

Do not generate it from untrusted request data without policy.

## CORS does not protect server-to-server APIs

A command-line client, backend service, or custom program is not required to enforce browser CORS policy.

That means this request can succeed from a server-side HTTP client even when browser JavaScript is blocked.

Therefore:

```text
"CORS blocks unauthorized API access"
```

is false as a security model.

The API must still authenticate and authorize requests independently.

CORS protects a browser interaction boundary.

It is not a replacement for server security.

## Same-site and same-origin are not the same concept

Cookie policy introduces another term: **site**.

SameSite cookie behavior uses a site concept that is not identical to same-origin.

Two URLs can be cross-origin while still belonging to the same site under browser cookie rules.

This distinction becomes important in authentication and CSRF design.

Do not use "same-site" and "same-origin" interchangeably.

They solve related but different web-security problems.

## Inspect a CORS exchange

Use a test API you control.

Serve a page from one local origin, for example one port, and an API from another port.

Even on the same hostname, different ports create different origins.

In the browser network panel, trigger a cross-origin request.

Observe:

- Origin request field;
- OPTIONS request if a preflight occurs;
- Access-Control-Allow-Origin response field;
- Access-Control-Allow-Methods when relevant;
- Access-Control-Allow-Headers when relevant;
- actual request;
- browser console result.

Then deliberately remove the CORS response fields while leaving the API functional.

You can observe:

```text
server works
browser policy rejects cross-origin access
```

That is the boundary made visible.

## Build a failure ladder

For a browser cross-origin failure:

```text
Did DNS/network/TLS reach the API?
        ↓
Did the browser send a preflight?
        ↓
Did the server answer the preflight?
        ↓
Did the CORS response permit the requesting origin?
        ↓
Did it permit the method and request fields?
        ↓
Did the browser send the actual request?
        ↓
Did authentication succeed?
        ↓
Did authorization succeed?
        ↓
Did application processing succeed?
        ↓
Did the browser expose the response to script?
```

This prevents a 401 authentication error from being misdiagnosed as CORS, or a CORS rejection from being treated as network failure.

## The lesson to carry forward

The browser is an active security participant.

Same-origin policy creates isolation between web origins.

CORS provides controlled exceptions for HTTP access across those origins.

Neither one replaces server-side authentication or authorization.

The next lesson moves into the API contract itself: resources, validation, error formats, compatibility, and versioning.
