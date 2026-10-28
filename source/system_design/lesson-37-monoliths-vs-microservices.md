# Lesson 37 — Monoliths vs. Microservices

**Course:** System Design — From the Ground Up  
**Module 7 — Microservices**

## Lesson Overview

A monolith packages an application as one deployable unit; a microservices architecture divides capabilities into independently deployable services. Neither approach is automatically better: the choice depends on team structure, domain boundaries, scale, and operational maturity.

## What a Monolith Offers

A monolith can keep function calls simple, make local transactions straightforward, and reduce deployment and monitoring overhead. A well-structured modular monolith can separate business domains in code without introducing network calls between every module. Its challenges emerge when modules become tightly coupled or teams need conflicting release and scaling patterns.

## What Microservices Change

Microservices move some boundaries across processes and networks. Teams can deploy and scale services independently, and a failure can sometimes be isolated to one capability. In return, developers must handle network timeouts, partial failures, API compatibility, distributed tracing, data ownership, and multi-service workflows.

## Avoid Premature Distribution

Splitting a monolith can create more operational work than business value if boundaries are unclear. Shared databases and synchronous call chains can leave services tightly coupled despite separate deployments. Start with domain boundaries and measurable constraints, not the assumption that a large codebase must become microservices.

## A Practical Migration Path

First modularize the code and clarify ownership. Identify a capability with a clear interface and independent data needs, then extract it if there is a concrete reason. Measure deployment frequency, reliability, latency, and operating cost after the change. Keep a rollback or migration strategy for data and traffic.

## Key Takeaways

Monoliths reduce distributed-systems overhead; microservices can support independent ownership and scaling but add network and operational complexity. A modular monolith is often a sound starting point.

## Practice Exercise

A small team maintains a shopping application with one codebase and frequent deployment conflicts. What would you investigate before splitting it into microservices?

## Next Lesson

Lesson 38 — Defining Service Boundaries
