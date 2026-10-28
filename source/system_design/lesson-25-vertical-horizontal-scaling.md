# Lesson 25 — Vertical and Horizontal Scaling

**Course:** System Design — From the Ground Up  
**Module 5 — Scalability and Performance**

## Learning Objectives
- Distinguish scaling up from scaling out.
- Identify when adding instances helps—and when it does not.
- Explain the operational trade-offs of each approach.

## Core Concept
Vertical scaling (scale up) adds CPU, RAM, or faster storage to one machine. Horizontal scaling (scale out) adds instances and distributes requests among them. Neither is universally better: the right choice depends on the constrained component, workload, cost, and failure requirements.

## Worked Example
An API handles 400 requests per second and its CPU is saturated, while the database is lightly loaded. First measure request latency and CPU. A larger API host may be the simplest short-term fix. Two or more API instances behind a load balancer may provide more aggregate capacity, but the app must avoid relying on local session or file state.

## Common Pitfall
Adding API instances will not solve a database bottleneck. Scaling can simply move the queue to the next constrained tier.

## Knowledge Check
1. A single host has no free RAM. Which scaling approach directly adds RAM to that host?
   - **Answer:** Vertical scaling.
2. Why can horizontal scaling require application changes?
   - **Answer:** Requests may reach different instances, so sessions and shared state cannot safely depend on one instance's local memory or disk.

## Practice Hint
Sketch one API server and then three API servers behind a load balancer. Mark where sessions, uploaded files, and database connections live.

## Self-Check
Can you name one benefit and one cost of each approach, and identify what metric you would inspect before scaling?

## Next Lesson

Lesson 26
