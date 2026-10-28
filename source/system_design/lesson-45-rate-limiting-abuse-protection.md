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

## Learning Objectives

- Compare fixed-window, sliding-window, and token-bucket rate limiting.

- Choose keys and limits aligned with abuse and fairness risks.

- Explain why distributed systems need shared or coordinated enforcement.

## Worked Example

Each of four API replicas allows a user 100 requests per minute locally, so a client can reach 400 requests across the fleet.

**Reasoning:** Use a shared limiter or a carefully designed distributed quota mechanism keyed by authenticated user or API key. Define behavior when the limiter store is unavailable.

## Check Your Understanding

Why is a per-instance limit insufficient for a global per-user quota?

- A. It always blocks legitimate traffic.

- B. The user can be routed across several instances and receive a separate allowance from each.

- C. Rate limits only work for browsers.

**Answer and explanation:** B — independent counters multiply the effective allowance when requests spread across instances.

## Common Pitfall

IP-only limits can punish users behind NAT and be bypassed by distributed clients; choose keys based on threat model and account for trusted proxies.

## Practice Hint

Specify the limiting key, window, burst behavior, response status, and fail-open/fail-closed policy.

## Self-Check

Can you describe one rate-limit algorithm and explain how its counters work across multiple instances?

## Key Takeaways

Choose an algorithm and key that match the workload. Account for multiple instances, shared infrastructure, fair access, 429 responses, and limiter failure behavior.

## Practice Exercise

An API allows 100 requests per minute per instance, and a client can reach four instances. Explain the flaw and propose a strategy for enforcing a global per-user limit.

## Next Lesson

Lesson 46 — Logs, Metrics, and Traces
