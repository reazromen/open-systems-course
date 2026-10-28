# Lesson 26 — Bottlenecks and Performance Diagnosis

**Course:** System Design — From the Ground Up  
**Module 5 — Scalability and Performance**

## Learning Objectives
- Define a bottleneck in a multi-tier system.
- Use measurements to narrow down performance problems.
- Distinguish symptoms from causes.

## Core Concept
A bottleneck is the resource or dependency limiting end-to-end throughput or latency. Possible constraints include CPU, memory pressure, disk I/O, network, database locks, connection limits, and slow downstream services. Measure before changing architecture.

## Worked Example
A shop page takes 2.8 seconds to load. Tracing shows the API spends 2.3 seconds waiting for a database query, while CPU remains low. Adding web servers is unlikely to help. Inspect the query plan, indexes, row counts, and lock waits; compare timings before and after a targeted change.

## Common Pitfall
High CPU is not the only sign of overload. A service blocked on database connections may have low CPU while requests pile up.

## Knowledge Check
1. If requests spend most of their time waiting on a database, what should you investigate first?
   - **Answer:** Query latency, execution plans, locks, and connection-pool behavior.
2. Why record a baseline before optimization?
   - **Answer:** It lets you compare results and determine whether the change improved the actual user-facing metric.

## Practice Hint
Record request latency, throughput, error rate, CPU, memory, disk I/O, queue depth, and dependency timings for a slow endpoint.

## Self-Check
Can you explain why “add more servers” is not a diagnosis, and name the evidence needed to locate a bottleneck?

## Next Lesson

Lesson 27
