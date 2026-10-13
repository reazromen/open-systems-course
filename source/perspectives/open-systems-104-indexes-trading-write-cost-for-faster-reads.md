---
title: "Indexes: Trading Write Cost for Faster Reads"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-104-indexes-trading-write-cost-for-faster-reads.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 11
excerpt: "An index is an additional data structure maintained beside the base table. It can make selected reads much cheaper, but every index consumes space and adds work to writes."
eyebrow: "Open Systems Course · Lesson 104 of 180"
---

A table can contain ten rows or ten billion. The SQL query can look the same. The work required to answer it can be completely different.

An index is an additional data structure maintained so the database can find selected rows without scanning everything.

That speed is not free.

## An index is not the table

A useful model is: the base table stores the row data; an index stores selected keys plus enough information to locate matching rows.

Exact implementation differs by database and index type. PostgreSQL supports B-tree, Hash, GiST, SP-GiST, GIN, and BRIN access methods. SQLite commonly uses B-tree structures for tables and indexes.

The transferable lesson is that an index materializes an alternate access path.

## B-tree indexes fit common ordered lookups

B-tree indexes are useful for equality, ranges, ordering, and other operators supported by the index's operator class and collation.

Instead of checking every row, the engine can navigate a smaller ordered structure to the relevant key range.

That reduces read work but increases write work because every affected index must stay consistent with the table.

## Selectivity determines usefulness

If almost every row has active=true, an index on active may not help much. Reading the index and then visiting nearly the whole table can cost more than a sequential scan.

Index usefulness depends on data distribution, table size, query predicate, estimated row count, ordering requirements, cache state, and index type.

There is no universal rule that every WHERE column needs an index.

## Composite index order matters

An index on (customer_id, created_at) is not equivalent to an index on (created_at, customer_id).

The leading columns shape how the tree is ordered and which query patterns can navigate it efficiently.

Index design therefore starts from actual query shapes, not from the schema alone.

## Covering behavior can avoid table visits

Some databases can satisfy selected queries from index data without visiting the base table for every matching row.

PostgreSQL calls this an index-only scan when its conditions are met.

Including additional columns can make more queries coverable, but the index becomes larger and more expensive to maintain.

Optimization always moves cost somewhere.

## Every index taxes writes

An INSERT can require table changes, WAL or journal records, and updates to several indexes. UPDATE and DELETE operations can also create index maintenance work.

More indexes can mean faster selected reads, but also more disk usage, cache pressure, write amplification, and maintenance.

An unused index is not neutral.

## Query planners choose plans

Creating an index does not guarantee the database will use it.

PostgreSQL EXPLAIN shows the chosen plan. EXPLAIN ANALYZE actually executes the statement and reports execution information, so it must be used carefully on production workloads.

The engineering habit is to inspect the plan the database chose, not the plan you imagine it chose.

## Statistics influence the plan

Query planners estimate row counts and costs using statistics.

If statistics are stale or insufficient, the estimates can be wrong. A useful index can exist while the planner chooses another plan because its model of the data is inaccurate.

This is another example of derived state affecting behavior: the table contains data; statistics summarize that data for planning.

## Partial and unique indexes serve special contracts

PostgreSQL partial indexes can index only rows matching a predicate. This can reduce size and maintenance when only a subset matters.

Unique indexes also support correctness by efficiently detecting conflicting values for uniqueness constraints.

Indexes therefore participate in both performance and integrity.

## Practical experiment

Using SQLite or PostgreSQL locally, create a generated dataset, query an unindexed field, and inspect the query plan. Create an index and inspect the plan again.

Then insert another batch of rows and compare local write cost. Label any timing with database version, hardware, cache state, schema, and row count.

The point is not to publish a universal benchmark. It is to observe the read/write trade-off.

## The lesson to carry forward

Indexes are maintained alternate access paths. They can transform read cost while consuming disk, memory, CPU, and write bandwidth.

The next lesson moves from finding rows to changing them safely: transactions, atomicity, isolation, and durability.
