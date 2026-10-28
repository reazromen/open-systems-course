# Lesson 21 — Caching and Redis

**Course:** System Design — From the Ground Up  
**Module 4 — Core Architecture Components**

## Lesson Overview

A cache keeps reusable data closer to the code that needs it, reducing repeated work and often lowering latency. The hard part is deciding when cached data is valid and what happens when the cache is unavailable.

## What to Cache

Common candidates include frequently read product details, rendered pages, session data, and expensive computation results. Cache data that is costly to recompute and safe to reuse for the expected period. Highly volatile or authorization-sensitive data needs particular care.

## Cache-aside

In a common cache-aside pattern, the application checks the cache first. On a miss, it reads the source database, returns the result, and populates the cache. On updates, the application may invalidate the corresponding cache entry. This is simple but can produce stale reads or a burst of database requests when popular keys expire together.

## Redis and Expiration

Redis is an in-memory data store commonly used for caching, counters, queues, and ephemeral data structures. Keys often have a time-to-live (TTL), after which they expire. A TTL limits how long an entry remains, but does not guarantee that every cached value is fresh throughout that period.

## Failure and Consistency

A cache may evict entries, restart, become unreachable, or return stale data. Decide whether the application should fall back to the database, fail fast, or degrade functionality. Protect the database from a cache stampede using techniques such as request coalescing, jittered expiration, or controlled concurrency. Never treat a cache as the only durable source for data that must not be lost.

## Learning Objectives

- Explain cache-aside, TTL, invalidation, and stale reads.

## Worked Example

A product page checks Redis first. On a miss, the app reads the database and caches the result with a TTL. When the product changes, the cache must be invalidated or refreshed.

## Check Your Understanding

1. **Should the cache normally be the only authoritative copy of product data?**

   No. Unless explicitly designed otherwise, durable source-of-truth data belongs in the database.

## Common Pitfall

Caching without an invalidation strategy can serve stale data; cache stampedes can overload the database.

## Key Takeaways

Caching trades freshness and complexity for lower latency and reduced source load. Define TTLs, invalidation, miss behavior, and cache-failure behavior explicitly.

## Practice Exercise

A product page is cached for five minutes, but the product price changes. Describe two strategies for reducing stale-price risk and one risk of each.


### Practice Hint

Specify cache hit/miss behavior, TTL, update invalidation, and what happens when Redis is unavailable.

### Self-Check

Can you describe correctness and failure behavior, not just the cache lookup?
## Next Lesson

Lesson 22 — Content Delivery Networks (CDNs)
