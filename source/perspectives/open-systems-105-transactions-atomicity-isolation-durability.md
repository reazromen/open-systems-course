---
title: "Transactions: Atomicity, Isolation, and Durability"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-105-transactions-atomicity-isolation-durability.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "A transaction groups database operations into a unit with defined commit and rollback behavior. Atomicity, isolation, and durability are separate guarantees built from logging, MVCC, locking, and storage synchronization."
eyebrow: "Open Systems Course · Lesson 105 of 180"
---

A database transaction is often explained as all or nothing. That describes only part of the story.

Transactions exist because data changes happen in the presence of failures, concurrency, constraints, crashes, and retries.

A useful model separates atomicity, isolation, durability, and application consistency.

## Begin and commit define a logical boundary

Imagine a transfer that debits account A and credits account B inside one transaction.

Without a transaction, a crash between the writes can leave half the transfer.

With an atomic transaction, the database recovery model ensures that the committed logical result is not debit-without-credit.

How the engine achieves this depends on architecture. Common mechanisms include write-ahead logging, rollback journals, undo information, MVCC, locks, and commit records.

The SQL boundary is the interface. The recovery machinery makes the guarantee real.

## Atomicity does not mean simultaneous physical writes

Internally, pages, log records, indexes, and buffers can be modified at different moments.

Atomicity means the database exposes the transaction as committed or not committed according to its visibility and recovery rules.

Physical work can happen incrementally while the logical outcome is still all-or-nothing.

## Rollback stops at the database boundary

If a transaction fails before commit, database changes can be rolled back.

But rollback cannot unsend an email, reverse an external payment call, or erase an already-published message in another independent system.

That is a distributed-systems boundary.

Database transactions protect state inside the database transaction domain. External effects need patterns such as transactional outbox, idempotent consumers, or compensating workflows.

## Consistency is not automatic business correctness

A database can enforce declared constraints and structural invariants.

It cannot know every business rule unless the system encodes that rule.

If application code debits the wrong account while satisfying every database constraint, the transaction can still commit successfully.

Transactions preserve the rules represented in the system. They do not invent missing requirements.

## Isolation controls concurrent visibility

Two transactions can overlap in time.

Now ask: can one see the other's uncommitted writes, can the same query return different rows later, can two writers overwrite assumptions, and can predicates change because of concurrent commits?

SQL databases expose isolation levels to define classes of allowed and prevented phenomena.

PostgreSQL implements concurrency using MVCC plus other mechanisms. SQLite uses a different model depending on journal mode and transaction behavior.

Isolation is not simply transactions running one at a time.

## Durability begins at acknowledgement policy

A client sends COMMIT. When may the database reply success?

One policy can wait until required log state is durably persisted. Another configuration may acknowledge earlier to reduce latency while accepting a larger loss window.

PostgreSQL exposes synchronous commit behavior because this is a real durability/latency trade-off. SQLite exposes synchronous settings that influence persistence guarantees.

The SQL word COMMIT is therefore only the top of a deeper storage contract.

## WAL records durable intent before final page placement

Write-ahead logging uses a core ordering rule: log the change before relying on the changed data page as durable state.

A simplified sequence is: change data in memory, append WAL, make required WAL durable, acknowledge commit, and flush data pages later.

After a crash, recovery can replay log records for committed work that had not reached its final data pages.

This is why database directories contain different categories of state with different roles.

## Commit does not mean every replica has the change

If replication is asynchronous, the primary can acknowledge a commit before a replica receives it.

A primary failure followed by promotion of a lagging replica can therefore lose acknowledged work depending on the replication contract.

Synchronous replication can strengthen the acknowledgement contract at the cost of latency and sometimes availability.

Durability on one node and durability across a replicated system are different properties.

## Long transactions have operational cost

Long transactions can hold locks, retain old row versions, delay cleanup, expand conflict windows, and occupy connection-pool slots.

Transactions are not safer merely because they are longer.

Keep the transaction boundary aligned with the smallest unit of state that needs atomic consistency.

## Practical experiment

Using SQLite, create two account rows with a non-negative balance constraint.

Begin a transaction, update one row, inspect the changed value inside the transaction, then roll back and inspect again. Repeat and commit.

Then open two connections and observe how concurrent operations behave.

Do not generalize SQLite's exact behavior to PostgreSQL or another engine. The purpose is to see transaction boundaries as state transitions.

## The lesson to carry forward

Transactions group database work into a recoverable concurrent unit. Atomicity, isolation, and durability are separate guarantees.

The next lesson goes deeper into concurrency: what two transactions can see and why isolation levels exist.
