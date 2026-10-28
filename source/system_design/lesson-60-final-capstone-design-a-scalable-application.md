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

## Learning Objectives

- Deliver a complete system design from requirements to operations.

- Combine data modeling, APIs, capacity estimates, and failure handling.

- Present decisions, alternatives, security, observability, and staged rollout.

## Worked Example

Design an application that accepts user submissions, processes them asynchronously, and serves results reliably as usage grows.

**Reasoning:** Define user journeys and SLOs, estimate load, model source-of-truth data, sketch APIs and asynchronous work, then plan retries, idempotency, authorization, telemetry, backups, and cost. Validate assumptions with a staged launch and load tests.

## Check Your Understanding

What makes a capstone architecture reviewable rather than just a diagram?

- A. A large number of services.

- B. Explicit requirements, assumptions, flows, capacity estimates, failure modes, and justified trade-offs.

- C. A list of technology names.

**Answer and explanation:** B — a useful design explains how it meets requirements and how it behaves under load and failure.

## Common Pitfall

Treating the initial design as final without documenting assumptions or defining how production behavior will be validated.

## Practice Hint

Deliver an architecture diagram, key APIs, data model, capacity estimates, decision records, failure-mode table, observability plan, and staged launch plan.

## Self-Check

Can you defend the major design choices, state their risks, and explain how you would validate them in production?

## Prerequisites and a beginner-friendly route

Use the earlier lessons as a reference rather than trying to invent every detail at once. Start with requirements and request flows (Lessons 01–11); data models, transactions, indexes, and database choice (Lessons 12–17); application boundaries, proxies, load balancing, caching, and storage (Lessons 18–24); scaling and capacity estimates (Lessons 25–30); distributed systems, queues, replication, and consistency (Lessons 31–36); service boundaries and communication (Lessons 37–41); reliability and recovery (Lessons 42–43); security (Lessons 44–45); observability and operations (Lessons 46–47); then use the relevant case study from Lessons 48–58. Lesson 59 provides a useful presentation method. You do not need to use every technology from these lessons: select only what your requirements justify.

If a topic is unfamiliar, narrow the design to one application, one region, and a modest workload. Describe advanced failure cases conceptually; a working distributed deployment is not required.

## Submission checklist

- Problem statement, target users, in-scope journeys, and explicit exclusions.

- Functional requirements and 3–5 measurable non-functional goals, with assumptions.

- Back-of-the-envelope estimates for peak requests, reads/writes, storage growth, and bandwidth; show the arithmetic and units.

- One architecture diagram and two traced request/data flows.

- At least two API examples and a small data model identifying the source of truth.

- Three decision records, each comparing an alternative and explaining consequences.

- A failure table covering at least three plausible failures, detection, user impact, and recovery.

- Security and privacy notes, observability signals, backup/recovery plan, and major cost drivers.

- A staged implementation plan that begins with the smallest useful version.

## Self-assessment rubric (100 points)

Score each category from 0 to its maximum. A passing submission scores at least 70/100 and has no zero in requirements, data/API design, or failure handling.

- **Requirements and assumptions — 15 points:** scope is clear and quality goals are measurable.

- **Workload estimates — 10 points:** arithmetic, units, and assumptions are visible and plausible.

- **Architecture and flows — 15 points:** components have clear responsibilities and flows match the requirements.

- **APIs and data model — 15 points:** key entities, ownership, validation, and correctness needs are explained.

- **Trade-offs — 15 points:** at least three decisions compare realistic alternatives and consequences.

- **Reliability and scaling — 15 points:** bottlenecks, failures, retries/idempotency where relevant, and recovery are addressed.

- **Security, observability, and cost — 10 points:** controls and measurable signals are specific to the design.

- **Communication and staged plan — 5 points:** the deliverable is understandable and starts with a feasible first version.

## Success criteria

A reviewer should be able to trace each major requirement to a component or design choice, understand the assumptions behind capacity estimates, identify what happens during at least three failures, and see why the chosen design is preferable to a simpler alternative. Exact technology choices are less important than sound reasoning.

## Optional extensions

- Draw a sequence diagram for a critical user journey.

- Model a degraded mode when the cache, queue, or downstream service is unavailable.

- Estimate a second workload that is 10 times larger and identify the first bottleneck.

- Write a short threat model or a restore-test runbook.

## Key Takeaways

A complete design links product needs to data, components, failure handling, security, operations, and cost. State assumptions and justify every component.

## Practice Exercise

Deliver an architecture diagram, key APIs, data model, capacity estimates, three decision records, failure-mode table, observability plan, and staged launch plan.
