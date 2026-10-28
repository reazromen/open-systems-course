# Lesson 54: Project Review and Trade-offs

A system design is not complete when its diagram looks convincing. It must connect requirements to data flow, failure behavior, operations, and measurable outcomes.

## Return to requirements

Separate functional needs from latency, availability, privacy, cost, and constraints. State exclusions so scope does not grow without reason.

## Trace a critical request

Follow a user journey from client through APIs, services, stores, and queues. Mark trust boundaries, durable writes, network calls, and failure points.

## Find bottlenecks and failure modes

Estimate request rate and data volume. Identify likely bottlenecks and what happens when a dependency slows or fails. Add caching, queues, or redundancy only when justified.

## Compare alternatives

Record the alternative, benefit, cost, and condition that would change a decision. A relational database or modular monolith may be better than a distributed design for a small team.

## Measure success

Define user-facing metrics, dashboards, alerts, load tests, backup restoration tests, security checks, and rollout plans. Operators need to know whether the system works and how to recover.

## Learning Objectives

- Review a system against its original requirements and assumptions.

- Trace critical requests and identify bottlenecks and failure modes.

- Compare alternatives using explicit trade-offs and measurable outcomes.

## Worked Example

A proposed design uses a cache to reduce database load, but there is no stated freshness requirement or invalidation plan.

**Reasoning:** Write down the consistency and latency requirements first, estimate hit rate, define invalidation and fallback behavior, then compare the cache against a simpler indexed database query.

## Check Your Understanding

What is the best basis for choosing between two architectures?

- A. Which diagram has more components.

- B. How well each satisfies requirements, including cost, reliability, complexity, and failure behavior.

- C. Which technology is newest.

**Answer and explanation:** B — architecture is a set of trade-offs tied to requirements, not a component-count contest.

## Common Pitfall

Adding infrastructure before identifying the bottleneck or requirement it is meant to address.

## Practice Hint

Review assumptions, request/data flow, capacity, failure modes, security, cost, and observable success criteria.

## Self-Check

Can you defend one architecture decision with a requirement, an alternative, and a measurable trade-off?

## Key Takeaways

Connect requirements to components, expose assumptions, compare alternatives, and define failure handling and measurable outcomes.

## Practice Exercise

Review a design and write three assumptions, two failure modes, one major trade-off, and three operational metrics.
