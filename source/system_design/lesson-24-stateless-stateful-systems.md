# Lesson 24 — Stateless and Stateful Systems

**Course:** System Design — From the Ground Up  
**Module 4 — Core Architecture Components**

## Lesson Overview

State is information a system retains between operations. Whether state lives inside an application instance or in a shared service affects scaling, failover, deployment, and correctness.

## What Is State?

A stateless request handler does not depend on memory retained from a previous request to process the next one; the request carries the necessary context or retrieves it from a shared store. A stateful component retains information such as an in-memory session, an open protocol session, or a local workflow state that influences future interactions.

## Why Stateless Application Tiers Scale Easily

If any healthy application instance can handle any request, a load balancer can distribute traffic freely and failed instances can be replaced more easily. Durable business state still exists, typically in a database or another dedicated service. Stateless does not mean the entire product has no state.

## Where State Can Live

Sessions may live in a shared session store; durable records may live in a database; uploaded files may live in object storage; and transient hot data may live in a cache. Each store has different persistence and consistency guarantees. Keep state in a component designed for its lifetime and correctness requirements.

## Stateful Services Need Explicit Operations

Some systems naturally maintain state, including databases, message brokers, and real-time connection servers. They require careful handling of persistence, replication, failover, recovery, and ownership. Moving state out of an application process can simplify horizontal scaling, but it also adds network dependencies and shared-service capacity needs.

## Key Takeaways

Stateless application instances are easier to distribute and replace, but real systems still have state. Put each kind of state in a suitable store and plan for that store's failure modes.

## Practice Exercise

A web application stores login sessions in local memory. Explain what happens when a user's next request reaches another instance and propose a more resilient design.

## Next Lesson

Next: Batch 3 — Scalability and Performance (Lessons 25–30)
