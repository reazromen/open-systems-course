# Lesson 28 — Sharding and Partitioning

**Course:** System Design — From the Ground Up  
**Module 5 — Scalability and Performance**

## Lesson Overview

Partitioning divides a dataset into smaller pieces. Sharding usually refers to distributing those partitions across multiple database nodes so storage and workload can grow beyond one node's practical limits.

## Why Partition Data?

A single database can eventually face limits in storage, write throughput, or maintenance windows. Partitioning divides data into manageable groups. A database may partition a table within one server, while sharding distributes groups across separate servers and failure domains.

## Choose a Partition Key

A partition key determines where a record belongs. User ID can work well for user-owned data, while tenant ID may fit a multi-tenant application. A poor key can create hotspots if most traffic targets one partition. Keys should distribute load while keeping common queries efficient.

## Range and Hash Strategies

Range partitioning places nearby key values together, which can help range queries but may overload the newest range when writes follow time. Hash partitioning distributes keys more evenly, but range scans may need to visit many partitions. The right strategy depends on the query workload and data growth.

## Operational Trade-offs

Sharding complicates cross-shard joins, transactions, rebalancing, migrations, backups, and observability. Some systems provide these features, but they still require careful planning. Start sharding only when measured limits justify the operational cost; indexing, query tuning, archiving, or vertical scaling may be sufficient first.

## Key Takeaways

Partitioning divides data; sharding distributes it across nodes. Pick keys based on query patterns and even load distribution, and plan rebalancing and cross-partition operations.

## Practice Exercise

A messaging application stores messages by user ID. What are the advantages and possible hotspot or query challenges of using user ID as the shard key?

## Next Lesson

Lesson 29 — Connection Pooling
