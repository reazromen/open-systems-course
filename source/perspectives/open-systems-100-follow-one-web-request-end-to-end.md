---
title: "Follow One Web Request End to End"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-100-follow-one-web-request-end-to-end.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 15
excerpt: "One browser action can cross URL parsing, DNS, TLS, HTTP, cookies, CORS policy, reverse proxies, application code, caches, databases, and rendering. Following one request end to end connects the entire Web Systems module."
eyebrow: "Open Systems Course · Lesson 100 of 180"
---

We have spent nine lessons separating web-system boundaries.

Now connect them.

Consider a constructed example:

A signed-in user opens:

```text
https://app.example/account
```

The application is fronted by an edge proxy. The user's browser already has a session cookie. The account page needs one database query and one internal API call.

No real company or provider is being described.

The goal is to follow one request across the entire stack and ask what each observation proves.

## 0. The browser already has state

Before the user clicks anything, the browser may already contain:

- DNS cache;
- HTTP cache;
- TLS session state;
- open or reusable connections;
- cookies;
- local storage;
- service-worker state;
- JavaScript application state.

The operating system also has:

- interface addresses;
- routes;
- ARP or neighbor-cache entries;
- socket state.

The server side has:

- proxy configuration;
- connection pools;
- application workers;
- session records;
- database caches;
- deployment state.

A web request never starts from an abstract empty machine.

## 1. The browser parses the URL

The URL gives the browser structured information:

```text
scheme: https
host:   app.example
path:   /account
```

The scheme implies HTTPS semantics.

The host becomes part of DNS resolution, TLS service identity, HTTP authority, and browser-origin calculations.

The path identifies the target resource within the web application.

The same string participates in several protocols, but each protocol uses a different part.

## 2. Name resolution finds an address

The browser or operating system resolver obtains address data for:

```text
app.example
```

The answer can come from cache.

If not, the configured recursive resolver may perform DNS resolution.

Suppose it returns a public edge address.

That proves only that DNS produced address data.

It does not prove the edge is reachable or the application is healthy.

## 3. The host selects a route

The operating system chooses:

- source address;
- network interface;
- next hop;
- forwarding route.

The local link then delivers toward the first router.

Internet routers forward toward the public destination based on installed routing state.

If IPv4 NAT exists on the user's network, the source address and port can be translated on the way out.

All of that occurs before the application sees an HTTP request.

## 4. Transport state is established

Depending on negotiated protocol behavior, the browser can establish:

- TCP for HTTP/1.1 or HTTP/2;
- QUIC for HTTP/3.

Assume this example uses TCP.

The three-way handshake establishes transport state.

That proves the client can establish TCP with the public edge endpoint.

It does not prove the requested hostname has been authenticated yet.

## 5. TLS authenticates the public endpoint

The browser begins TLS.

The server presents certificate-based identity information.

The browser validates:

- an acceptable certificate path;
- trust-anchor policy;
- certificate validity;
- service identity for `app.example`.

If TLS succeeds, protected application traffic can begin.

This authenticates the TLS endpoint reached by the browser.

If the edge terminates TLS, the browser is authenticating the edge-facing service identity, not a private origin server hidden behind it.

## 6. HTTP carries the navigation request

The browser sends an HTTP request with semantics resembling:

```text
method: GET
target: /account
authority: app.example
```

Additional request fields can describe accepted representations, browser context, caching state, and other metadata.

The browser can also attach matching cookies.

A simplified conceptual request is:

```http
GET /account
Host: app.example
Cookie: session_id=...
```

The exact wire format depends on the negotiated HTTP version.

Do not copy HTTP/1.1 text formatting onto HTTP/2 or HTTP/3 framing.

## 7. The session cookie carries continuity

The cookie value is not automatically the user.

At the application boundary, the session mechanism might perform:

```text
session_id
   ↓ lookup
session record
   ↓
authenticated user identity
```

The server then checks whether the session is:

- present;
- valid;
- unexpired;
- not revoked.

Only after that can application authorization decide what the user is allowed to access.

A valid session does not mean every operation is permitted.

Authentication and authorization remain separate.

## 8. The edge or reverse proxy selects an upstream

The public edge receives the request and chooses where to send it.

That decision can depend on:

- hostname;
- path;
- deployment;
- service discovery;
- health state;
- load balancing.

The proxy creates or reuses a separate upstream connection.

Now there are two connection contexts:

```text
browser → edge
edge → application
```

They can have different addresses, timeouts, TLS policies, and connection reuse behavior.

The user still experiences one page load.

## 9. The application processes the request

The application receives the upstream request.

It may perform:

```text
parse request
   ↓
load session
   ↓
authorize account access
   ↓
validate parameters
   ↓
query account data
   ↓
call billing/profile service
   ↓
render response
```

Each step can fail independently.

An HTTP 500 from the application can occur after DNS, routing, TCP, TLS, proxying, session lookup, and authorization all succeeded.

That is why lower-layer success does not prove application correctness.

## 10. The application uses a database connection pool

Assume account data is stored in a relational database.

The application does not necessarily create a new database connection.

It can borrow one from a pool.

The request now depends on:

