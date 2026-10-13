---
title: "Storage Is Not One Thing"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-101-storage-is-not-one-thing.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 10
excerpt: "RAM, files, databases, caches, object stores, and logs all hold state, but they make different promises about lifetime, structure, durability, and concurrency."
eyebrow: "Open Systems Course · Lesson 101 of 180"
---

When people say the data is stored, the sentence is incomplete. Stored where, for how long, in what structure, and under what failure model?

A register, RAM page, filesystem block, database row, cache entry, queue message, and object in object storage can all hold data. They are not interchangeable.

The first lesson of Data Systems is simple: **storage is a set of contracts about state**.

## State has a lifetime

A useful mental model is: CPU registers → process memory → kernel page cache → filesystem → database → replica or backup.

This is not a ranking. Each layer exists for a different reason. A value in process memory may disappear when the process exits. Dirty filesystem data may still be buffered. A database may acknowledge a transaction only after satisfying its durability policy. A backup may preserve an older state after the primary is corrupted.

So the word written should always be followed by a question: written to which layer?

## Volatile and durable are different promises

Volatile state depends on continued process or power lifetime. Durable state is intended to survive the failures named by the storage contract.

POSIX separates write operations from synchronization operations such as fsync(). That distinction matters: the application supplying bytes to the operating system is not the same claim as the bytes being durably persisted on stable storage.

The actual guarantee also depends on filesystem behavior, device caches, controller behavior, mount configuration, and hardware.

## Structure changes what questions are cheap

A flat file can store millions of records. That does not mean it can efficiently answer queries such as: find every active customer in one district, ordered by last payment, whose subscription has not expired.

A database adds structure such as schemas, keys, indexes, transactions, constraints, query planning, and concurrency control. Those features cost CPU, memory, I/O, disk space, and operational complexity. The benefit is a stronger data contract.

Storage design therefore starts from the workload: what do we write, how often, how do we read it, what must be atomic, how stale may reads be, how much data can we lose, and how quickly must we recover?

## Filesystems store named byte streams

A filesystem provides directories, filenames, permissions, timestamps, allocation metadata, and file descriptors. Applications build their own formats inside those files.

A SQLite database, PostgreSQL data directory, Git repository, JPEG image, and log file can all ultimately live on a filesystem. The filesystem knows bytes and metadata; it does not know that a particular byte range means customer email unless the application above it defines that meaning.

## Databases add data semantics

A database management system can add structured records, schemas, indexes, transaction boundaries, concurrency control, query languages, recovery, and replication.

For example, the database can enforce that a customer identifier is unique, an order references an existing customer, and a required field is not null. A plain file can encode the same information, but the filesystem will not enforce those relationships for you.

## Caches and queues are storage too

A cache stores copies or derived results because the authoritative source is slower or more expensive. Its central question is what happens when the cached copy disagrees with the source of truth.

A queue stores pending work or events over time. Its central questions include delivery count, acknowledgement, ordering, retention, and failure recovery.

Both are storage systems because both preserve state under a defined contract.

## Replication is not backup

Suppose a database has three replicas. If an operator accidentally deletes a table and replication works perfectly, all replicas can quickly contain the same mistake.

Replication improves some availability properties. A backup adds a historical recovery path. A real backup policy asks what point in time can be restored, how long history is retained, whether restore has been tested, and whether the backup is independent from the primary failure domain.

## Practical inspection

On a Linux machine you administer, create a small file and inspect it with ls -li, stat, and df -T. If strace is available, observe the open, write, close, and synchronization system calls made by a tiny program or shell command.

The exercise is not to prove one filesystem is faster. It is to see that application writes, operating-system buffering, filesystem state, and durable persistence are separate layers.

Then build a table for one real system you operate with columns such as authority, durable, shared, rebuildable, and recovery source. Every ambiguous cell is a design question worth answering.

## The lesson to carry forward

Storage systems differ in lifetime, structure, durability, concurrency, access pattern, and authority. Before choosing a database or cache, name the state contract you actually need.

The next lesson compares two foundational abstractions directly: filesystems and databases.
