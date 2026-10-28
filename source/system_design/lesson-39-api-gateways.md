# Lesson 39 — API Gateways

**Course:** System Design — From the Ground Up  
**Module 7 — Microservices**

## Lesson Overview

An API gateway is an entry point that routes client requests to backend services and may centralize cross-cutting concerns. It simplifies client-facing access, but it must not become an uncontrolled place for all business logic.

## Gateway Responsibilities

A gateway may route requests, terminate TLS, authenticate callers, apply rate limits, transform protocol details, and combine responses when appropriate. It gives clients a stable entry point while backend services evolve. Responsibilities should be explicit and bounded.

## Why Not Expose Every Service?

Directly exposing each internal service makes clients understand internal topology and increases the public attack surface. A gateway can enforce consistent edge policies and hide private service addresses. Internal service-to-service traffic still needs its own authentication, authorization, and network controls.

## Avoid a Bottleneck

Because requests pass through the gateway, it needs capacity, health monitoring, redundancy, and safe deployment. A single overloaded or misconfigured gateway can affect the entire product. Multiple gateway instances and tested routing behavior reduce this risk.

## Keep Business Logic in the Right Place

Authentication and routing can belong at the edge, but order validation and payment rules should remain with the services that own those domains. Excessive response aggregation can create a gateway that is difficult to change and becomes a hidden monolith.

## Key Takeaways

Gateways centralize client routing and selected edge policies, but require high availability and clear responsibility boundaries. Keep domain rules with domain-owning services.

## Practice Exercise

A mobile app currently calls six internal services directly. Sketch how a gateway could simplify the client while preserving ownership of payment and inventory rules.

## Next Lesson

Lesson 40 — Service Discovery
