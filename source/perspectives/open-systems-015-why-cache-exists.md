---
title: "Why Cache Exists"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-015-why-cache-exists.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 13
excerpt: "Cache exists because the processor can often use data faster than main memory can provide it. Locality lets a small fast store hide much of that latency—until the workload stops cooperating."
eyebrow: "Open Systems Course · Lesson 15 of 180"
---

Imagine a chef who keeps walking to a warehouse across town for every spoonful of salt.

The warehouse can store everything.

It is in the wrong place for the current task.

A CPU faces a related problem.

Processors can perform operations extremely quickly, but large main memory cannot deliver every instruction and data item at register-like latency.

Cache exists to keep likely-useful information closer.

## The hierarchy is a trade-off

A rough conceptual hierarchy is:

    registers
       ↓
    L1 cache
       ↓
    L2 cache
       ↓
    last-level cache
       ↓
    main memory
       ↓
    persistent storage

Exact organizations differ by processor.

The general trade-off is stable:

Small storage can be made very fast and close to execution.

Large storage is cheaper per bit but usually slower to access.

A hierarchy tries to deliver the illusion that much of the working data is both large and fast.

It works because programs often exhibit locality.

## Temporal locality: used recently, used again

Suppose a loop repeatedly updates the same counter.

The counter was used recently.

It is likely to be used again soon.

That is temporal locality.

Keeping recently used data in fast cache can save repeated trips to slower memory.

Many hot program structures benefit:

- loop variables;
- frequently called code;
- active object fields;
- stack data;
- hot lookup tables.

Not every workload has strong temporal locality, but enough real workloads do that caching is extremely valuable.

## Spatial locality: nearby data often matters

Suppose a program reads element 0 of an array, then 1, then 2, then 3.

Fetching exactly one byte from memory each time would waste bandwidth and latency.

Caches move data in blocks called cache lines.

When one address is fetched, nearby bytes arrive too.

If the program soon uses them, the initial memory access paid for several future hits.

This is spatial locality.

Sequential array processing often benefits greatly.

Pointer-heavy structures scattered through memory may benefit less.

## A cache hit and miss tell different stories

If requested data is already in the relevant cache level:

    cache hit

The processor can obtain it from that level.

If not:

    cache miss

The system searches or fetches from lower levels.

The miss penalty can be much larger than the hit latency.

This creates an important performance pattern:

A program can execute the same instructions on the same CPU and run much slower because its memory-access pattern changed.

Nothing in the source code needs to say "be slow."

The data layout can create the slowdown.

## Cache is invisible until it is not

At the source-code level:

    value = array[i]

looks the same whether the value is in L1 cache or main memory.

That is abstraction.

The architecture generally gives the program a memory model.

The microarchitecture decides how cache is used to accelerate it.

But performance counters and timing measurements can reveal the lower layer.

This is a classic leaky abstraction: correctness can remain unchanged while performance exposes the hidden mechanism.

## Cache coherence appears with multiple cores

Now imagine two CPU cores caching copies of the same memory location.

Core A writes a new value.

Core B still has an old cached copy.

The system needs rules to preserve the architecture's required memory behaviour.

Cache-coherence protocols coordinate cached copies so cores can maintain a usable shared-memory abstraction.

The details are complex and architecture-specific.

The important idea is familiar from distributed systems:

Multiple copies of state create a consistency problem.

A multi-core cache hierarchy is not the same as a distributed database, but the conceptual question rhymes:

Who has which version, and when does another participant learn about the update?

## Bigger cache is not automatically better

A larger cache may improve hit rate.

But larger structures can have different latency, power, area, and design costs.

Cache organization also includes choices such as:

- line size;
- associativity;
- replacement policy;
- private versus shared levels;
- write policy.

There is no single "more cache = better" rule independent of workload and implementation.

The correct question is:

Does this hierarchy serve this workload efficiently?

## Software can help or hurt locality

Compare two ways of visiting a large matrix.

One traversal order may follow contiguous memory.

Another may jump across distant locations.

The mathematical work is the same.

The cache behaviour may be very different.

Data-oriented software design often cares about layout precisely because processors retrieve memory in blocks and exploit locality.

This is one reason low-level performance work eventually crosses from algorithms into architecture.

## Cache also exists outside the CPU

Once you understand the CPU cache, you will recognize the pattern everywhere.

Browsers cache resources.

Operating systems cache disk pages.

DNS resolvers cache records.

CDNs cache content.

Applications cache database results.

The shared idea is:

Keep a copy closer to likely future use.

The shared danger is:

Copies become stale, consume space, and need invalidation rules.

CPU caches use specialized hardware coherence mechanisms.

Application caches use very different mechanisms.

Do not confuse the implementations just because the pattern is similar.

## Exercise: locality on paper

Write sixteen numbers in a 4×4 grid.

First read:

    row 1 left to right
    row 2 left to right
    row 3 left to right
    row 4 left to right

Then imagine the numbers are stored row by row.

Now read by columns.

Both traversals visit sixteen values.

But if a cache line brings several neighbouring row elements at once, the access patterns may use fetched data differently.

The exercise is not a benchmark.

It builds the intuition that memory order and access order interact.

## The lesson to carry forward

Cache exists because fast processors and larger memories operate at different speeds.

A small fast store can hide much of the latency when programs reuse recent data or nearby data.

The abstraction works spectacularly well—until misses, contention, coherence, or poor locality expose the lower layer.

When a program is mysteriously slow, ask not only:

How many instructions does it execute?

Also ask:

**Where is the data when those instructions need it?**
