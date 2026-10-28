# Lesson 45 — Rate Limiting and Abuse Protection

**Course:** System Design — From the Ground Up  
**Module 8 — Reliability, Security, and Observability**

## Lesson Overview

Rate limiting controls how frequently a client can perform an operation. It protects capacity and reduces abuse, but limits must reflect identity, endpoint cost, fairness, and the consequences of blocking legitimate traffic.

## Common Algorithms

A fixed window counts requests within a time bucket and is simple but can allow bursts at window boundaries. A sliding window estimates or records requests over a rolling period. Token buckets allow controlled bursts while limiting the long-term average rate. Leaky-bucket approaches smooth work at a configured pace.

## Choose a Limiting Key

Limits may be applied per user, API key, tenant, IP address, or endpoint. IP-only limits can penalize users behind shared networks, while account-only limits can be bypassed by creating accounts. Sensitive endpoints may need several layers, such as per-account login attempts and global capacity protection.

## Distributed Enforcement

If each application instance maintains its own counter, a client may exceed the intended global limit by spreading requests across instances. Shared counters or gateway-level enforcement can improve consistency, but the counter store itself introduces latency and failure behavior. Define whether a limiter fails open or closed during an outage.

## Communicate Limits Clearly

Return a clear response, commonly HTTP 429, and where appropriate provide retry guidance or rate-limit headers. Limits should be observable and adjustable. Distinguish abuse prevention from capacity management, and ensure critical internal traffic has controlled priorities rather than unrestricted bypasses.

## Key Takeaways

Choose an algorithm and key that match the workload. Account for multiple instances, shared infrastructure, fair access, 429 responses, and limiter failure behavior.

## Practice Exercise

An API allows 100 requests per minute per instance, and a client can reach four instances. Explain the flaw and propose a strategy for enforcing a global per-user limit.

## Next Lesson

Lesson 46 — Logs, Metrics, and Traces
