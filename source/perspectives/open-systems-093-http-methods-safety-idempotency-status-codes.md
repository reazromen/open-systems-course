---
title: "HTTP Methods, Safety, Idempotency, and Status Codes"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-093-http-methods-safety-idempotency-status-codes.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "HTTP methods describe request semantics, while safety and idempotency help clients, caches, retries, and intermediaries reason about consequences. Status codes report protocol-level outcomes."
eyebrow: "Open Systems Course · Lesson 93 of 180"
---

A method name is not merely a verb chosen for style.

HTTP methods carry semantics that clients, servers, proxies, caches, retry logic, and operators can reason about. If an API uses methods carelessly, the system can still appear to work while losing useful protocol guarantees.

RFC 9110 defines the semantics of the core HTTP methods.

## GET means retrieval

A GET request asks for a representation of the selected resource.

That does not mean the server must read a static file. The resource could be computed, database-backed, proxied, or generated.

What matters is the semantic contract: GET is a retrieval method and is defined as safe.

A safe method is one whose defined semantics are essentially read-only from the client's perspective. Servers may still perform logging, metrics, cache updates, or other incidental work.

So "safe" does not mean "nothing anywhere changes."

It means the client is not requesting a state-changing operation as the purpose of the request.

## POST is intentionally broad

POST asks the target resource to process the enclosed representation according to the resource's own semantics.

That can mean:

- create something;
- submit a form;
- trigger processing;
- append an event;
- ask a service to perform an operation.

POST is not defined as safe or idempotent.

Repeating the same POST can therefore create a second effect unless the application adds its own idempotency mechanism.

This becomes critical when clients retry after timeouts.

## PUT and DELETE are idempotent by definition

An idempotent method can be repeated with the same intended effect as making it once.

PUT is idempotent. DELETE is idempotent.

That does not mean repeated requests produce byte-for-byte identical responses. Timestamps, audit records, version counters, or representation details can change. The important property is the requested effect on the target resource.

If a client sends the same PUT twice because the first response was lost, the second request is not supposed to create a second independent resource as a consequence of the method semantics.

Idempotency is therefore a systems property that helps with retries.

## PATCH is different

PATCH is commonly used for partial modification, but its semantics are defined separately from the core methods in RFC 5789.

A PATCH operation may or may not be idempotent depending on the patch document and application semantics.

For example:

```text
set counter to 10
```

can be idempotent.

But:

```text
increment counter by 1
```

is not.

Do not infer idempotency from the word "update."

## Status codes describe the HTTP result

HTTP status codes are grouped into classes:

- 1xx — informational;
- 2xx — successful;
- 3xx — redirection;
- 4xx — client error;
- 5xx — server error.

The class gives broad meaning. The specific code provides more precise semantics.

Examples:

- 200 OK — successful response under the method's semantics;
- 201 Created — successful creation with additional creation semantics;
- 204 No Content — success with no response content;
- 304 Not Modified — conditional request result used with caching;
- 400 Bad Request — request could not be processed as a valid request;
- 401 Unauthorized — authentication is required or has failed under the relevant challenge scheme;
- 403 Forbidden — request understood but refused;
- 404 Not Found — target resource not found or not disclosed;
- 409 Conflict — request conflicts with current resource state;
- 429 Too Many Requests — rate limiting or request throttling;
- 500 Internal Server Error — unexpected server condition;
- 502 Bad Gateway — gateway/proxy received an invalid upstream response;
- 503 Service Unavailable — service temporarily unable to handle the request;
- 504 Gateway Timeout — gateway/proxy timed out waiting for upstream.

A 4xx code does not mean "the user's laptop is broken." It means the server is classifying the request as a client-side protocol/application problem at that boundary.

A 5xx code does not necessarily mean the process that returned it is itself the failing component. A gateway can report an upstream failure.

## Retries must respect semantics

Suppose a client times out after sending a request.

It does not know whether:

- the request never reached the server;
- the server received it but did not complete;
- the server completed it but the response was lost.

For idempotent methods, automatic retry is easier to reason about.

For non-idempotent operations, an application may need a request identifier or idempotency key so that a repeated delivery does not create a duplicate business effect.

That is an application-level mechanism layered on top of HTTP method semantics.

## Practical inspection

On a test API you control, create one endpoint for GET and one for POST.

Record a server-side request counter.

Call GET repeatedly. Then call POST repeatedly with the same body.

Observe whether the business state changes.

Next, simulate a client timeout after the server has already processed the POST. Retry the request manually.

The goal is to distinguish:

```text
message delivered twice
```

from:

```text
business effect applied twice
```

Those are not the same system property.

## Status codes are evidence, not prose

When diagnosing a failed request, preserve:

```text
method
target
status
response fields
response content
which component returned it
```

A `502` from an edge proxy and a `500` from the origin application are different failure boundaries.

Do not rewrite every non-200 response into "API down."

## The lesson to carry forward

Methods tell the server what kind of operation the client is requesting. Safety and idempotency constrain what clients and intermediaries can assume. Status codes report the HTTP-level outcome.

The next lesson adds representation metadata, headers, content negotiation, and caching-related fields.
