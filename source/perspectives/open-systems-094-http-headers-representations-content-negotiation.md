---
title: "HTTP Headers, Representations, and Content Negotiation"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-094-http-headers-representations-content-negotiation.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "HTTP fields describe requests, responses, representations, caching, authentication, and routing context. Content negotiation lets one resource have multiple representations without changing its identity."
eyebrow: "Open Systems Course · Lesson 94 of 180"
---

A URL identifies a resource. The bytes returned for that resource are a representation.

That distinction lets one resource have more than one useful form.

A server might represent the same underlying resource as:

- HTML;
- JSON;
- plain text;
- an image format;
- compressed or uncompressed content;
- one natural language or another.

HTTP fields carry the metadata that lets clients and servers reason about those forms.

## Fields are part of the protocol contract

HTTP fields can describe many different things.

Examples include:

- representation metadata;
- authentication credentials or challenges;
- cache directives;
- conditional request validators;
- routing context;
- content preferences;
- origin information.

A field name is not meaningful merely because it appears in a request. Its specification defines where it can appear and what it means.

RFC 9110 defines HTTP field semantics and common fields.

## Content-Type describes the selected representation

A response might include:

```http
Content-Type: application/json
```

That tells the recipient how the enclosed representation is identified.

A different response for the same conceptual resource might use:

```http
Content-Type: text/html; charset=utf-8
```

The resource can remain the same while the representation changes.

This distinction is useful for APIs that support both machine-readable and human-readable forms.

## Accept expresses a client preference

A request can say:

```http
Accept: application/json
```

or:

```http
Accept: text/html,application/xhtml+xml
```

The client is expressing preferences about acceptable response media types.

The server can use those preferences when selecting a representation.

It is still the server's responsibility to decide what it can provide.

Content negotiation is not a command that forces a representation into existence.

If no acceptable representation can be produced, `406 Not Acceptable` exists for that class of outcome, though deployments often choose other behaviors.

Likewise, if a request body uses a media type the server does not support, `415 Unsupported Media Type` is the relevant status.

Those are different failures:

```text
406:
response representation negotiation failed

415:
request content type is unsupported
```

## Content-Encoding is not Content-Type

Compression adds another layer.

A response can say:

```http
Content-Type: text/html
Content-Encoding: gzip
```

The media type is HTML.

The transfer representation has additionally been encoded with gzip.

After decoding the content encoding, the recipient still has HTML.

This is why compression does not change a PNG into "gzip data" at the semantic level. Gzip describes an encoding applied to the representation.

## Vary tells caches which request fields mattered

Suppose a server returns different representations based on:

```http
Accept-Language
```

A shared cache needs to know that two requests for the same URL can legitimately receive different selected responses based on that field.

The `Vary` response field communicates which request fields influenced representation selection.

For example:

```http
Vary: Accept-Language
```

Caching semantics are defined in RFC 9111.

Without the correct variation metadata, a cache can reuse a response for a request that should have selected a different representation.

That turns a header detail into a correctness issue.

## Validators reduce unnecessary transfers

A response can include validators such as:

```http
ETag: "abc123"
```

or:

```http
Last-Modified: Tue, 06 Oct 2026 10:00:00 GMT
```

A client can later make a conditional request.

If the selected representation has not changed according to the validator semantics, the server can respond with `304 Not Modified` instead of sending the full representation again.

The important model is:

```text
resource
  ↓
selected representation
  ↓
validator for that representation
  ↓
conditional request
```

Do not treat an ETag as a universal database version number unless your application explicitly defines it that way.

## Authorization fields do not equal authorization policy

An HTTP request can carry credentials through mechanisms such as the `Authorization` field.

The presence of that field does not prove the credential is valid.

The server still needs to authenticate the credential and apply authorization policy.

Similarly, a proxy can forward or remove authentication-related fields according to its configuration and trust boundary.

Protocol metadata and access-control decisions are different layers.

## Practical inspection

On a service you control, return the same logical object as HTML and JSON depending on the `Accept` field.

For example, make requests that prefer:

```text
text/html
application/json
```

Record:

- request `Accept`;
- response `Content-Type`;
- status;
- response body;
- any `Vary` field.

Then add an ETag and perform a conditional request.

The goal is to see that one resource can have multiple representations and that caches need metadata describing how the representation was selected.

## The lesson to carry forward

HTTP fields are not decoration around a body. They carry protocol state about representation, caching, authentication, conditional requests, and more.

Content negotiation separates the identity of a resource from the format chosen for a particular exchange.

The next lesson moves into the browser itself: what happens after a user enters a URL, from navigation and fetching through parsing, subresource discovery, script execution, layout, and painting.

## Interactive companion exercise

Use the [HTTP header/content-negotiation timeline](../prototypes/interactive-system-design.html#protocol-title) to explore Accept, Content-Type, Vary, and Cache-Control roles.
