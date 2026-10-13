---
title: "Partitioning, Sharding, and Data Placement"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-148-partitioning-sharding-and-data-placement.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 13
excerpt: "Sharding divides data across nodes so capacity can grow, but the partition key determines hotspots, cross-shard queries, rebalancing cost, and failure boundaries."
eyebrow: "Open Systems Course · Lesson 148 of 180"
---

One database eventually reaches a limit:

storage;
write throughput;
memory;
CPU;
administrative scale.

Sharding divides data into partitions placed on different nodes.

That adds capacity.

It also changes the data model.

## The partition key decides locality

Suppose users are partitioned by user_id hash.

All data for one user can be routed to a known shard.

That makes user-local operations cheap.

A query across every user now fans out to many shards.

The partition key determines which operations are local and which become distributed.

## Range partitioning preserves ordered locality

Partition by time or key range:

A-F;
G-M;
N-Z.

Range scans can be efficient.

But sequential or skewed keys can create hotspots.

If all new writes land in the newest time partition, one shard becomes overloaded.

## Hash partitioning spreads load

Hashing keys distributes them more evenly.

It sacrifices natural ordering locality.

A query for all users in one geographic range may touch many shards unless geography is part of the partition design.

There is no free partition key.

## Hot keys can defeat even distribution

One celebrity account, one popular game room, or one tenant can generate disproportionate traffic.

Hashing distributes keys, not traffic within a key.

Mitigations include:

subpartitioning hot entities;
caching;
write aggregation;
dedicated placement;
application redesign.

Workload skew must be measured.

## Cross-shard transactions are expensive

If account A is on shard 1 and account B on shard 8, an atomic transfer now requires distributed coordination or a different data model.

The local transaction guarantee from Module 11 no longer covers the whole operation.

Partitioning can turn one database problem into a distributed-systems problem.

## Rebalancing moves live state

Adding a node is not enough.

Data must be moved or ownership changed.

During migration:

old and new owners may coexist;
requests must be routed correctly;
writes must not disappear;
copy progress must be tracked.

Consistent hashing and partition maps are strategies for controlling how much ownership changes when membership changes.

## Metadata is itself critical state

Clients need to know:

which shard owns key X?

That mapping can live in a directory service, routing tier, or consensus-backed metadata store.

If metadata is stale, requests go to the wrong node.

Sharding introduces a control plane.

## Practical exercise

Take 100,000 generated user IDs and assign them across four shards using:

range partitioning;
hash modulo;
consistent-hash style mapping.

Then introduce one “hot” user generating 20 percent of all traffic.

Compare data distribution and request distribution.

The purpose is to see that balanced bytes do not imply balanced load.

## The lesson to carry forward

Sharding exchanges single-node limits for placement and coordination complexity.

The next lesson confronts multi-service state changes directly: distributed transactions, sagas, and transactional outbox patterns.
