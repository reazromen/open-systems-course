---
title: "Choosing a Data Structure from the Workload"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-050-choosing-data-structure-workload.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "Do not choose arrays, hash tables, trees, queues, or graphs by popularity. Start from operations, scale, ordering, locality, concurrency, persistence, and failure requirements."
eyebrow: "Open Systems Course · Lesson 50 of 180"
---

You now know several structures.

The dangerous next step is memorizing a lookup table:

    array = fast
    linked list = insertion
    hash table = lookup
    tree = sorted
    queue = jobs

Real engineering is messier.

Choose from the workload.

## Write operations before structures

Suppose we are storing sensor readings.

Requirements:

- append once per second;
- keep seven days;
- scan recent data in order;
- query time ranges;
- persist across restart.

Immediately, a plain in-memory linked list is unlikely to be the final answer.

Persistence and range queries dominate.

A time-indexed database or append-oriented storage design becomes relevant.

The data structure exists inside a larger system.

## Read/write ratio matters

Workload A:

- 10 million reads per second;
- one update per hour.

You can spend more work maintaining indexes or caches.

Workload B:

- constant writes;
- rare reads.

Heavy indexing may amplify write cost unnecessarily.

Every optimization chooses which operation pays.

## Ordering matters

Need exact key lookup?

Hash table.

Need sorted range queries?

Balanced tree or ordered index.

Need newest item first?

Stack or deque.

Need oldest waiting item?

Queue.

Need arbitrary connectivity?

Graph.

These are starting candidates, not automatic answers.

## Scale matters

For 20 configuration entries, a linear list may be simpler and faster enough.

For 20 billion records, storage layout, distribution, and indexing dominate.

Do not import "web scale" complexity into a tiny firmware menu.

Do not use tiny-demo structures for massive production workloads without analysis.

Scale is a requirement.

## Hardware locality matters

An asymptotically good structure can perform poorly if it jumps through memory unpredictably.

Compact arrays often exploit cache locality.

Pointer-heavy structures can pay latency per node.

Databases design B-trees around storage pages.

Data structures live on hardware.

The model and machine interact.

## Concurrency matters

A structure accessed by one thread can be simple.

Shared across 64 threads?

Locking, atomic operations, sharding, or concurrent algorithms may be necessary.

A theoretically fast structure protected by one global lock can become a bottleneck.

The concurrency model belongs in the choice.

## Persistence changes everything

An in-memory tree disappears on restart.

A filesystem-backed index needs crash recovery.

A distributed data structure needs replication and consistency semantics.

The word "tree" or "hash" describes only part of the system.

Durable data structures operate under failure.

## Memory overhead matters

A hash table may reserve extra capacity.

A linked structure stores pointers.

A tree stores child references and balance metadata.

An array can be compact.

On a server with 128 GB RAM, overhead may be acceptable.

On a microcontroller with 320 KB SRAM, it can decide whether the firmware works.

Context wins.

## Build the operation matrix

For a candidate system, make a table:

    operation       frequency       latency goal
    lookup ID       very high       low
    insert          medium          moderate
    range query     high            low
    delete          rare            moderate
    ordered scan    high            streaming

Then compare candidate structures.

This is much better than starting:

"I want to use Redis."

Technology should follow operations and constraints.

## Exercise: design a call-history store

Requirements:

- append each call;
- lookup by call ID;
- list newest calls;
- filter by user and date;
- survive restart.

One in-memory hash table solves only exact lookup.

You need persistent storage plus indexes for query patterns.

The exercise demonstrates the transition from textbook data structures to data systems.

Module 11 will return to this at database scale.

## The lesson to carry forward

There is no best data structure.

There is a best fit under stated assumptions.

Choose by:

- operations;
- frequency;
- scale;
- ordering;
- locality;
- memory;
- concurrency;
- persistence;
- failure semantics.

If you cannot describe the workload, choosing the structure is guessing.

## Interactive companion exercise

Use the [data-structure explorer](../prototypes/interactive-system-design.html#data-structure-title) to compare operations before choosing a structure for a workload. The complexity assumptions are listed beside the model.
