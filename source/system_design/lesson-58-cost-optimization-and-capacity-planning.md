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

## Key Takeaways

Use measured workloads and explicit assumptions. Optimize cost per useful outcome while protecting latency, availability, security, and recovery.

## Practice Exercise

Estimate monthly storage and request cost with explicit assumptions. Identify two cost drivers and an optimization plus its reliability risk.
