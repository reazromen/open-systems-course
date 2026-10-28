# Lesson 30 — Capacity Estimation

**Course:** System Design — From the Ground Up  
**Module 5 — Scalability and Performance**

## Lesson Overview

Capacity estimation uses rough calculations to turn product expectations into infrastructure requirements. The goal is not false precision; it is to identify the order of magnitude, assumptions, and likely bottlenecks before building.

## Estimate Traffic

Begin with users, activity, and peak patterns. If 100,000 daily active users each make 20 requests per day, that is 2 million requests per day. Dividing by 86,400 seconds gives about 23 requests per second on average; a peak multiplier may make the design target several times higher.

## Estimate Storage

Estimate records or files created per day, average size, retention period, and growth. If a service stores 2 million records daily at an average of 1 KB each, raw new data is roughly 2 GB per day before indexes, replication, metadata, and backups. Real storage overhead can be substantial.

## Estimate Bandwidth

Multiply request or response size by request rate to approximate network throughput. For example, 500 responses per second averaging 200 KB would represent about 100 MB/s of payload before protocol overhead and cache effects. Check whether the bytes are served by the origin, a CDN, or another tier.

## State Assumptions and Headroom

Document average versus peak traffic, cache-hit ratio, concurrency, growth, retention, and redundancy. Capacity planning includes headroom for spikes and failures, not just the normal average. Validate estimates with load tests and production telemetry, then revise them as real usage arrives.

## Key Takeaways

Estimate traffic, storage, and bandwidth with explicit assumptions. Distinguish average from peak demand, include overhead and headroom, and validate estimates with measurements.

## Practice Exercise

A service receives 5 million requests per day. Calculate its average requests per second, then estimate a target at 4× average peak. State why that estimate alone is not enough to size the whole system.

## Next Lesson

Lesson 31 — What Is a Distributed System?
