---
title: "Caches: Faster Copies and Stale State"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-107-caches-faster-copies-stale-state.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 11
excerpt: "A cache stores a cheaper copy or derived result. It improves latency or load only by introducing another state that can become stale, miss, expire, or disagree with the source of truth."
eyebrow: "Open Systems Course · Lesson 107 of 180"
---

A cache makes a system faster by remembering something that would otherwise be expensive to retrieve or compute.

That sounds harmless.

But the moment you cache data, the system contains at least two representations of the same underlying fact.

Now consistency becomes a design problem.

## A cache is usually not the authority

Suppose the database says:

account plan = pro

and Redis says:

account plan = free

Which one wins?

If the architecture cannot answer that question, the cache has accidentally become a second source of truth.

A good cache design explicitly defines the authoritative source.

## Cache-aside moves misses into the application path

In cache-aside, the application checks the cache first.

If the key is missing, it reads the database, returns the result, and usually populates the cache.

The flow is:

request → cache hit → return

or:

request → cache miss → database → populate cache → return

This pattern is simple and common.

It also means the application owns invalidation behavior.

## Staleness is often the real cost

Suppose a user changes their display name.

The database commits the new value.

The cache still contains the old value for 10 minutes.

The system is now correct in the database and stale in the cache.

That can be acceptable for a public profile.

It may be unacceptable for authorization state.

Cacheability is therefore a domain decision, not merely a performance setting.

Ask how wrong the cached value may be and for how long.

## TTL turns consistency into time

A time-to-live gives cached data an expiration deadline.

TTL limits how long stale data can persist if no explicit invalidation occurs.

It does not guarantee freshness before expiry.

If the authoritative value changes immediately after a cache entry is written, the entry can remain stale for almost the full TTL.

So a five-minute TTL means something like:

we are accepting a bounded stale window up to roughly five minutes under this policy.

That is a business and systems contract.

## Invalidation is harder than insertion

Putting a value into a cache is easy.

Knowing when every copy is no longer valid is harder.

Invalidation strategies include:

- delete on successful write;
- update cache after database write;
- publish invalidation events;
- short TTL;
- versioned keys;
- never cache data that cannot safely be stale.

Each strategy has failure windows.

For example, if the database update commits but the subsequent cache delete fails, stale data remains.

That is a two-system consistency problem.

## Stampedes happen when many misses synchronize

Imagine a popular key expires.

One thousand requests arrive at once.

All miss.

All query the database.

The cache protected the database until the exact moment it became most expensive.

This is a cache stampede.

Mitigations include request coalescing, locking around refresh, probabilistic early refresh, staggered TTLs, and serving stale data under controlled rules.

The correct choice depends on workload and acceptable staleness.

## Eviction means cached data can disappear early

Caches often have finite memory.

When full, they evict keys according to configured policy.

Redis supports configurable eviction behavior when maxmemory is reached.

Therefore a cache hit cannot be assumed merely because the TTL has not expired.

Applications should normally tolerate cache misses at any time.

If loss of one cache key breaks correctness, the component is probably no longer only a cache.

## Negative caching stores absence too

Suppose a lookup asks for user 999 and the database says not found.

The application can cache that absence to avoid repeating expensive misses.

But now creating user 999 must invalidate the negative result.

Caching absence is still caching state.

DNS negative caching from Lesson 82 is the same general systems idea in another domain.

## Local and shared caches fail differently

A process-local cache is extremely fast but each application instance has its own copy.

A shared Redis cache gives multiple instances a common cache but adds a network hop and another service dependency.

Local cache:

fast, but many independent copies.

Shared cache:

coordinated copy, but shared failure domain.

Layered caching can combine both and also multiply invalidation complexity.

## Practical experiment

Create a local program that reads a record from SQLite and caches it in memory for 30 seconds.

Read the value once, update the database directly, then read through the application again before and after the TTL.

Observe the exact stale window.

Then add explicit invalidation after writes and deliberately make the invalidation step fail in a test.

The purpose is to see that a cache bug is often a state-coordination bug rather than a memory-size problem.

## The lesson to carry forward

A cache trades stronger freshness for cheaper access.

Every cache needs an authority model, invalidation policy, expiration behavior, miss strategy, and failure plan.

The next lesson introduces another stateful intermediary: queues, which decouple producers and consumers across time.
