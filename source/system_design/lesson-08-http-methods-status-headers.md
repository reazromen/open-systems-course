# Lesson 08 — HTTP Methods, Status Codes, and Headers

**Course:** System Design — From the Ground Up  
**Module 2 — Networking and Communication**

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

## Key Takeaways

Use methods according to their semantics, return accurate status codes, and document important headers. Retry behavior depends on idempotency and the operation's actual contract.

## Practice Exercise

An order-creation request times out after submission. Why is blindly repeating it risky? Suggest one API design feature that makes safe retry possible.

## Next Lesson

Lesson 09 — REST APIs and JSON
