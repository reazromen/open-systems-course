# Lesson 20 — Load Balancers

**Course:** System Design — From the Ground Up  
**Module 4 — Core Architecture Components**

## Lesson Overview

A load balancer distributes incoming requests across multiple backend instances. It can improve capacity and availability, but only when the application and surrounding infrastructure are designed to use multiple instances safely.

## Why Distribute Traffic?

One application instance has finite CPU, memory, connection capacity, and failure tolerance. Multiple instances can serve more concurrent work and allow traffic to continue when one instance is unhealthy. The database or another dependency may still limit the total system capacity.

## Balancing Strategies

Round robin distributes requests in sequence; least-connections approaches prefer backends with fewer active connections; weighted strategies send different proportions of traffic to different instances. The best method depends on request duration, connection behavior, backend capacity, and the load balancer's capabilities.

## Health Checks and Failures

Health checks help determine whether an instance should receive traffic. A shallow process check can report healthy while the application cannot serve requests; an overly broad check can remove every instance when a shared dependency fails. Define readiness and liveness carefully and avoid synchronized retry storms.

## Statelessness and Sessions

Load balancing is simplest when any instance can handle any request. If session state exists only in local memory, a later request routed to another instance may lose that state. Store shared session data externally or use another deliberate strategy. Sticky sessions can help in some cases but reduce flexibility and do not replace resilient state design.

## Key Takeaways

Load balancing distributes traffic, not responsibility for every bottleneck. Use meaningful health checks, understand session state, and plan for partial failure.

## Practice Exercise

Two instances sit behind a load balancer, but users randomly lose their login session. Explain a likely cause and one architectural fix.

## Next Lesson

Lesson 21 — Caching and Redis
