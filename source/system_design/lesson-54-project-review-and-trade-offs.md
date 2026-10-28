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

## Key Takeaways

Connect requirements to components, expose assumptions, compare alternatives, and define failure handling and measurable outcomes.

## Practice Exercise

Review a design and write three assumptions, two failure modes, one major trade-off, and three operational metrics.
