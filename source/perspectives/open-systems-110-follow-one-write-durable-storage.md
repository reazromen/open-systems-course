---
title: "Follow One Write to Durable Storage"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-110-follow-one-write-durable-storage.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 15
excerpt: "One application write can cross validation, transaction logic, indexes, WAL, page cache, storage devices, cache invalidation, replication, queues, and backup history. Following the write reveals what commit actually proves."
eyebrow: "Open Systems Course · Lesson 110 of 180"
---

We have separated filesystems, databases, schemas, indexes, transactions, isolation, caches, queues, replication, and backups.

Now follow one write through all of them.

Consider a constructed example: a signed-in user changes the display name on their profile from R to Reaz.

The application uses PostgreSQL as the source of truth, Redis as a cache, and an asynchronous queue for a search-index update.

No real deployment is being described.

## 1. The HTTP request reaches the application

The browser sends an authenticated request.

Before storage is involved, the application has already crossed DNS, transport, TLS, HTTP, session, authorization, and API validation boundaries from the previous module.

The application now has an intended state transition:

user 42 display_name should become Reaz.

That is still only intent.

## 2. Validation checks the requested value

The application verifies length, allowed characters, authorization, and any domain rules.

Validation success proves the request is structurally acceptable.

It does not prove the database write has happened.

## 3. The application starts a transaction

The application acquires a database connection from its pool and begins a transaction.

That introduces more state:

- connection-pool capacity;
- transaction ID or snapshot state;
- database timeout;
- lock/conflict behavior.

If no connection is available, the write can fail before SQL reaches the database.

## 4. The UPDATE finds the target row

The database receives an UPDATE for user 42.

An index on the primary key can help locate the row efficiently.

The index is not a separate source of truth. It is a maintained access structure pointing toward table data.

If the row does not exist, the application must decide whether that means not found, conflict, or another domain result.

## 5. Constraints validate the new database state

The database checks relevant constraints.

If display_name is NOT NULL, a NULL value is rejected.

If a uniqueness rule exists, conflicting state is rejected.

Application validation and database constraints are separate layers.

The application can be buggy while the database still protects declared invariants.

## 6. MVCC creates a new visible version

In PostgreSQL, an update participates in MVCC rather than simply overwriting one universally visible row image.

Concurrent transactions can continue seeing row versions appropriate to their snapshots.

The new version becomes visible according to transaction commit and isolation rules.

That means storage contains concurrency metadata in addition to the business columns.

## 7. Indexes may also change

If display_name is indexed, the database must update index state as part of the transaction.

One logical UPDATE can therefore create work in:

- table storage;
- one or more indexes;
- WAL;
- buffer cache;
- visibility metadata.

The SQL statement is small. The storage work can be larger.

## 8. WAL records the change before final page placement

PostgreSQL records the change in WAL before relying on changed data pages as durable.

A simplified commit path is:

change buffers → generate WAL → persist required WAL → record commit → acknowledge according to policy.

Data pages can be flushed later.

This is why commit does not require every modified table page to be in its final disk location before the client gets success.

Recovery can replay WAL.

## 9. COMMIT establishes the database boundary

When COMMIT succeeds under the configured durability policy, the database has accepted the transaction as committed.

That is a strong claim.

It is still not every claim.

It does not necessarily mean:

- every replica has received the write;
- Redis has been invalidated;
- the search index has been updated;
- a backup already contains the change;
- the browser has rendered the new value.

Commit proves the database transaction contract.

## 10. Cache invalidation follows

The application may delete user:42 from Redis or update the cached representation.

Suppose database commit succeeds but cache invalidation fails.

Now:

PostgreSQL = Reaz

Redis = R

The source of truth is correct while reads through the cache can be stale.

This is why cache invalidation is a separate state transition and needs retry or bounded TTL behavior.

## 11. A message is published for asynchronous work

The application may enqueue an event such as profile.updated.

A search worker processes it later.

If publishing happens after database commit, the application can crash between commit and publish.

Then the database is correct but no event exists.

This is the classic reason to use patterns such as a transactional outbox when reliable event publication must be coupled to the database transaction.

## 12. Replication happens on another timeline

WAL or logical change information moves toward replicas according to the replication design.

With asynchronous replication, a replica can temporarily still show R while the primary shows Reaz.

A read routed to that replica can therefore appear stale immediately after a successful write.

Read-after-write consistency is an architecture property, not an automatic consequence of replication.

## 13. Background storage catches up

Dirty database pages are eventually written from memory to storage according to checkpoint and background-write behavior.

Old MVCC row versions eventually become reclaimable when no active snapshot needs them.

Indexes and statistics may also need maintenance over time.

The write's operational footprint continues after the user request is finished.

## 14. Backup history eventually includes the change

A base backup taken later contains the state.

With continuous WAL archiving, the change can also be represented in the recovery log stream used for point-in-time recovery.

That gives the write a place in recovery history.

But a backup is useful only if restore procedures can reconstruct a valid system.

## 15. Observability should name each boundary

For one write, useful evidence includes:

- HTTP request ID;
- application validation result;
- database connection wait;
- transaction duration;
- SQL rows affected;
- commit success/failure;
- cache invalidation result;
- queue publication result;
- replica lag;
- backup/archive health.

A single application log saying profile updated hides too much.

## Break one layer at a time

In a local test environment:

1. reject the request in validation;
2. violate a database constraint;
3. force a transaction conflict;
4. commit successfully but disable cache invalidation;
5. restore invalidation but stop the queue broker;
6. restore the broker and pause the replica;
7. restore everything and test backup recovery.

Record which system contains the authoritative value at every step.

The visible user operation stays the same.

The failed state transition moves.

## What this module added

Data Systems gave us a new stack:

application state → schema → indexes → transaction → concurrency control → WAL/journal → filesystem/device → cache/queue → replica → backup.

Every layer stores or derives state under a different contract.

## The module to carry forward

A systems engineer should be able to ask:

Where is the authority?

What has committed?

What is only cached?

What can be stale?

What can be redelivered?

What survives a crash?

What survives node loss?

What survives operator error?

How do we restore?

Those questions turn data architecture from product names into explicit guarantees.

Module 12 moves into Embedded Systems: microcontrollers, GPIO, interrupts, timers, buses, memory, firmware structure, RTOS behavior, watchdogs, power, and one complete sensor-to-output path.
