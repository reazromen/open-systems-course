# Lesson 22 — Content Delivery Networks (CDNs)

**Course:** System Design — From the Ground Up  
**Module 4 — Core Architecture Components**

## Lesson Overview

A Content Delivery Network serves eligible content from geographically distributed edge locations. It can reduce distance-related latency and origin load, especially for static assets and cacheable responses.

## How an Edge Cache Helps

Without a CDN, users may retrieve every image, stylesheet, script, or video segment from the origin region. A CDN can cache copies at edge locations closer to users. A cache hit avoids an origin request; a cache miss typically requires the CDN to retrieve content from the origin.

## Cache Keys and Directives

A CDN needs rules that determine which requests share a cached response. Cache-Control directives, TTLs, URL paths, query parameters, and selected headers may affect caching. A poorly chosen cache key can serve the wrong variant or unintentionally mix private and public content.

## Invalidation and Versioning

When content changes, a cached copy may remain until it expires or is invalidated. Versioned filenames such as app.a1b2c3.js make immutable assets easier to cache safely. Frequent global invalidations can be expensive or slow, so publishing strategies should account for propagation and rollback.

## Security and Origin Protection

CDNs can provide TLS, DDoS absorption, and origin shielding depending on the service and configuration. They do not automatically protect private data. Configure access controls, avoid caching authenticated responses publicly, and restrict direct origin access when the design requires requests to pass through the CDN.

## Key Takeaways

A CDN improves delivery for cacheable content but requires deliberate cache keys, freshness rules, access control, and origin protection.

## Practice Exercise

A public product image can be cached for a day, but a user's private account page cannot be shared across users. Explain the different caching policies you would apply.

## Next Lesson

Lesson 23 — File Storage and Object Storage
