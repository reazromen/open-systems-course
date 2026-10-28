# Lesson 28 — Sharding and Partitioning

**Course:** System Design — From the Ground Up  
**Module 6 — Distributed Data**

## Learning Objectives
- Explain partitioning and sharding.
- Compare range-based and hash-based shard keys.
- Identify hot partitions and cross-shard query costs.

## Core Concept
Partitioning divides a dataset into smaller pieces. Sharding commonly means distributing those partitions across separate database nodes. A good partition key spreads load while supporting important queries. Range partitioning can make ranges efficient but create hot spots; hash partitioning often distributes keys more evenly but can make range queries harder.

## Worked Example
A messaging service stores events by account ID. Hashing account IDs across four shards can distribute ordinary traffic. But one extremely active account may still overload its shard, and a query across all accounts may need fan-out to every shard.

## Common Pitfall
Choosing a shard key only because it is easy to implement. Evaluate cardinality, access patterns, write distribution, and future resharding.

## Knowledge Check
1. What is a hot shard?
   - **Answer:** A partition or shard receiving disproportionate traffic or work.
2. Why can a query without the shard key be expensive?
   - **Answer:** The system may need to query multiple shards and combine the results.

## Practice Hint
Compare account ID, event date, and random hash as shard keys for a high-volume event service.

## Self-Check
Can you describe how your key distributes writes and how common reads find the relevant shard?

## Next Lesson

Lesson 29
