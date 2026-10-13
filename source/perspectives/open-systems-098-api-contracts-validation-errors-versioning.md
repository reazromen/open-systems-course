---
title: "API Contracts: Resources, Validation, Errors, and Versioning"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-098-api-contracts-validation-errors-versioning.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 13
excerpt: "An HTTP API is more than routes and JSON. A durable contract defines resources, schemas, validation, error semantics, compatibility, idempotency, and how change is introduced."
eyebrow: "Open Systems Course · Lesson 98 of 180"
---

An API can return valid JSON and still be a bad interface.

Why?

Because syntax is only one layer of the contract.

A useful API contract answers questions such as:

- what resources exist;
- which operations are allowed;
- what fields mean;
- which values are required;
- how errors are represented;
- what retries are safe;
- how pagination works;
- how clients discover change;
- what remains compatible across versions.

HTTP gives us a transport and semantic foundation.

The application still has to define the domain contract.

## Start from resources and operations

Consider a message service.

A weak design starts with routes:

```text
POST /doThing
POST /getThing
POST /updateThing
```

A stronger design asks what the resources are and how HTTP semantics fit them.

For example:

```text
GET    /messages/784
POST   /messages
DELETE /messages/784
```

That does not mean every API must be perfectly REST-shaped.

The point is to make the protocol semantics and domain model reinforce each other rather than fight each other.

A resource-oriented design can make caching, idempotency, observability, authorization, and documentation easier to reason about.

## A schema is part of the contract

Suppose a client sends:

```json
{
  "recipient": "user-42",
  "text": "hello"
}
```

The server needs rules for:

- required fields;
- allowed types;
- length limits;
- enum values;
- nested structures;
- unknown fields;
- default behavior.

Without an explicit schema, clients discover the contract by trial and error.

JSON Schema is one standardized way to describe JSON structure and validation constraints.

OpenAPI can describe HTTP API operations, parameters, schemas, responses, and other interface details.

The specification is not the implementation.

But it can make the intended contract inspectable.

## Parsing and validation are different stages

A request can be syntactically valid JSON and still be invalid for the application.

For example:

```json
{
  "recipient": "",
  "text": "hello"
}
```

The parser can succeed.

The application validator can reject the empty recipient.

A useful processing model is:

```text
bytes
  ↓
HTTP framing
  ↓
media-type parsing
  ↓
schema validation
  ↓
business validation
  ↓
authorization
  ↓
state transition
```

Different systems can order some policy checks differently, but the distinction remains valuable.

"Invalid JSON" is not the same failure as "valid JSON with an invalid business value."

## Error responses need stable structure

If every endpoint invents its own error shape, clients become fragile.

One endpoint returns:

```json
{"error":"bad request"}
```

another:

```json
{"message":"failed"}
```

another:

```json
{"code":17,"detail":"recipient missing"}
```

A consistent error model helps clients distinguish machine-readable categories from human-readable details.

RFC 9457 defines Problem Details for HTTP APIs.

A problem response can contain standardized members such as:

- type;
- title;
- status;
- detail;
- instance;

and can be extended with application-specific fields.

The goal is not to make every API use one exact error body.

The goal is to make errors part of the documented contract rather than ad-hoc strings.

## HTTP status and application error should agree

If validation fails, returning HTTP 200 with:

```json
{"success":false}
```

throws away useful HTTP semantics.

Sometimes application protocols deliberately define such behavior, but it should be an explicit decision.

Usually, a client benefits when the HTTP status represents the request outcome class and the body provides richer detail.

For example:

```text
400
request syntax/structure invalid

401
authentication required or failed

403
identity known but operation forbidden

404
target resource unavailable/not disclosed

409
request conflicts with current state

422
content understood but semantically invalid

429
rate limit exceeded

500
unexpected server failure
```

The exact choice depends on the contract and current HTTP semantics.

Do not select status codes based only on English wording.

## Validation errors should point to the failing field

