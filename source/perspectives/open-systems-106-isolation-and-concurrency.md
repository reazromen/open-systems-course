---
title: "Isolation and Concurrency: What Can Two Transactions See?"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-106-isolation-and-concurrency.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "Concurrency lets many transactions make progress together, but overlapping reads and writes create anomalies. Isolation levels define which outcomes the database allows."
eyebrow: "Open Systems Course · Lesson 106 of 180"
---

A database can process many transactions at once.

That concurrency is essential for throughput, but it creates a hard question: what is each transaction allowed to observe while other transactions are changing the same data?

Isolation is the contract that answers that question.

## Concurrency creates overlapping realities

Imagine two workers reading the same inventory row. Both see quantity 1. Both decide they can sell one item. Both attempt to update the row.

If the system does not detect the conflict, two customers can buy the last unit.

The problem is not that either transaction was individually invalid. The problem is that both made decisions from overlapping state.

Concurrency bugs are therefore about interactions between otherwise reasonable operations.

## Dirty reads expose uncommitted state

A dirty read occurs when one transaction can observe another transaction's uncommitted change.

If the writer later rolls back, the reader acted on a state that never became committed truth.

Many modern relational systems prevent dirty reads at their commonly used isolation levels.

The important lesson is to separate tentative state from committed state.

## Nonrepeatable reads change a row underneath a transaction

Suppose transaction A reads a customer's status as active.

Transaction B commits an update changing the status to suspended.

Transaction A reads the same row again and now sees suspended.

Whether that can happen depends on the isolation level and database implementation.

For some workloads, that is acceptable. For others, the transaction needs a stable view.

## Phantom-style changes affect predicates

Now transaction A asks for every unpaid invoice.

Transaction B inserts a new unpaid invoice and commits.

If transaction A repeats the predicate and sees an additional row, the result set changed even though no previously read row was directly modified.

This class of anomaly shows why isolation cannot be explained only in terms of row locks.

Predicates and relationships matter.

## MVCC gives readers snapshots

PostgreSQL uses multiversion concurrency control, or MVCC, to let transactions see appropriate row versions while other transactions update data.

Instead of overwriting one universally visible row image immediately, the engine can maintain multiple row versions and determine visibility from transaction metadata.

This reduces some reader-writer blocking.

It also creates cleanup work because old versions eventually become unnecessary.

MVCC is therefore both a concurrency mechanism and a storage-management concern.

## Read Committed is statement-oriented in PostgreSQL

At PostgreSQL's Read Committed level, each statement sees a snapshot that includes transactions committed before that statement began, plus the transaction's own earlier changes.

Two SELECT statements in the same transaction can therefore see different committed data if other transactions commit between them.

This is a real contract, not a bug.

If your algorithm assumes one stable snapshot for the whole transaction, you need a stronger level or explicit coordination.

## Repeatable Read gives a more stable snapshot

PostgreSQL Repeatable Read uses a transaction-level snapshot and prevents several anomalies that Read Committed allows.

However, concurrent transactions can still conflict and one may need to abort.

Stronger isolation often means the application must be prepared to retry.

That is an important systems trade-off:

stronger correctness can move complexity from invisible anomalies to explicit retry handling.

## Serializable aims for serializable outcomes

Serializable isolation aims to make committed concurrent transactions behave as though they executed in some serial order.

PostgreSQL implements Serializable Snapshot Isolation and can abort transactions when it detects dependency patterns that could produce a non-serializable result.

Serializable does not mean the database literally executes every transaction one at a time.

It means the allowed committed outcomes must be equivalent to some serial execution.

## Locks are another coordination mechanism

Databases also use locks.

Row locks can prevent conflicting writers from changing the same row simultaneously. Table and predicate-related mechanisms can protect broader structures.

Explicit locking can be necessary when application logic needs a specific coordination point.

But locks create their own failure modes:

- waits;
- deadlocks;
- long-held resources;
- reduced concurrency.

A lock is a correctness tool with performance consequences.

## Deadlocks are cycles, not just slowness

Suppose transaction A locks row 1 then waits for row 2.

Transaction B locks row 2 then waits for row 1.

Neither can proceed.

A database can detect the wait cycle and abort one transaction.

The application then needs to handle the failure and often retry safely.

Consistent lock ordering can reduce deadlock opportunities.

## Optimistic concurrency uses versions instead of long locks

Another pattern is optimistic concurrency.

Read a row with version 7, compute a change, then update only if the version is still 7.

If another transaction changed the row first, the update affects zero rows or raises a conflict according to the design.

The application then retries or tells the user the data changed.

This works well when conflicts are uncommon and long locks would be expensive.

## Isolation levels are not application invariants

Even Serializable isolation does not know that two reservations in different tables represent the same physical seat unless the schema and transaction logic encode that relationship.

Database isolation constrains concurrent execution.

The application still has to define the correct state transition.

## Practical experiment

Open two database sessions against a local PostgreSQL or SQLite database.

In session A begin a transaction and read a row. In session B update and commit the same row. Then read again in session A.

Repeat using different isolation settings supported by your database and record what changes.

Do not generalize one engine's behavior to another. Read the engine's isolation documentation and explain the observed result from that contract.

Then create a deliberate lock-order inversion in a test table and observe how the database reports a deadlock or lock wait.

## The lesson to carry forward

Concurrency is not free parallelism. It creates overlapping views of mutable state.

Isolation levels, MVCC, locks, conflict detection, and retries determine which concurrent outcomes are allowed.

The next lesson moves from authoritative data to deliberately duplicated data: caches.
