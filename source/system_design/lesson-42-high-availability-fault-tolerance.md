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

## Key Takeaways

Design around explicit failure scenarios, shared dependencies, tested failover, and measurable SLOs. Degrade optional features while preserving critical business invariants.

## Practice Exercise

A service has three application replicas but one database. List the availability benefit of the replicas and the major remaining single point of failure.

## Next Lesson

Lesson 43 — Failover and Disaster Recovery
