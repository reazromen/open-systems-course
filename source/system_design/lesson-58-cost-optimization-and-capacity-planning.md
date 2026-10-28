# Lesson 58: Cost Optimization and Capacity Planning

Capacity planning estimates resources as usage grows. Cost optimization means paying for the capacity needed to meet performance and reliability goals without avoidable waste.

## Estimate workload

Estimate average and peak requests per second, payload sizes, storage growth, retention, and background work. Translate these into rough compute, memory, network, and database needs, then validate with measurements.

## Plan for peaks

Average traffic hides bursts and seasons. Keep headroom and define a response to unexpected demand. Autoscaling helps stateless services, but databases, quotas, startup time, and dependencies may constrain expansion.

## Find expensive paths

Break costs into compute, databases, storage, requests, egress, logs, and third-party services. Oversized instances, duplicated data, excessive logs, and repeated expensive queries are common targets.

## Optimize without harm

Rightsize, cache repeated reads, batch work, compress payloads, tune retention, and move suitable jobs to cheaper capacity. Test effects on latency, availability, and recovery before removing redundancy.

## Unit economics and guardrails

Track cost per active user, transaction, upload, or other meaningful unit alongside service objectives. Set budgets, review forecasts, and test scaling. A cost reduction that causes outages is not an improvement.

## Learning Objectives

- Estimate traffic, storage, throughput, and peak demand using explicit assumptions.

- Identify dominant cost drivers and unit economics.

- Optimize cost without violating reliability, latency, or security requirements.

## Worked Example

A service has predictable average traffic but experiences sharp peaks during campaigns.

**Reasoning:** Estimate average and peak requests, payload sizes, storage growth, and retention. Compare autoscaling, caching, and queueing costs with their operational risks, then monitor cost per meaningful unit of work.

## Check Your Understanding

Why is optimizing only average utilization risky?

- A. Peak demand and burst behavior can exceed capacity even when average use is low.

- B. Average utilization is always higher than peak.

- C. Cost and reliability are unrelated.

**Answer and explanation:** A — capacity must account for bursts, headroom, scaling delay, and failure scenarios, not just average load.

## Common Pitfall

Reducing replicas or redundancy based only on normal-day averages without assessing peak and failover capacity.

## Practice Hint

Write assumptions with units, estimate average and peak demand, then identify the largest cost drivers and risks.

## Self-Check

Can you estimate one workload's capacity and cost and explain the reliability trade-off of an optimization?

## Key Takeaways

Use measured workloads and explicit assumptions. Optimize cost per useful outcome while protecting latency, availability, security, and recovery.

## Practice Exercise

Estimate monthly storage and request cost with explicit assumptions. Identify two cost drivers and an optimization plus its reliability risk.
