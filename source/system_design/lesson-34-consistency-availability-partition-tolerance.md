# Lesson 34 — Consistency, Availability, and Partition Tolerance

**Course:** System Design — From the Ground Up  
**Module 6 — Distributed Systems**

## Lesson Overview

Distributed data systems must make decisions when nodes communicate imperfectly. Consistency, availability, and partition tolerance describe important properties, but their precise meaning depends on the system and the guarantee being discussed.

## Consistency in Distributed Data

In this context, strong consistency commonly means reads observe the latest successfully completed write according to the system's specified ordering. Other systems allow stale reads or different replicas to temporarily disagree. This is distinct from the database consistency in ACID, which refers to preserving defined rules and invariants.

## Availability

Availability describes whether a system continues to return responses to requests. A system that rejects a request to preserve a correctness guarantee may be unavailable for that operation even if its servers are running. Real availability also depends on timeouts, routing, dependencies, and what counts as a successful response.

## Network Partitions

A network partition occurs when groups of nodes cannot reliably communicate. They may each still be running and reachable by some clients. In a distributed system, it may be impossible to know immediately whether a remote node has failed or is merely unreachable.

## The Trade-off During a Partition

For a replicated data operation during a partition, a system may reject or delay some operations to preserve a strong consistency guarantee, or continue accepting operations in more than one partition and reconcile later. The choice is operation-specific: a shopping cart may tolerate temporary divergence differently from a bank balance.

## Key Takeaways

Define consistency and availability precisely. During network partitions, distributed systems face real trade-offs between accepting operations and preserving a single agreed view of data.

## Practice Exercise

Compare a social-media like counter with a bank transfer during a network partition. Which temporary behaviors might each system permit, and which would be dangerous?

## Next Lesson

Lesson 35 — The CAP Theorem
