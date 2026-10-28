# Lesson 48 — Designing a URL Shortener

**Course:** System Design — From the Ground Up  
**Module 9 — Real-World System Design Projects**

## Lesson Overview

A URL shortener accepts a long URL and creates a compact link that redirects visitors to the original destination. This small product is a useful system-design exercise because it combines API design, unique identifiers, storage, caching, abuse prevention, and analytics.

## Clarify Requirements

Decide whether users can choose custom aliases, whether links expire, whether links are private, and whether click analytics are required. Estimate creation and redirect traffic separately: redirects may vastly outnumber link creation. Define latency and availability goals before choosing infrastructure.

## Design the APIs

A creation endpoint accepts a validated destination URL and returns a short code and short URL. A redirect endpoint looks up the code and returns an HTTP redirect to the destination. Define behavior for unknown, expired, disabled, or malformed codes, and decide whether the redirect is temporary or permanent based on product needs.

## Generate and Store Codes

A code may come from a collision-checked random identifier, a database-generated ID encoded in a compact alphabet, or another unique-ID strategy. Store the code, destination, creation time, expiry, and owner or policy metadata as needed. Enforce uniqueness and handle collisions rather than assuming they never occur.

## Scale Redirects Safely

Redirect traffic is a natural fit for caching popular code-to-URL mappings, with careful invalidation when a link is disabled or edited. A database index on the code supports lookup. Analytics can be processed asynchronously so recording every click does not dominate redirect latency.

## Security and Operations

Validate schemes and destinations to reduce abuse, provide reporting and takedown paths, and protect creation endpoints with rate limits. Consider phishing reputation, private-link leakage, cache staleness, and high-cardinality analytics. Monitor redirect latency, lookup errors, cache hit ratio, and code-creation failures.

## Learning Objectives

- Translate product requirements into functional and non-functional requirements.

- Design code generation, storage, and redirect paths.

- Evaluate caching, abuse controls, and analytics trade-offs.

## Worked Example

Assume a service receives one million redirects per day and redirects must remain fast. If reads greatly exceed writes, an indexed persistent mapping plus a cache for popular codes can reduce database load.

**Reasoning:** Generate collision-resistant short codes, enforce uniqueness in storage, cache popular mappings with a deliberate invalidation policy, and send click analytics asynchronously.

## Check Your Understanding

What should happen if a short link is disabled while its mapping remains cached?

- A. Ignore the disabled state until the cache expires in all cases.

- B. Use a suitable invalidation or bounded-TTL strategy and ensure the redirect path respects revocation requirements.

- C. Delete the entire database.

**Answer and explanation:** B — cache policy must reflect revocation and correctness requirements; invalidation or short TTLs can limit stale redirects.

## Common Pitfall

Assuming generated codes can never collide is unsafe; enforce uniqueness at the storage layer and retry generation on conflict.

## Practice Hint

Separate create and redirect APIs, estimate read/write volume, identify hot keys, and decide how disabling a link propagates to caches.

## Self-Check

Can you sketch the create and redirect flows and explain how you handle collisions, hot links, and link revocation?

## Key Takeaways

Start with requirements and traffic patterns. Use a unique code with a uniqueness constraint, indexed lookup, caching for redirects, asynchronous analytics, and abuse controls.

## Practice Exercise

Draw a URL-shortener architecture showing the create API, redirect API, code generator, database, cache, and analytics queue. Explain what happens if a popular link is disabled while it is cached.

## Next Lesson

Lesson 49 — Designing a Chat Application
