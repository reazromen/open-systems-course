---
title: "Anatomy of an HTTP Request and Response"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-092-anatomy-http-request-response.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 11
excerpt: "An HTTP exchange combines method, target, fields, content, status, and representation metadata. Each piece carries a different part of the protocol contract."
eyebrow: "Open Systems Course · Lesson 92 of 180"
---

An HTTP exchange is easy to recognize and easy to oversimplify.

A request is not merely a URL. A response is not merely a body. Each message carries structured information that tells the other endpoint what operation is being attempted, which resource is involved, what metadata applies, and how to interpret any content.

## A request has several semantic parts

Consider a constructed HTTP/1.1 request:

```http
POST /api/messages?notify=true HTTP/1.1
Host: api.example.com
Content-Type: application/json
Accept: application/json

{"text":"hello systems"}
```

At the semantic level it contains a method, a request target, fields, and content. RFC 9110 defines these HTTP semantics.

The method describes the requested action semantics. The target identifies the resource or operation context. Fields carry metadata and control information. The content carries representation data when appropriate.

The target path does not reveal the server's implementation. A path such as `/api/messages` might map to application code, a database-backed resource, a queue, a reverse-proxy route, or another service.

## Fields are structured metadata

Examples include:

```http
Host: api.example.com
Accept: application/json
Content-Type: application/json
Authorization: Bearer ...
Cache-Control: no-cache
```

Some fields affect routing. Some affect authentication. Some describe representations. Some influence caching. They are not interchangeable free-form annotations.

A particularly useful distinction is:

```text
Content-Type:
"this message content is JSON"

Accept:
"I prefer a response representation such as JSON"
```

Sending `Accept: application/json` does not force a server to support JSON. It expresses a preference under HTTP content-negotiation rules.

## A response begins with status

A constructed response might be:

```http
HTTP/1.1 201 Created
Content-Type: application/json
Location: /api/messages/784

{"id":784,"state":"queued"}
```

The status code communicates the HTTP outcome. Fields add metadata. The body can carry richer application detail.

A successful status does not prove a business operation succeeded in every domain-specific sense, and a failed status does not reveal the entire root cause.

## Message length matters in HTTP/1.1

HTTP/1.1 can carry multiple messages on a persistent connection. The receiver therefore needs unambiguous message boundaries. RFC 9112 defines HTTP/1.1 messaging and framing rules.

That is not just a parser detail. If two components disagree about where one request ends and another begins, the disagreement can become a security problem.

HTTP/2 and HTTP/3 solve framing differently. HTTP/2 uses binary frames and streams. HTTP/3 uses QUIC streams and HTTP/3 framing. The semantic concepts remain: method, target, fields, content, status, and representation metadata.

## What the browser sends may not be what the origin sees

An intermediary can add, remove, or transform metadata according to protocol rules and deployment policy. A reverse proxy can terminate one connection and create another.

So:

```text
client-side request view
≠
byte-for-byte origin-side request view
```

If you need to know what the origin actually received, inspect origin-side logs or traces. Browser developer tools prove the client-facing boundary. Proxy logs prove another boundary.

## Bodies can be absent

Many requests and responses do not contain message content. A GET request can be complete without a body. A `204 No Content` response intentionally carries no response content under its semantics.

Do not build a mental model in which every successful response must contain JSON.

## Practical inspection

On a site or service you are authorized to inspect, open the browser network panel and choose one request. Record:

- method;
- URL;
- request fields;
- request content, if any;
- response status;
- response fields;
- response content type.

Then compare the browser's view with server or reverse-proxy logs if you control them.

The point is to see that one user action creates several different protocol observations at different boundaries.

## The lesson to carry forward

An HTTP exchange is a structured protocol message, not just "data over the web."

Method, target, fields, status, and content each carry separate meaning. The next lesson focuses on methods, safety, idempotency, and status codes.
