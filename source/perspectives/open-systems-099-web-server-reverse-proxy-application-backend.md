---
title: "Web Server, Reverse Proxy, Application, and Backend"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-099-web-server-reverse-proxy-application-backend.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 13
excerpt: "A production web request often crosses several processes and services before it reaches business data. Separating edge, proxy, application, cache, queue, and database roles makes failures and trust boundaries easier to locate."
eyebrow: "Open Systems Course · Lesson 99 of 180"
---

A browser sends one request.

The server side may contain many systems.

A simplified production path can be:

```text
client
  ↓
edge or load balancer
  ↓
reverse proxy / gateway
  ↓
application process
  ↓
cache / database / queue / other service
```

Each arrow can cross a process boundary, a host boundary, a network boundary, or an administrative boundary.

The most important habit is to stop calling all of it "the server."

## A web server can mean several things

The phrase **web server** is overloaded.

It can mean:

- software that accepts HTTP connections;
- a reverse proxy;
- a static-file server;
- an application process;
- a machine hosting several web-related services.

That ambiguity causes bad incident conversations.

Instead of saying:

```text
the web server is broken
```

say what is actually failing:

```text
public TLS listener
reverse-proxy route
application worker
database dependency
cache cluster
upstream API
```

Precise component names produce smaller hypotheses.

## The edge terminates the public path

A public service often has an edge component such as a CDN, load balancer, or ingress proxy.

That component can:

- accept public TCP or QUIC connections;
- terminate TLS;
- enforce request limits;
- route by host or path;
- add observability metadata;
- cache responses;
- choose an upstream.

The public DNS name may resolve to the edge, not the origin application host.

That means:

```text
client reached public IP
```

proves only the client-to-edge portion of the architecture.

The edge still needs a healthy path inward.

## A reverse proxy creates another request boundary

RFC 9110 describes intermediaries including gateways, which are commonly called reverse proxies.

A reverse proxy acts as the server toward the client and as a client toward an upstream.

That creates two relationships:

```text
client → reverse proxy
reverse proxy → upstream
```

Those relationships can use different:

- addresses;
- ports;
- protocols;
- TLS policies;
- timeouts;
- authentication mechanisms;
- connection pools.

A successful public connection says nothing automatic about upstream health.

## Routing is application architecture

A proxy can route by:

- hostname;
- path prefix;
- request method;
- header;
- deployment metadata;
- service-discovery result.

For example:

```text
/api/        → application service
/static/     → object/static service
/admin/      → separate protected application
```

The client still sees one public origin.

Behind that origin can be several independent services.

This is why one URL path can fail while another path on the same hostname remains healthy.

## The application process owns business logic

The application process can:

- authenticate the session;
- authorize the requested operation;
- validate input;
- execute business logic;
- read or write state;
- call dependencies;
- construct the HTTP response.

It may run as:

- one process;
- many workers;
- containers;
- virtual machines;
- serverless functions;
- processes on multiple hosts.

A load balancer or reverse proxy can distribute requests across those instances.

That makes local in-memory state dangerous unless the architecture deliberately handles affinity or replication.

## Backends are not implementation details during failure

An application can depend on:

- relational database;
- key-value cache;
- object storage;
- message queue;
- identity provider;
- search service;
- another API.

To the user, the service is one page.

To the application, one request may be a dependency graph.

Constructed example:

```text
GET /account
   ↓
session lookup
   ↓
user database
   ↓
billing service
   ↓
template rendering
   ↓
response
```

If the billing service times out, the public request can fail even though the web process and database are healthy.

Dependencies are part of availability.

## Connection pools create hidden state

Applications rarely create a brand-new database or upstream connection for every request.

They use pools.

A connection pool has state:

- maximum size;
- idle connections;
- in-use connections;
- connection lifetime;
- waiting requests;
- health checks;
- retry behavior.

A database can be healthy while the application cannot acquire a connection because its pool is exhausted.

Likewise, the network can be healthy while stale pooled connections cause intermittent failures.

When a system "randomly" fails, shared pools deserve inspection.

## Timeouts form a chain

Consider:

```text
browser timeout:             30 s
edge timeout:                20 s
reverse proxy upstream:      10 s
application DB timeout:       5 s
database statement timeout:   4 s
```

