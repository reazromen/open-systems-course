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

## Key Takeaways

Start with requirements and traffic patterns. Use a unique code with a uniqueness constraint, indexed lookup, caching for redirects, asynchronous analytics, and abuse controls.

## Practice Exercise

Draw a URL-shortener architecture showing the create API, redirect API, code generator, database, cache, and analytics queue. Explain what happens if a popular link is disabled while it is cached.

## Next Lesson

Lesson 49 — Designing a Chat Application
