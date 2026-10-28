# Lesson 08 — HTTP Methods, Status Codes, and Headers

**Course:** System Design — From the Ground Up  
**Module 2 — Networking and Communication**

## Learning Objectives

By the end of this lesson, you should be able to:
- Distinguish safe methods from idempotent methods.
- Choose suitable status codes for common outcomes.
- Explain how headers support caching, content interpretation, and observability.

## Lesson Overview

HTTP methods, status codes, and headers make web interactions more predictable. Correct use of these elements improves client behavior, caching, security, and troubleshooting.

## Methods Describe Intent

GET retrieves a representation and should not intentionally change server state. POST commonly creates a subordinate resource or triggers processing. PUT replaces a resource at a known URI, PATCH applies a partial change, and DELETE requests removal. These are conventions defined by HTTP semantics; the API must document exact behavior.

## Safety and Idempotency

A safe method is intended to be read-only. An idempotent method has the same intended effect when repeated. GET, PUT, and DELETE are defined as idempotent in their intended semantics, though responses can differ. POST is not automatically idempotent. This matters when a client retries after a timeout and cannot tell whether the first request succeeded.

## Status Codes Guide the Client

A 200 response commonly reports success, 201 indicates creation, and 204 indicates success with no response body. A 400 indicates a malformed or invalid request, 401 means authentication is required or failed, 403 means the request is understood but forbidden, 404 means not found, 429 signals rate limiting, and 5xx signals server-side trouble. Choose codes that match the actual result.

## Headers Carry Metadata

Headers communicate metadata such as content type, authentication, caching policy, and request correlation identifiers. Content-Type tells the receiver how to interpret a body; Cache-Control guides caching; Authorization carries credentials or tokens. Never log secrets from sensitive headers, and do not treat client-supplied identity headers as trustworthy without a secure proxy boundary.

## Worked example: retrying order creation

A client sends `POST /orders` and times out before receiving a response. The server may have created the order already. Repeating the POST could create a duplicate unless the API defines a safe retry mechanism, such as an idempotency key stored with the operation result. A `201 Created` can report successful creation; `429 Too Many Requests` can indicate rate limiting.

## Check Your Understanding

**1. What is the difference between safe and idempotent?**

<details>
<summary>Answer and explanation</summary>

Safe means the intended operation is read-only. Idempotent means repeating the operation has the same intended effect as doing it once. They are related but not the same property.

</details>

**2. Should an API return 200 for every outcome?**

<details>
<summary>Answer and explanation</summary>

No. Accurate status codes help clients distinguish success, validation problems, authorization failures, rate limits, and server errors.

</details>

## Common Pitfall

A status code is not a complete API contract. Clients also need documented response bodies, retry rules, and security-safe error details.

## Key Takeaways

Use methods according to their semantics, return accurate status codes, and document important headers. Retry behavior depends on idempotency and the operation's actual contract.

## Practice Exercise

An order-creation request times out after submission. Why is blindly repeating it risky? Suggest one API design feature that makes safe retry possible.

## Next Lesson

Lesson 09 — REST APIs and JSON
### Practice Hint and Self-Check

**Hint:** For the timed-out order, identify the uncertain state, then explain how a stable operation key can make retries safe.

**Self-check:** Your answer uses a suitable status code and explains why retry safety depends on operation semantics.