This ordering can be intentional.

The inner dependency should often fail before the outer caller gives up, leaving enough time to return a useful error.

If the proxy times out before the application dependency does, the application may continue working on a request whose client has already gone away.

Timeouts are therefore architecture, not just tuning constants.

## 502, 503, and 504 point to different boundaries

In gateway deployments, several common failures become especially useful:

```text
502 Bad Gateway
gateway received an invalid response from upstream

503 Service Unavailable
service cannot currently handle the request

504 Gateway Timeout
gateway did not receive a timely upstream response
```

These are HTTP semantics.

A 502 does not mean the user's Internet connection is broken.

A 504 does not prove the origin process is down.

It means the component returning the code classified the failure at its upstream boundary.

Always record **which component generated the status**.

## Health checks can lie by being too shallow

A process can return:

```text
200 /health
```

while its database is unavailable.

That may be correct if `/health` only means "process is alive."

A readiness check can answer a different question:

```text
should this instance currently receive production traffic?
```

A dependency check can answer another:

```text
can this application currently reach required backends?
```

One green endpoint should not be made to prove every property of the service.

Name health signals after the contract they actually verify.

## Request IDs connect evidence

When one request crosses several components, logs need a way to be correlated.

A request or trace identifier can be propagated:

```text
edge
 ↓ same trace/request context
proxy
 ↓
application
 ↓
database/client spans
```

OpenTelemetry defines conventions and context propagation for distributed telemetry.

The identifier is not the diagnosis.

It is the thread that lets you gather evidence from multiple boundaries without guessing which log lines belong together.

## Headers across trust boundaries need policy

Reverse proxies often add forwarding metadata such as the original client address or original protocol.

Those fields become dangerous if the application blindly trusts values supplied directly by an untrusted client.

The architecture needs a trust rule:

```text
only the trusted proxy may define authoritative forwarding metadata
```

The application should know which upstream proxy is trusted and which fields are sanitized or replaced.

Never treat a header as trusted merely because its name begins with `X-` or looks infrastructure-related.

## Queues change request timing

Some operations should not complete synchronously.

An application can accept a request, create a job, enqueue it, and return a response before the background work finishes.

The path becomes:

```text
HTTP request
   ↓
application
   ↓
job record / queue
   ↓
HTTP response: accepted
             later
queue → worker → external effect
```

The request can succeed while the eventual job fails.

That means the API needs a model for job state.

"HTTP returned 202" and "task completed" are different events.

## Inspect your own deployment

Draw one production or local service as boxes.

Include:

- public DNS;
- edge/tunnel/load balancer;
- reverse proxy;
- application;
- session store;
- database;
- cache;
- queue;
- external dependency.

For each arrow write:

```text
protocol
address/port
TLS?
authentication?
timeout?
retry?
owner?
observable logs/metrics?
```

Any arrow you cannot describe is an operational blind spot.

## Build a local three-process experiment

Create:

1. a small backend application on one port;
2. a reverse proxy on another port;
3. a client using a command-line HTTP tool.

Then test three failures:

- stop the backend;
- keep backend running but make one route slow;
- return an application 500 deliberately.

Observe whether the reverse proxy produces a different status for each case.

The goal is not to learn one proxy product.

It is to see that the proxy and the application are independent state machines.

## Build a failure ladder

For a public request:

```text
Did the request reach the edge?
        ↓
Did the edge select a route?
        ↓
Did the proxy reach an application instance?
        ↓
Did the application accept the request?
        ↓
Did authentication/authorization succeed?
        ↓
Could the app acquire backend connections?
        ↓
Did dependencies respond before deadlines?
        ↓
Did the app generate a response?
        ↓
Did the proxy return it to the client?
```

Every line can have its own logs and metrics.

That is much more useful than saying "backend issue."

## The lesson to carry forward

A production web service is usually a graph of cooperating components.

The public endpoint, reverse proxy, application, database, cache, queue, and external services have different responsibilities and failure modes.

The final lesson of this module follows one web request end to end and annotates which state changes at every boundary.

## Interactive companion exercise

Trace a request through a reverse proxy/CDN cache decision, origin forwarding, and response return in the [proxy timeline](../prototypes/interactive-system-design.html#protocol-title).
