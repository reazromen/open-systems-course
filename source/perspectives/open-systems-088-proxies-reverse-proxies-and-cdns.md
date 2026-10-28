---
title: "Proxies, Reverse Proxies, and CDNs"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-088-proxies-reverse-proxies-and-cdns.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "An Internet request can terminate at an intermediary before it reaches an origin. Proxies, gateways, caches, and CDN edges create additional connections, trust boundaries, and failure domains."
eyebrow: "Open Systems Course · Lesson 88 of 180"
---

A client resolves a service name, reaches an IP address, establishes TLS, and receives a response.

It is tempting to conclude:

**the client connected directly to the application's origin server.**

That conclusion may be wrong.

Modern Internet services commonly place intermediaries between users and origins. A proxy can be selected by a client. A reverse proxy can accept requests on behalf of backends. A CDN edge can terminate connections near users, cache some responses, and create separate upstream connections.

The path is no longer one socket from browser to application process.

## Proxy and reverse proxy describe different viewpoints

RFC 9110 defines several HTTP intermediary roles.

A **proxy** is selected by the client, usually through configuration, to receive requests and forward or satisfy them.

A **gateway**, commonly called a **reverse proxy**, acts as an origin server toward the client-facing side and forwards requests inward toward another server or servers.

A simplified picture:

```text
forward proxy:

client
  ↓
proxy chosen by client
  ↓
remote service


reverse proxy:

client
  ↓
public gateway / reverse proxy
  ↓
private origin or backend
```

Both are intermediaries.

The direction of trust and configuration is different.

## One user request can create multiple network connections

Suppose a client talks to a reverse proxy over TLS.

The reverse proxy may then create a separate connection to an origin.

```text
client
  │
  │ TCP + TLS connection A
  ↓
edge / reverse proxy
  │
  │ separate connection B
  ↓
origin
```

Connection A and connection B can have:

- different IP endpoints;
- different TCP state;
- different TLS sessions;
- different certificates;
- different timeouts;
- different failure modes.

A successful client-to-edge TLS handshake proves nothing by itself about edge-to-origin TLS.

This is one of the most useful architectural facts in production web systems.

## A CDN is a deployment architecture, not one protocol

"CDN" does not define one universal wire protocol or topology.

A content-delivery network can combine mechanisms such as:

- DNS-based endpoint selection;
- anycast routing;
- geographically distributed edge sites;
- reverse proxying;
- HTTP caching;
- connection reuse;
- origin shielding;
- load balancing.

Different providers and deployments make different choices.

So avoid statements such as:

```text
all CDNs work by changing DNS
```

or:

```text
a CDN always serves content from cache
```

An edge can receive a request and still need to contact the origin.

The useful abstraction is:

**the edge becomes an additional system boundary between the client and origin.**

## Caching can shorten the request chain

HTTP caching allows a stored response to satisfy a later equivalent request when the protocol's caching rules permit it.

RFC 9111 defines HTTP caching semantics and distinguishes shared caches from private caches.

A cache hit can change the effective path:

```text
client → edge cache
```

instead of:

```text
client → edge → origin
```

That reduces work and can reduce latency.

But it also creates state.

A cached representation can be:

- fresh;
- stale;
- revalidated;
- invalidated by deployment-specific mechanisms;
- bypassed for a particular request.

"Origin is healthy" and "users see the new content" are therefore separate claims.

## TLS termination creates a trust boundary

If the edge terminates client TLS, it receives the application data after TLS decryption for that connection.

The edge may then protect the origin leg with another TLS connection.

This means the architecture contains at least two cryptographic relationships:

```text
client trusts edge identity
       ↓
edge makes independent origin connection
       ↓
edge applies origin trust policy
```

The client does not directly validate the certificate on the private origin leg unless the system uses an end-to-end design that preserves that relationship differently.

This is not automatically insecure.

It is an architectural boundary that must be explicit.

## Reverse proxies can do more than forward bytes

A reverse proxy can perform functions such as:

- TLS termination;
- routing requests to multiple backends;
- load balancing;
- authentication checks;
- header manipulation;
- compression;
- caching;
- rate limiting;
- observability.

Each feature adds policy and state.

That means a backend can be healthy while the public service fails because the reverse proxy is misconfigured.

The opposite can also happen: the edge can remain reachable and return a generated error while the origin is down.

An HTTP response from the edge is proof that **some** application-layer component responded, not proof that every backend succeeded.

## Origin addresses can be intentionally hidden from the client

A public DNS name may point only to edge addresses.

The origin can live:

- on private addressing;
- behind a firewall;
- on another provider;
- behind a tunnel;
- on a separate network reachable only by the edge.

The client's route therefore ends at the edge endpoint.

The edge has its own route to the origin.

Treat them as separate paths:

```text
client path:
user network → Internet → edge

origin path:
edge network → origin network → backend
```

A traceroute from the client cannot reveal the private origin path if packets never travel that path.

## Inspect without over-interpreting headers

For a public service you own or are authorized to inspect:

```bash
curl -vI https://example.com/
```

You can inspect:

- resolved addresses;
- connection endpoint;
- TLS certificate;
- response status;
- response headers.

Headers such as `Via`, cache-related fields, or provider-specific diagnostics can reveal intermediaries when present.

Absence of a provider-specific header is not proof that no intermediary exists.

Architecture should be confirmed from configuration and controlled observations, not guessed from one response.

## Build a local reverse-proxy experiment

You can make the boundary visible on one computer.

Run a local origin:

```bash
python3 -m http.server 8080 --bind 127.0.0.1
```

Then configure an open-source reverse proxy such as Caddy or nginx to listen on another local port and forward to `127.0.0.1:8080`.

Request the proxy endpoint rather than the origin directly.

Observe:

```text
client socket → reverse proxy socket
reverse proxy socket → origin socket
```

Use `ss -tnp` or local packet capture if authorized.

Then stop only the origin.

The reverse proxy can remain listening while upstream requests fail.

That is a concrete demonstration that listener health and dependency health are different states.

## Add caching carefully

If your chosen reverse proxy supports caching, configure it only in the test environment.

Request the same static object repeatedly.

Record whether the proxy contacts the origin each time.

Then stop the origin and test again.

Depending on the explicit cache policy and object state, some content might still be served while uncached content fails.

Do not generalize from one product configuration to every CDN.

The point is to observe how cached state changes dependency on the origin.

## Build a failure ladder

For an edge-mediated service:

```text
Can the client resolve the public name?
        ↓
Can it reach the edge address?
        ↓
Can it establish client-facing TLS?
        ↓
Does the edge accept the request?
        ↓
Can the edge select an upstream?
        ↓
Can the edge resolve/reach the origin?
        ↓
Does origin-side TLS succeed if used?
        ↓
Does the origin application respond?
        ↓
Does the edge return the intended response?
```

A single "502" often lives in the middle of that ladder, not at the client's local network.

## The lesson to carry forward

Proxies and CDN edges split an apparently simple request into multiple connections and administrative boundaries.

That can improve performance, availability, security, and operational control.

It also creates more places where state can disagree.

The next lesson builds a disciplined failure model across DNS, routing, transport, TLS, intermediaries, and applications so that "the Internet is down" becomes a set of testable hypotheses.

## Interactive companion exercise

Trace a client request through a CDN/reverse proxy, cache decision, origin, and response in the [proxy timeline](../prototypes/interactive-system-design.html#protocol-title).
