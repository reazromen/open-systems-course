# Lesson 35 — The CAP Theorem

**Course:** System Design — From the Ground Up  
**Module 6 — Distributed Systems**

## Lesson Overview

The CAP theorem describes a limitation for distributed data systems when a network partition occurs: a system cannot simultaneously guarantee both strong consistency and availability for every request during that partition.

## What C, A, and P Mean

Consistency in CAP refers to a single, up-to-date view of data, often described through linearizability. Availability means every request to a non-failed node receives a non-error response. Partition tolerance means the system continues operating despite dropped or delayed communication between nodes, although the theorem focuses on the trade-off when such a partition exists.

## Why the Partition Matters

Network partitions cannot be ruled out in real distributed systems. When a partition separates replicas, one side may not know whether the other side has accepted a write. To preserve strong consistency, a system may reject or wait on some requests. To remain available on both sides, it may accept conflicting or stale operations.

## CP and AP Are Simplifications

CP and AP are useful shorthand for design choices during partitions, not permanent labels that explain every behavior of a product. Many systems provide different guarantees for different operations, configurations, or failure conditions. Read the actual consistency model and failure semantics rather than relying on a two-letter category.

## Do Not Confuse CAP with Everyday Trade-offs

CAP does not say a system must always choose only two of three properties under normal operation, nor does it mean consistency, availability, and performance are the same thing. Latency, durability, replication lag, and recovery remain separate design concerns. Specify which operations require which guarantees.

## Key Takeaways

CAP focuses on what a distributed data system can guarantee during a network partition. Understand the operation's consistency and availability requirements instead of using CP/AP as a complete product description.

## Practice Exercise

A replicated inventory service must avoid selling the last item twice. Explain why it may reject some writes during a partition and why that can be preferable to accepting every request.

## Next Lesson

Lesson 36 — Eventual Consistency and Distributed Transactions
