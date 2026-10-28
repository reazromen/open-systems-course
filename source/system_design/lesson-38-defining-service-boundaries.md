# Lesson 38 — Defining Service Boundaries

**Course:** System Design — From the Ground Up  
**Module 7 — Microservices**

## Lesson Overview

A service boundary should reflect a cohesive business capability and a clear ownership model. Poor boundaries create chatty services, shared-data coupling, and complicated changes that span many teams.

## Organize Around Business Capabilities

Examples include catalog, ordering, inventory, and payments. Each capability should have a focused responsibility and a clear interface. The goal is not to create the maximum number of services, but to make change and ownership understandable.

## High Cohesion, Low Coupling

A service has high cohesion when its responsibilities belong together. Coupling rises when one business change requires coordinated edits or releases across many services. If two proposed services constantly call each other or require the same transaction, their boundary may be wrong or the workflow may need redesign.

## Data Ownership

A service should normally own the data it is responsible for and expose supported operations through an API or events. Other services should avoid writing directly into its tables, because doing so bypasses business rules and ties deployments to internal schemas. Separate databases are a logical ownership goal, though physical separation can be introduced incrementally.

## Boundaries Evolve

Use domain language, change patterns, transaction needs, and team responsibilities as evidence. Monitor cross-service calls and coordinated releases. A service can be merged or split later; architecture should respond to evidence rather than treating current boundaries as permanent.

## Learning Objectives

- Define service boundaries around business capabilities.

- Apply cohesion and coupling to service design.

- Explain why each service should own its data and invariants.

## Worked Example

Orders and inventory share one database and update each other's tables directly.

**Reasoning:** Define which service owns stock reservations. Expose a reservation API or event, make the operation idempotent, and model the order as pending until the reservation outcome is known.

## Check Your Understanding

What is a warning sign that two proposed services have a poor boundary?

- A. They have separate deployment pipelines.

- B. They must coordinate through frequent cross-service transactions for ordinary operations.

- C. They use different programming languages.

**Answer and explanation:** B — frequent synchronous coordination and shared invariants suggest the split may create a distributed monolith.

## Common Pitfall

A separate database per service does not automatically create good boundaries if business rules still depend on direct cross-service table access.

## Practice Hint

For each domain, identify the data it owns, the invariants it protects, and the contract other domains use.

## Self-Check

Can you identify the owner of a business invariant and describe how another service requests a change?

## Key Takeaways

Choose boundaries around cohesive business capabilities, ownership, and data invariants. Reduce cross-service coordination and avoid sharing internal tables as an integration contract.

## Practice Exercise

An order service and inventory service must coordinate every stock change in one shared database transaction. What does this suggest about the current boundary, and what alternatives could you evaluate?

## Next Lesson

Lesson 39 — API Gateways
