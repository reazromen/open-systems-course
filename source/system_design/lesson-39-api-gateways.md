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

## Learning Objectives

- Describe the client-facing role of an API gateway.

- Distinguish routing and cross-cutting concerns from domain business logic.

- Recognize gateway availability and latency risks.

## Worked Example

A mobile client calls profile, orders, payments, and notifications separately, increasing client complexity.

**Reasoning:** A gateway can authenticate, route requests, apply quotas, and aggregate suitable reads. Payment authorization and inventory rules remain in their owning services.

## Check Your Understanding

Where should the rule 'a refund cannot exceed the captured payment' live?

- A. Only in the API gateway.

- B. In the payment service that owns the invariant.

- C. In every client application.

**Answer and explanation:** B — domain invariants belong in the service that owns the data; the gateway may enforce cross-cutting policy but should not duplicate core business rules.

## Common Pitfall

Putting business workflows into the gateway turns it into a tightly coupled central application and can make every change risky.

## Practice Hint

Draw the client-to-gateway path and mark which checks are cross-cutting versus domain-specific.

## Self-Check

Can you list two suitable gateway responsibilities and one responsibility that should remain in a domain service?

## Key Takeaways

Gateways centralize client routing and selected edge policies, but require high availability and clear responsibility boundaries. Keep domain rules with domain-owning services.

## Practice Exercise

A mobile app currently calls six internal services directly. Sketch how a gateway could simplify the client while preserving ownership of payment and inventory rules.

## Next Lesson

Lesson 40 — Service Discovery
