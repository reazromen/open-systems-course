---
title: "Processes vs Threads"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-054-processes-vs-threads.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "Processes give stronger isolation boundaries; threads give cheaper shared-memory coordination inside one process. The choice is about failure, ownership, communication, and scheduling—not fashion."
eyebrow: "Open Systems Course · Lesson 54 of 180"
---

You want two pieces of work to happen concurrently.

Should they be threads in one process?

Or separate processes?

There is no universal answer.

The difference is primarily about what state is shared and what failures are isolated.

## Processes separate address spaces

Two ordinary processes have separate virtual address spaces.

One cannot normally read or write the other's memory directly.

Communication requires an explicit mechanism:

- pipe;
- socket;
- shared memory;
- file;
- message queue;
- OS-specific IPC.

That boundary creates overhead.

It also creates isolation.

One process can crash without directly corrupting the other's heap.

## Threads share the process address space

Threads in one process share:

- heap;
- global data;
- open descriptors;
- much process state.

Each thread has its own execution context and stack.

Communication can be as simple as reading the same object.

That is fast.

It also creates races.

Shared mutable memory is convenient precisely because the boundary is weak.

## Failure boundaries differ

Suppose one thread performs invalid memory access that terminates the process.

All threads in that process disappear.

Suppose one worker process crashes.

A supervisor can often restart that process while others continue.

This is one reason browsers and servers sometimes split responsibilities across processes.

Isolation can be a reliability feature.

## IPC makes contracts explicit

A process boundary forces you to serialize or otherwise define communication.

That can feel cumbersome.

It can also improve architecture.

Instead of arbitrary shared pointers, components exchange messages through a defined interface.

The cost is latency and complexity.

The benefit is clearer ownership and independent lifecycle.

## Threads can coordinate at finer granularity

Shared memory allows small data structures to be updated efficiently.

A thread pool can process tasks without serializing every object.

For compute-heavy workloads on shared data, threads may fit naturally.

But locking and cache contention can erase the expected performance gain.

Benchmark the workload.

## Languages add another layer

An OS thread is not always the same as a language-level concurrency construct.

Runtimes may provide:

- coroutines;
- async tasks;
- green threads;
- fibers;
- actor systems.

Many such tasks may run on fewer OS threads.

The source abstraction and scheduler layer differ.

Always ask who schedules the unit:

language runtime or kernel?

## Process creation can be cheap enough

Modern systems optimize process creation using copy-on-write, shared libraries, and efficient IPC mechanisms.

Do not assume a process always means duplicating all memory immediately.

Likewise, do not assume threads are "free."

Thread stacks, scheduler entries, runtime state, synchronization, and cache effects all cost resources.

Architecture needs measurement, not folklore.

## Security favors boundaries

If untrusted plugin code runs inside the same process as secrets, memory-safety bugs can expose everything in that address space.

Moving untrusted work to a restricted process can create a stronger boundary enforced by the OS.

Sandboxes build on this idea.

The trade-off is more communication infrastructure.

Security changes what "cheap" means.

## Exercise: choose the boundary

Scenario A:

Image-processing workers occasionally crash due to third-party native libraries.

Process isolation may be attractive.

Scenario B:

Eight CPU workers update a shared in-memory numeric array.

Threads may be attractive if synchronization is manageable.

Scenario C:

Untrusted document parser handles files from the Internet.

Stronger process sandboxing is worth considering.

For each, state what you are optimizing:

speed?

isolation?

simplicity?

security?

## The lesson to carry forward

Processes and threads are both execution structures.

Processes emphasize isolation and explicit communication.

Threads emphasize shared state and cheap coordination.

The choice should follow:

- failure boundary;
- security boundary;
- communication volume;
- state ownership;
- runtime model;
- workload.

"Threads are faster" and "processes are safer" are useful starting intuitions, not complete designs.

## Interactive companion exercise

Use the [process scheduler simulator](../prototypes/interactive-system-design.html#scheduler-title) to inspect ready/running/completed states. It models processes, not the full kernel data structures or scheduling semantics for threads.
