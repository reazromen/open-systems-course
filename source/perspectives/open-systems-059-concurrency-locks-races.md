---
title: "Concurrency, Locks, and Race Conditions"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-059-concurrency-locks-races.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 13
excerpt: "Concurrency means multiple activities can make progress over overlapping time. Shared mutable state makes outcomes depend on ordering, creating races that synchronization mechanisms must control."
eyebrow: "Open Systems Course · Lesson 59 of 180"
---

Two threads increment one counter.

The final answer should be two increments larger.

Sometimes it is not.

The arithmetic is easy.

The ordering is hard.

That is concurrency.

## One line can be several machine actions

Source:

    counter += 1

Conceptually:

    load counter
    add 1
    store counter

Thread A loads 10.

Thread B loads 10.

A stores 11.

B stores 11.

One increment disappeared.

The source statement looked indivisible.

Execution was not.

This is a race condition.

## Race means outcome depends on timing

A race exists when program correctness depends on uncontrolled ordering of concurrent operations.

Not every concurrent program has a harmful race.

Independent threads can operate safely on separate state.

The danger appears when operations overlap on shared resources without sufficient coordination.

Shared mutable state is the classic trigger.

## Mutex makes a critical section exclusive

Protect:

    lock
    counter += 1
    unlock

Only one cooperating thread enters at a time.

Now increment is serialized.

Correctness improves.

But every thread may wait on one lock.

Under heavy contention, performance suffers.

A mutex transforms a race into a scheduling problem.

That can be the right trade.

## Atomic operations provide smaller guarantees

Processors and languages expose atomic operations that perform specific read-modify-write actions indivisibly under the relevant memory model.

A counter increment may use an atomic primitive instead of a heavy mutex.

But atomicity of one variable does not solve multi-variable invariants automatically.

Suppose:

    debit account A
    credit account B

Two independent atomics do not make the transfer transactionally atomic as a pair.

Choose synchronization at the invariant boundary.

## Deadlock is coordination that cannot progress

Thread A holds lock 1, waits for lock 2.

Thread B holds lock 2, waits for lock 1.

Neither can proceed.

This is deadlock.

Common prevention strategies include:

- consistent lock ordering;
- minimizing nested locks;
- timeouts in suitable designs;
- avoiding shared locking through message passing.

Every lock adds both protection and dependency.

## Memory ordering is another layer

On multicore systems, processors and compilers can reorder operations within constraints.

Atomic and synchronization primitives also define visibility and ordering relationships.

This is why correct lock-free programming is difficult.

"Both cores eventually see the value" is not a sufficient memory model.

Use language-defined concurrency primitives rather than inventing synchronization from ordinary variables.

## Concurrency is not parallelism

Concurrency:

multiple activities have overlapping lifetimes and must coordinate.

Parallelism:

multiple operations physically execute at the same time.

One CPU core can run concurrent tasks through scheduling.

Multiple cores can run them in parallel.

The distinction matters because races can happen in concurrent systems even without simultaneous physical execution.

Interleaving is enough.

## Message passing moves the boundary

Instead of shared memory:

    worker A -> message -> owner

One task owns state.

Others request changes through messages.

This can reduce shared-memory races.

It introduces queues, serialization, latency, and backpressure.

No coordination model removes trade-offs.

It changes where they live.

## Exercise: find the invariant

Bank balance:

    balance = 100

Two threads withdraw 80 after checking balance >= 80.

Both read 100.

Both approve.

Now total withdrawal is 160.

The dangerous state is not one variable assignment.

The invariant is:

Never allow successful withdrawals to exceed available funds.

Synchronization must protect the check-and-update relationship.

This is why locks should follow invariants, not lines of code.

## The lesson to carry forward

Concurrency makes ordering part of correctness.

Locks, atomics, queues, and ownership models control that ordering.

Every mechanism has costs.

The design questions are:

What state is shared?

What invariant must hold?

What ordering establishes it?

What happens when participants wait or fail?

These questions recur in threads, databases, networks, and distributed systems.

## Interactive companion exercise

Step through a lost-update interleaving, then switch to the locked schedule in the [race-condition simulator](../prototypes/interactive-system-design.html#race-title). Compare the final shared counter values.
