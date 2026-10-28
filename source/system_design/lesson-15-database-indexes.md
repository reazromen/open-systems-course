# Lesson 15 — Database Indexes

**Course:** System Design — From the Ground Up  
**Module 3 — Database Fundamentals**

## Lesson Overview

An index helps a database find rows without scanning every row in a table. It can make reads much faster, but it consumes storage and adds work to writes.

## Why Indexes Exist

Without a suitable index, a query may inspect a large number of rows to find matching records. An index maintains an additional data structure that helps locate rows based on indexed columns. The exact structure and query plan depend on the database engine and index type.

## Choose Columns from Queries

If the application frequently looks up an account by email, an index on email may help. If it lists orders by customer and creation time, a composite index may be useful. Column order matters for many composite indexes: an index beginning with customer_id may support queries filtering by customer_id, while a query filtering only by status may need a different plan.

## The Cost of Indexes

Every additional index takes disk space and can increase the cost of inserts, updates, and deletes because the index must be maintained. Indexing every column is rarely a good strategy. Select indexes from actual query patterns, data distribution, selectivity, and execution-plan evidence.

## Measure Before and After

Use the database's query plan and performance statistics to check whether the index is used and whether it improves the real workload. A query can remain slow because it returns too much data, performs expensive joins, waits on locks, or competes for resources. Indexes are one tool, not a universal fix.

## Learning Objectives

- Explain how indexes reduce search work and why they consume resources.
- Propose indexes from actual filter, join, and sort patterns.

## Worked Example

For `SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC`, an index beginning with `(customer_id, created_at)` may help. Confirm the choice with the query plan and workload.

## Check Your Understanding

1. **Should every column receive an index?**

   No. Indexes use storage and add work to inserts, updates, and deletes.

2. **Why might an index on a low-cardinality status column be less useful?**

   If most rows share the same few values, the index may eliminate little work; the query plan and workload decide.

## Common Pitfall

Adding indexes by intuition without measuring query plans, selectivity, and write overhead.

## Key Takeaways

Index frequent and selective query paths based on evidence. Consider composite-column order, write overhead, storage, and actual query plans.

## Practice Exercise

An orders table often filters by customer_id and sorts by created_at. Propose an index to evaluate and explain what trade-off it introduces.


### Practice Hint

Start from the slow query: identify equality filters, range conditions, joins, and sort order, then inspect `EXPLAIN` output.

### Self-Check

Can you explain both the read benefit and write/storage cost of your proposed index?
## Next Lesson

Lesson 16 — Transactions and ACID
