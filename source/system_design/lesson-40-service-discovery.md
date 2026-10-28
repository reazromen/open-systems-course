# Lesson 40 — Service Discovery

**Course:** System Design — From the Ground Up  
**Module 7 — Microservices**

## Lesson Overview

In dynamic environments, service instances may start, stop, move, or scale. Service discovery allows callers to find healthy instances without relying on manually maintained addresses.

## Static Addresses and Their Limits

A hard-coded address may work for a single server, but becomes fragile when instances are replaced or scaled. Containers and cloud workloads often receive changing addresses. Callers need a reliable way to resolve a logical service name to reachable instances.

## Client-Side and Server-Side Discovery

With client-side discovery, the caller obtains an instance list and selects a destination. With server-side discovery, a load balancer or proxy resolves the service name and selects an instance. DNS-based discovery is also common, but caching and TTL behavior affect how quickly address changes are observed.

## Health Is More Than a Running Process

An instance can respond to a TCP connection while being unable to serve requests correctly. Health checks should reflect readiness for real work and avoid removing every instance during a shared dependency incident. Readiness, liveness, and startup checks often serve different purposes.

## Failure and Security

Discovery data can be stale, so callers still need timeouts, retries with limits, and connection handling. Restrict who can register services and protect internal naming systems. A discovered address should not be treated as proof that a caller is authorized to use the service.

## Learning Objectives

- Explain why dynamic service instances need discovery.

- Compare client-side and server-side discovery.

- Distinguish liveness from readiness.

## Worked Example

A deployment replaces instances and their IP addresses change.

**Reasoning:** A registry or platform service routes callers to current endpoints. Readiness should exclude instances that cannot serve requests, even if their process is alive.

## Check Your Understanding

What does a readiness check primarily answer?

- A. Is the process running at all?

- B. Can this instance safely receive production traffic now?

- C. Is the host's IP address permanent?

**Answer and explanation:** B — readiness determines whether an instance should receive traffic; liveness determines whether it should be restarted.

## Common Pitfall

A shallow health endpoint that only returns HTTP 200 can mark an overloaded or dependency-starved instance as ready.

## Practice Hint

Consider startup, dependency failure, draining during deployment, and recovery when designing health checks.

## Self-Check

Can you explain the difference between liveness and readiness and name one failure each can detect?

## Key Takeaways

Discovery maps logical service names to changing instances. Combine it with load balancing, meaningful readiness checks, stale-record handling, and service authentication.

## Practice Exercise

A service registry lists an instance as healthy, but requests to it fail because its database pool is exhausted. How could readiness checks and monitoring improve this situation?

## Next Lesson

Lesson 41 — Service-to-Service Communication
