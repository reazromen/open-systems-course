# Lesson 29 — Database Connection Pooling

**Course:** System Design — From the Ground Up  
**Module 6 — Distributed Data**

## Learning Objectives
- Explain why database connections are limited resources.
- Describe connection pooling and pool exhaustion.
- Estimate the combined connection load from application instances.

## Core Concept
Opening a database connection has cost, and databases can serve only a finite number of concurrent connections efficiently. A connection pool reuses established connections. Pools that are too small create waiting; pools that are too large can overwhelm the database when multiplied across many app instances.

## Worked Example
Six API instances each allow 30 database connections. Together they may open up to 180 connections, before accounting for workers and admin tools. If the database is comfortable with far fewer active connections, reduce per-instance pool sizes, cap concurrency, and measure wait time and query duration.

## Common Pitfall
Increasing pool size to fix every timeout. If the database is saturated, more concurrent queries may make latency worse.

## Knowledge Check
1. What is the maximum configured connection count for six instances with pools of 30?
   - **Answer:** 180, excluding other clients.
2. What two signals help diagnose pool exhaustion?
   - **Answer:** Pool wait time/active-versus-idle connections and database query or saturation metrics.

## Practice Hint
Calculate the total possible connections for your planned instance count and pool size, including background workers.

## Self-Check
Can you explain why pool sizing must consider the whole deployment rather than one server?

## Next Lesson

Lesson 30
