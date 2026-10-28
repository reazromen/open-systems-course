# Lesson 29 — Database Connection Pooling

**Course:** System Design — From the Ground Up  
**Module 5 — Scalability and Performance**

## Lesson Overview

Opening a database connection has overhead, and databases can only handle a finite number of concurrent connections efficiently. Connection pooling reuses established connections instead of creating one for every request.

## How a Pool Works

A pool maintains a bounded set of database connections. An application borrows a connection for a query or transaction and returns it when finished. Reuse avoids repeated connection setup and provides a limit on how many database operations an application instance can start concurrently.

## Size the Pool Across Instances

A pool size that seems small on one server can become enormous across many replicas. If 20 application instances each allow 50 connections, the fleet may open up to 1,000 connections. Pool limits should be considered alongside database capacity, workload concurrency, and the number of application instances.

## Queueing and Timeouts

When every pooled connection is busy, new requests wait for a free connection. A bounded wait timeout prevents requests from waiting indefinitely, while acquisition latency and pool saturation metrics reveal pressure. Raising the pool size can worsen database overload instead of fixing it.

## Release Connections Safely

Return connections reliably, including on exceptions, and avoid holding them while performing unrelated slow work. Transactions should have clear boundaries. A connection pooler can sometimes sit between application instances and the database, but its transaction and session modes have different compatibility requirements.

## Key Takeaways

Pools reuse connections and cap concurrency. Size them across the whole fleet, observe wait time, and avoid treating a larger pool as a universal performance fix.

## Practice Exercise

A service has 12 instances and each allows 40 database connections. Calculate the potential total and explain what you would check before increasing the per-instance pool size.

## Next Lesson

Lesson 30 — Capacity Estimation
