# Lesson 25 — Vertical and Horizontal Scaling

**Course:** System Design — From the Ground Up  
**Module 5 — Scalability and Performance**

## Lesson Overview

Scaling is the process of increasing a system's ability to handle more work. The two foundational approaches are giving one machine more resources or distributing work across multiple machines.

## Vertical Scaling

Vertical scaling, or scaling up, means adding CPU, memory, faster storage, or network capacity to one server. It is often operationally simple because the application may need few architectural changes. However, the machine has practical limits, upgrades may require downtime, and a single host can remain a failure domain.

## Horizontal Scaling

Horizontal scaling, or scaling out, means adding more instances and distributing work among them. It can increase aggregate capacity and make instance replacement easier. It also introduces coordination, network communication, deployment consistency, and state-management concerns.

## Scale the Constrained Component

More web servers will not fix a database that is already saturated. Measure CPU, memory, disk I/O, connection counts, queue depth, and request latency to identify the bottleneck. Scaling one tier can move pressure to another tier, so evaluate the system end to end.

## Choose Deliberately

Vertical and horizontal scaling are not mutually exclusive. A service might use larger database instances while scaling stateless API instances horizontally. Consider cost, operational complexity, recovery objectives, and expected growth rather than treating horizontal scaling as an automatic goal.

## Key Takeaways

Scaling up adds resources to a machine; scaling out adds instances. Measure the bottleneck first, and account for state, coordination, and cost.

## Practice Exercise

An API server is CPU-bound, but its database has plenty of capacity. Compare scaling up the API host with adding two API instances behind a load balancer.

## Next Lesson

Lesson 26 — Bottlenecks and Performance Diagnosis
