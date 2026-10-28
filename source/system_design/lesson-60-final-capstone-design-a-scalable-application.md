# Lesson 60: Final Capstone: Design a Scalable Application

Design a realistic application end to end. Connect requirements to architecture, data, failure handling, security, operations, and cost; the goal is a defensible design, not the largest diagram.

## Choose scope

Pick chat, a social feed, e-commerce, learning, or file sharing. Define primary journeys, exclusions, functional requirements, and measurable quality goals.

## Estimate scale and model data

Estimate users, peak traffic, read/write ratios, storage growth, and network use. Identify authoritative records and choose data models based on access patterns and correctness.

## Draw components and flows

Show clients, gateway, services, databases, cache, object storage, and queues where justified. Trace two user journeys and mark synchronous dependencies, events, trust boundaries, and durable acknowledgements.

## Design for growth and failure

Identify bottlenecks and appropriate scaling. Explain behavior when replicas lag, queues grow, a region fails, or a provider times out. Include bounded retries, idempotency, backups, and degraded modes.

## Security, observability, and cost

Specify authentication, authorization, rate limits, secrets, and retention. Define metrics, logs, traces, alerts, and service objectives. Estimate cost drivers and explain what to measure after launch.

## Present and revise

Write architecture decision records for three choices, with alternatives and consequences. List assumptions, open questions, and a staged implementation plan; remove components that lack a clear purpose.

## Key Takeaways

A complete design links product needs to data, components, failure handling, security, operations, and cost. State assumptions and justify every component.

## Practice Exercise

Deliver an architecture diagram, key APIs, data model, capacity estimates, three decision records, failure-mode table, observability plan, and staged launch plan.
