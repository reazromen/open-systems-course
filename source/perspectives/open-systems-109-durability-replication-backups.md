---
title: "Durability, Replication, and Backups"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-109-durability-replication-backups.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 13
excerpt: "Durability, replication, and backup solve different failure classes. A committed write can survive a process crash yet still be vulnerable to node loss, operator error, corruption, or insufficient historical recovery."
eyebrow: "Open Systems Course · Lesson 109 of 180"
---

People often compress several promises into one sentence:

the database is safe.

Safe from what?

A process crash, power loss, disk loss, server loss, region loss, accidental DELETE, corrupted application deployment, ransomware, and silent logical corruption are different failures.

Durability, replication, and backup address different parts of that space.

## Local durability protects committed state on one system

A database can use write-ahead logging so committed changes can be recovered after a crash even if modified data pages were not yet written to final locations.

PostgreSQL WAL records changes before the corresponding data pages need to be persisted.

SQLite uses rollback journals or WAL mode depending on configuration.

The important property is that recovery metadata exists before the database relies on incomplete page updates.

## fsync is part of the storage contract

Databases eventually rely on operating-system and storage-device synchronization semantics.

If a database is configured not to wait for required durable writes, it may acknowledge transactions earlier while accepting a larger loss window.

That can be a valid trade-off for some workloads.

It must be explicit.

A performance setting that weakens durability is an application-level risk decision even if it lives in a database configuration file.

## Replication creates another copy of current state

A primary database can stream changes to replicas.

Replication improves availability and can support read scaling or failover.

But asynchronous replicas can lag.

A primary can acknowledge a commit before the replica receives it.

If the primary disappears immediately, promotion of a lagging replica can lose the acknowledged change.

Synchronous replication can require one or more replicas to confirm progress before commit acknowledgement, strengthening the contract at the cost of latency and potentially availability.

## Replication faithfully copies mistakes

If an application writes the wrong price to every product row, replication distributes that incorrect state.

If an administrator drops a table, replicas can reproduce the deletion.

If ransomware encrypts accessible files, replicas connected to the same control plane may also be affected.

Replication is not history.

It is another current copy under a replication protocol.

## Backup creates a recovery point outside current mutation

A backup should let you reconstruct an earlier usable state.

Questions include:

- how frequently are backups taken;
- how long are they retained;
- are they immutable or isolated;
- is encryption managed safely;
- can one table be restored;
- can the entire system be restored;
- has restoration actually been tested?

A backup that has never been restored is only a backup hypothesis.

## Point-in-time recovery combines base state and logs

PostgreSQL supports continuous archiving where a base backup plus archived WAL can reconstruct the database to a chosen point in time.

Conceptually:

base backup at time T0 + WAL after T0 → replay until target time T1

This can recover to a moment before an accidental destructive operation.

The retention and integrity of both base backups and log archive matter.

## RPO and RTO describe different recovery goals

Recovery Point Objective, or RPO, describes how much recent data loss the organization is prepared to tolerate.

Recovery Time Objective, or RTO, describes how long restoration or failover may take.

These are business requirements translated into technical architecture.

A nightly backup can imply an RPO approaching 24 hours under some failure models.

A perfect backup stored offline can still have a poor RTO if restoration takes two days.

## Checksums detect some corruption, not all wrong data

Storage checksums can detect classes of physical or accidental corruption.

They cannot tell you that an application legitimately wrote the wrong business value.

Logical validation requires domain checks, invariants, audits, or comparison against other evidence.

Integrity has several layers.

## Backups must include dependencies

A database may not be the only authoritative state.

A complete service can depend on:

- object storage;
- encryption keys;
- configuration;
- schema migrations;
- queue state;
- secrets;
- external provider configuration.

Restoring the SQL database while losing the encryption key can leave the service unusable.

Recovery planning must follow the whole dependency graph.

## Practical recovery drill

On a local database, create sample data and take a supported backup.

Then deliberately delete the database or selected rows.

Restore into a separate location.

Verify row counts, constraints, application queries, and any checksums you maintain.

Record how long restoration takes and exactly which commands or tools were required.

Never make production recovery procedures depend on commands that have only been imagined.

## The lesson to carry forward

Durability keeps committed state through defined failures.

Replication creates additional current copies.

Backups preserve recovery history.

None replaces the others.

The final lesson of this module follows one application write from HTTP request through transaction, WAL, indexes, cache invalidation, replication, and backup history.
