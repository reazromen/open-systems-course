---
title: "Filesystems vs Databases: Names, Records, and Guarantees"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-102-filesystems-vs-databases.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 10
excerpt: "Filesystems and databases both persist bytes, but they expose different abstractions. Filesystems organize named data; databases add records, queries, constraints, transactions, and concurrency control."
eyebrow: "Open Systems Course · Lesson 102 of 180"
---

A database usually stores its own files. So why not skip the database and store application records directly as files?

Sometimes that is exactly the right design. Sometimes it creates a system that quietly rebuilds half a database badly.

The difference is not that files are primitive and databases are advanced. The difference is the contract each abstraction gives the application.

## A filesystem stays general

A filesystem must support source code, logs, photos, executables, virtual machine images, databases, configuration, and temporary files. Its interface therefore stays generic: paths, files, directories, metadata, permissions, and byte ranges.

The filesystem does not know that one JSON file contains a user record. That generality is a strength because almost any application format can exist above it.

## A database understands records and relationships

A relational database understands columns, types, predicates, indexes, ordering, constraints, and transactions.

A query such as SELECT id, email FROM users WHERE active = true asks for a result set. The database can choose how to find it. The filesystem underneath only sees database files and I/O.

This extra layer is what makes complex queries and concurrent updates manageable.

## One record per file can be a good architecture

Imagine users/42.json, users/43.json, and users/44.json. For a small system this can be excellent: easy to inspect, easy to export, no database daemon, and simple backup semantics when writes are controlled.

If the workload is load-by-known-id, write infrequently, few concurrent writers, and modest data volume, a filesystem may be enough.

Architecture should follow the workload, not fashion.

## Then the queries arrive

Now the product asks for every active user created this month in one district, ordered by revenue.

With independent files, the application may need to enumerate, open, parse, filter, and sort many records while also handling concurrent changes.

You can build an index. Then you must keep the index synchronized. You can add locks. Then you need lock recovery. You can add a journal. At that point you are implementing database mechanisms.

## Filesystems have atomic operations too

Databases did not invent atomicity. Filesystems provide useful atomic operations under specific conditions.

A common configuration-update pattern is to write a temporary file, synchronize it as required, rename it over the old path, and synchronize the containing directory when the durability contract requires it.

POSIX rename() provides atomic pathname replacement under defined conditions.

That can be ideal for one-file snapshots. It does not automatically provide a transaction across many independently updated files.

## Multi-record changes create coordination problems

Suppose transferring money requires debit account A and credit account B. If each account is a separate file, a crash between the writes can leave half a transfer.

You now need a recovery protocol: journal, write-ahead log, copy-on-write snapshot, database transaction, or application event log.

The moment several pieces of state must change together, atomicity becomes a system-wide problem.

## Concurrency changes everything

One process reading one file is easy. Ten workers updating related records are different.

Now ask: who holds a lock, what is the lock granularity, what if a writer crashes, can readers see partial state, how are conflicting writes detected, and how is recovery performed?

Databases exist partly because these problems are common enough to solve generically.

SQLite is a useful example because it is a relational database engine stored in a local file rather than a separate network service.

That demonstrates an important distinction: database is an abstraction and set of guarantees, not necessarily a daemon.

## Durability still depends on lower layers

A database can request synchronization. The filesystem passes work to block storage. The device has its own persistence behavior.

Database durability is therefore built on lower-layer contracts. PostgreSQL documents WAL and synchronization behavior because durability depends on how log records reach persistent storage.

A database cannot make broken hardware honest. It can only use the guarantees available below it.

## Backups must match the engine

Copying a static directory can be a valid backup. Copying the live files of a changing database may be unsafe unless the database explicitly supports that backup method.

PostgreSQL base backups and WAL archiving are designed around PostgreSQL recovery semantics. SQLite provides backup mechanisms designed around its locking and consistency model.

Use a backup method compatible with the engine's consistency contract.

## Practical experiment

Create several JSON files representing records and write a script that searches them. Then load the same generated dataset into SQLite and add an index for the field you query.

Measure only on your own machine and label the environment. The point is not to prove SQLite is universally faster. The point is to see how a structured index changes the work needed to answer a query.

## The lesson to carry forward

A filesystem organizes named bytes. A database adds structured data semantics and coordination.

The next lesson focuses on relational structure: tables, keys, constraints, and why schema is executable policy rather than documentation alone.


Explore these storage guarantees and trade-offs in the [interactive storage and database model](../prototypes/interactive-system-design.html#database-title). The scenarios are deterministic teaching examples, not real I/O measurements.