```text
pool has capacity
        ↓
database connection is usable
        ↓
query executes
        ↓
result is returned
```

If the pool is exhausted, the database itself can still be healthy.

If the query times out, the network to the browser can still be healthy.

The public request is a graph of dependencies.

## 11. The application calls an internal service

Suppose the page also needs billing status.

The application sends another request:

```text
application
   ↓
internal DNS/service discovery
   ↓
internal transport/TLS
   ↓
billing API
```

That is a new network transaction nested inside the original user request.

The browser never sees the internal address.

If the billing call fails, the application must decide whether to:

- fail the whole page;
- show partial data;
- use cached data;
- retry;
- degrade gracefully.

Those are product and architecture decisions.

## 12. The application creates the response

After obtaining its dependencies, the application constructs an HTTP response.

It might be HTML:

```text
200 OK
Content-Type: text/html
```

or JSON for a browser application.

The response can include:

- cache directives;
- ETag;
- updated cookies;
- security fields;
- tracing metadata.

The proxy receives that response.

It can forward it, transform permitted metadata, compress it, cache it, or generate another response if upstream handling fails.

Again, which component produced the final status matters.

## 13. The browser receives a representation, not a finished experience

If the response is HTML, the browser parses it.

It can then discover:

- CSS;
- JavaScript;
- images;
- fonts;
- API calls.

Each can trigger more fetches.

The browser applies same-origin policy, CORS rules, cookie rules, and other web-platform security policy.

Then it executes scripts, computes style, performs layout, and paints.

The original navigation response can be completely successful while the visible page remains broken because:

- script throws an exception;
- a stylesheet fails;
- a cross-origin API is blocked;
- a later API request returns 401;
- rendering logic is wrong.

"HTTP 200" is not a user-experience guarantee.

## 14. CORS may appear on later API calls

Suppose the rendered page calls:

```text
https://api.example/account/preferences
```

If that is another origin, browser CORS policy applies.

The API may receive an Origin field.

A preflight can occur depending on the request.

The API can respond successfully but fail to grant browser access under CORS policy.

That failure occurs after the network path works.

It is a browser security decision.

## 15. Caches can remove parts of the path

Suppose the page references:

```text
/app.css
```

A fresh browser cache can reuse the representation without another full transfer.

A CDN can also serve a cached object without reaching the origin.

Therefore two resources on the same page can have different effective paths:

```text
HTML:
browser → edge → application → database

CSS:
browser → local cache
```

or:

```text
image:
browser → CDN cache
```

A page load is not one topology.

It is a set of resource-specific paths.

## 16. Observability should follow the request across boundaries

A useful trace can connect:

```text
browser/request timing
        ↓
edge request id
        ↓
proxy log
        ↓
application trace
        ↓
database span
        ↓
internal API span
```

The goal is to answer:

**Where did time go, and where did the first failure occur?**

Logs answer discrete events.

Metrics show aggregate behavior.

Traces connect causally related operations.

Packet capture reveals network behavior when needed.

Browser developer tools show the client boundary.

No single tool is the whole truth.

## A compact end-to-end evidence table

For one request, collect:

```text
Layer                Evidence

URL/browser          requested URL, navigation context
DNS                  resolved addresses, TTL
routing              source, interface, next hop
transport            connection state
TLS                  version, certificate identity
HTTP                  method, target, status
session               session lookup result
authorization         allow/deny decision
proxy                 selected upstream
application           handler/result
database              pool wait + query result
internal service      downstream status/latency
response              content type/cache fields
browser               subresource/CORS/script/render state
```

The table is not a checklist to run for every normal request.

It is a map for when something goes wrong.

## Break one boundary at a time

In a local environment you control:

1. break DNS;
2. restore DNS and stop the public listener;
3. restore transport and use an invalid test certificate;
4. restore TLS and remove the session;
5. restore session state and deny authorization;
6. restore authorization and stop the database;
7. restore the database and stop an internal API;
8. restore the backend and introduce a browser-side script error.

At every stage, record:

- what the user sees;
- HTTP status if any;
- browser console/network evidence;
- proxy evidence;
- application evidence.

The visible symptom can remain "page does not work."

The failure boundary moves completely.

## What the entire Web Systems module added

The previous networking module got bytes to an endpoint.

This module added:

```text
HTTP semantics
request/response structure
methods and status codes
representations and negotiation
browser loading and rendering
cookies and sessions
same-origin policy and CORS
API contracts
reverse proxies and backends
end-to-end request tracing
```

The web is not one protocol.

It is a stack of protocols, browser rules, application state, deployment architecture, and data dependencies.

## The module to carry forward

A systems engineer should be able to look at a web failure and ask:

```text
Did the browser construct the request?
Did browser policy allow it?
Did DNS resolve?
Did transport/TLS succeed?
Which HTTP endpoint answered?
Which proxy handled it?
Which application instance ran?
Was the session valid?
Was the operation authorized?
Which backend dependency was used?
What response was produced?
What did the browser do with it?
```

That turns "the website is broken" into a sequence of testable contracts.

Module 11 moves below the application into **Data Systems**: filesystems, relational databases, indexes, transactions, caches, queues, durability, and one complete write path from application state to persistent storage.
