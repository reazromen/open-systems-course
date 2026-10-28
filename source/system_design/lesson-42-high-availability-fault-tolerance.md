# Lesson 42 — High Availability and Fault Tolerance

**Course:** System Design — From the Ground Up  
**Module 8 — Reliability, Security, and Observability**

## Lesson Overview

High availability aims to keep a service usable; fault tolerance aims to continue operating despite specified failures. Both require defining what counts as a failure and designing the entire dependency path, not just adding more servers.

## Remove Single Points of Failure

Two application instances do not create high availability if they depend on one database, one network path, one power supply, or one unprotected gateway. Identify critical dependencies and the failure domains they share. Redundancy helps only when it can survive the failure being considered.

## Redundancy and Failover

Active-active systems serve traffic from multiple healthy instances; active-passive systems keep a standby ready to take over. Failover requires detection, routing or promotion, data consistency, and prevention of two nodes acting as the sole primary at once. Automatic failover should be tested under realistic conditions.

## SLOs and Error Budgets

A service-level indicator (SLI) is a measured signal such as successful request rate or latency. A service-level objective (SLO) sets a target for that signal over a period. Error budgets help teams balance reliability work and release speed; they turn vague claims such as 'always available' into measurable goals.

## Degrade Gracefully

When optional dependencies fail, a service may provide a limited response rather than fail completely. Examples include serving cached catalog data or delaying email notifications while still accepting an order. Never silently degrade a critical invariant such as payment correctness or inventory safety.

## Learning Objectives

- Identify single points of failure in an architecture.

- Distinguish redundancy, failover, and fault tolerance.

- Use service-level objectives to reason about reliability.

## Worked Example

Three application replicas share one database. The app tier can survive one instance failure, but a database outage still stops the service.

**Reasoning:** Add an appropriate database availability strategy, verify failover behavior, and test that clients reconnect safely. Measure availability against an explicit SLO.

## Check Your Understanding

What remains a major single point of failure in this design?

- A. The three application replicas.

- B. The single database, unless it has a working redundancy strategy.

- C. The existence of an SLO.

**Answer and explanation:** B — multiple app instances do not remove a single database failure domain.

## Common Pitfall

Adding replicas without testing failover can create correlated failures or make recovery slower rather than safer.

## Practice Hint

Map each critical dependency and ask what happens if its process, host, zone, or network path fails.

## Self-Check

Can you identify one single point of failure and describe a tested mitigation?

## Key Takeaways

Design around explicit failure scenarios, shared dependencies, tested failover, and measurable SLOs. Degrade optional features while preserving critical business invariants.

## Practice Exercise

A service has three application replicas but one database. List the availability benefit of the replicas and the major remaining single point of failure.

## Next Lesson

Lesson 43 — Failover and Disaster Recovery
