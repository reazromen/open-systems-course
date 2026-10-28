# Lesson 27 — Database Replication

**Course:** System Design — From the Ground Up  
**Module 5 — Scalability and Performance**

## Lesson Overview

Replication keeps copies of data on more than one database node. It can improve read capacity and availability, but replicas introduce synchronization lag and do not automatically solve every failure scenario.

## Primary and Replica

In a common primary-replica design, writes go to a primary database and changes are copied to one or more replicas. Applications may send read-only queries to replicas to reduce pressure on the primary. Some systems support multi-primary or other topologies, each with different conflict and consistency implications.

## Synchronous and Asynchronous Replication

With synchronous replication, a write may wait for acknowledgment from a replica or quorum, depending on the system's configuration. This can strengthen durability or read-after-write behavior but may increase latency and reduce write availability during network problems. Asynchronous replication returns before all replicas catch up, allowing lag and potentially losing recent changes under some failures.

## Replica Lag and Read Consistency

A user who updates a profile and immediately reads from a lagging replica may see the old value. Applications can route critical reads to the primary, track replication positions, or use database-specific consistency features. The correct choice depends on whether stale reads are acceptable for each operation.

## Replication Is Not a Backup

Replication can copy accidental deletions, corrupt data, or malicious changes to other nodes. Backups and tested restore procedures protect against different failure classes. High availability also requires failure detection, promotion procedures, fencing against split brain, and a way to return to a healthy topology.

## Key Takeaways

Replication creates additional copies and can help reads and availability, but it brings lag and failover complexity. It is not a substitute for independent backups.

## Practice Exercise

An online store shows stale order status when reads go to a replica. Explain why this can happen and propose a strategy for the immediate post-purchase confirmation page.

## Next Lesson

Lesson 28 — Sharding and Partitioning
