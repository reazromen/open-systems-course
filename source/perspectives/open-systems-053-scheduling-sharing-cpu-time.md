---
title: "Scheduling: Sharing CPU Time"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-053-scheduling-sharing-cpu-time.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 13
excerpt: "The scheduler decides which runnable work gets CPU time. Fairness, latency, priority, throughput, deadlines, and energy can conflict, so scheduling is policy over a finite resource."
eyebrow: "Open Systems Course · Lesson 53 of 180"
---

Ten runnable threads.

Four CPU cores.

Who runs now?

That question is scheduling.

The operating system maintains runnable execution contexts and chooses which get processor time.

There is no policy that simultaneously maximizes every desirable property.

Scheduling is a trade-off among fairness, latency, throughput, priority, deadlines, and sometimes energy.

## Runnable does not mean running

A thread can exist in several broad conditions:

    running
    runnable
    waiting

Running means a CPU is currently executing it.

Runnable means it could execute if given a CPU.

Waiting means it is blocked on some event such as I/O, a lock, or timer.

The scheduler primarily chooses among runnable work.

This distinction explains why a machine can have thousands of processes without needing thousands of CPUs.

## Time slicing creates the illusion of simultaneity

On one core, only one ordinary instruction stream executes at an instant.

The OS can switch among runnable threads rapidly.

To a human, several applications appear active.

On multicore machines, some truly execute in parallel while others are time-shared.

Virtualization of CPU time creates the process abstraction.

## Fairness is not simply equal milliseconds

Suppose two ordinary tasks have equal priority.

A fair scheduler tries to prevent one from monopolizing the CPU.

But tasks sleep, wake, block on I/O, and request different latency behaviour.

Linux's scheduler implementation has evolved over time. Current kernel documentation describes the transition from the older Completely Fair Scheduler design toward EEVDF, which uses virtual runtime, lag, and virtual deadlines to choose eligible work.

Do not memorize scheduler internals as universal OS theory.

The general problem is resource allocation over time.

## Interactive latency matters

A compiler can tolerate being delayed by a few milliseconds.

An audio thread may not.

A UI thread delayed too long feels frozen.

A real-time control loop may have explicit deadlines.

Schedulers therefore support different policy classes and priorities.

"Fair" background throughput and "respond within this deadline" are different goals.

Operating systems expose mechanisms so applications with legitimate timing requirements can request different treatment.

Those mechanisms must be used carefully because high-priority work can starve lower-priority work.

## Context switches have cost

Switching threads may require:

- saving and restoring register state;
- changing memory context;
- updating scheduler bookkeeping;
- disturbing caches and translation state.

The cost is not only the switch instruction itself.

A workload with excessive runnable threads can spend time scheduling and contending instead of doing useful work.

More threads are not automatically more throughput.

## I/O-bound and CPU-bound tasks behave differently

CPU-bound task:

    compute
    compute
    compute

I/O-bound task:

    compute briefly
    wait for network
    wake
    compute briefly
    wait again

Interactive and I/O-heavy work often needs fast wake-up response despite using little total CPU.

Schedulers need to account for behaviour across time.

That is why one snapshot of CPU percentage does not explain latency.

## Priority creates policy, not capacity

Give a task higher priority.

It may run sooner.

You did not create extra CPU cycles.

Something else may receive less.

Priority is useful when the system knows which work matters more.

It is dangerous when every service declares itself critical.

Priority inversion can also occur when a high-priority task waits on a resource held by lower-priority work.

Synchronization and scheduling interact.

## Real-time means bounded timing requirements

Real-time computing is not simply "very fast."

A real-time requirement concerns completing work within timing constraints.

A 1 ms response that occasionally becomes 500 ms may be unacceptable for a hard deadline even if average latency is excellent.

Operating systems provide real-time scheduling classes for specialized workloads.

Using them requires understanding resource and starvation consequences.

## Exercise: schedule five tasks

One CPU.

Five jobs:

- UI input: 1 ms every 20 ms;
- audio processing: 2 ms every 10 ms;
- backup compression: unlimited background work;
- database flush: 4 ms every 100 ms;
- log rotation: 50 ms once.

Design a policy.

Which work gets latency priority?

Which can wait?

What happens if total required CPU exceeds 100%?

The last question is unavoidable.

No scheduler can schedule more CPU time than exists.

## The lesson to carry forward

Scheduling decides who gets a finite execution resource and when.

It cannot create capacity.

It can distribute delay.

Good scheduling policy matches workload requirements:

- fairness;
- responsiveness;
- deadlines;
- throughput;
- energy.

When a process is slow, do not ask only whether it is running.

Ask whether it is runnable, waiting, preempted, or blocked.