For a structured request, a useful error can identify:

- field or path;
- error code;
- human-readable message;
- expected constraint.

Constructed example:

```json
{
  "type": "https://api.example/problems/validation",
  "title": "Request validation failed",
  "status": 422,
  "errors": [
    {
      "path": "recipient",
      "code": "required",
      "message": "recipient must not be empty"
    }
  ]
}
```

The URL and content are constructed.

The important property is stability.

Client code can reason about `code` and `path` without parsing prose.

## Idempotency belongs in the API contract

A payment, job submission, or message-send API can receive the same operation more than once because of retries.

The API must define whether repeated delivery can create repeated effects.

Some operations fit naturally with idempotent HTTP methods.

Others use application-level idempotency keys.

Conceptually:

```text
client operation id
      ↓
server remembers completed/requested operation
      ↓
duplicate delivery
      ↓
same logical outcome instead of duplicate effect
```

This is not free.

The server needs storage, expiration policy, conflict handling, and a definition of what counts as "the same operation."

Retry semantics belong in the contract, not in a hidden client library assumption.

## Pagination is also protocol state

A list endpoint can become enormous.

Pagination needs a contract around:

- page size;
- ordering;
- continuation;
- consistency under concurrent changes.

Offset pagination:

```text
?page=5&limit=20
```

is easy to understand but can shift when records are inserted or deleted.

Cursor pagination can represent continuation based on ordered state.

Neither is universally better.

The API should define the ordering and what a cursor means.

A cursor should be treated as an opaque token unless the API explicitly documents its structure.

## Versioning is a change-management problem

Teams often jump directly to:

```text
/v1/
/v2/
```

But versioning is not fundamentally about the URL.

It is about compatibility.

A change can be:

- backward compatible;
- additive;
- conditionally compatible;
- breaking.

Examples of often-compatible changes include adding an optional response field when clients are required to ignore unknown fields.

Examples of breaking changes include changing a field's meaning or removing a required property that clients depend on.

Versioning strategies can include:

- URL versions;
- media-type versions;
- header-based versions;
- date-based compatibility contracts;
- separate endpoints or products.

No single strategy solves bad compatibility discipline.

## Deprecation needs a lifecycle

A mature API needs a path from:

```text
supported
  ↓
deprecated
  ↓
migration window
  ↓
retired
```

Clients need enough information to migrate.

That can include:

- documentation;
- change logs;
- response metadata;
- usage telemetry;
- explicit deadlines.

Removing an endpoint without knowing who still uses it is an operational failure, not merely a versioning decision.

## Contract tests protect both sides

An API implementation can pass unit tests while breaking clients.

Contract tests can verify:

- required fields remain present;
- response types remain compatible;
- error shapes remain stable;
- documented status codes are used;
- authentication requirements remain correct;
- schemas match actual output.

If an OpenAPI description exists, CI can compare it against implementation behavior or detect breaking schema changes.

The contract becomes executable evidence.

## Practical inspection

Choose one API you operate.

For a single endpoint, write down:

```text
method
path
authentication
request schema
success status
success schema
validation errors
authorization errors
retry behavior
rate-limit behavior
pagination, if any
versioning rule
```

Then compare the written contract with the actual implementation and logs.

Every mismatch is technical debt.

Do not start by generating documentation automatically.

First verify the contract you intend to preserve.

## Break it safely

On a test API:

1. omit a required field;
2. send the wrong type;
3. send an unknown field;
4. send a duplicate operation;
5. request an unknown resource;
6. trigger a known conflict;
7. exceed a test rate limit.

Record both:

```text
HTTP status
error representation
```

The goal is to make failure as predictable as success.

## The lesson to carry forward

An API contract is a compatibility boundary.

HTTP provides methods, statuses, fields, and representations.

The application adds schemas, validation, domain semantics, authorization, retries, pagination, and change policy.

The next lesson places that API inside a deployment: web server, reverse proxy, application process, database, cache, queue, and upstream services.
