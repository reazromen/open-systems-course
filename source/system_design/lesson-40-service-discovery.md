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

## Key Takeaways

Discovery maps logical service names to changing instances. Combine it with load balancing, meaningful readiness checks, stale-record handling, and service authentication.

## Practice Exercise

A service registry lists an instance as healthy, but requests to it fail because its database pool is exhausted. How could readiness checks and monitoring improve this situation?

## Next Lesson

Lesson 41 — Service-to-Service Communication
