---
title: "Threads: Multiple Flows Inside One Process"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-026-threads-multiple-flows.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "Threads let one process contain multiple execution flows that share process resources. Shared memory makes communication cheap—and races possible."
eyebrow: "Open Systems Course · Lesson 26 of 180"
---

A process gives a program an execution environment.

A thread gives that process a flow of execution.

One process can contain multiple threads executing the same program while sharing much of the process state.

POSIX threads on Linux share global memory such as data and heap segments, while each thread has its own stack.

That one sentence explains both the power and the danger of threads.

## What is shared?

Threads in one process commonly share:

- address space;
- global variables;
- heap objects;
- open file descriptors;
- process identity and many process-wide resources.

Each thread needs its own execution state, including:

- program counter;
- registers;
- stack;
- scheduling state.

Conceptually:

    process
      ├── shared heap
      ├── shared files
      ├── thread A: registers + stack
      └── thread B: registers + stack

This is not the same isolation boundary as two separate processes.

## Why create threads?

Imagine a server.

One thread could accept new connections.

Others could process requests.

A UI application may keep one thread responsive while background work happens elsewhere.

A media application may separate capture, processing, and output.

Threads can use multiple CPU cores when the runtime and workload permit it.

They can also overlap computation with waiting.

But concurrency is not free performance.

It changes the state model.

## Shared memory makes communication easy

Thread A creates an object on the heap.

Thread B can often access the same object directly.

No network protocol.

No serialization required.

This can be fast and convenient.

It also means both threads can modify the same state.

Now timing matters.

Suppose:

    counter = 0

Thread A reads 0.

Thread B reads 0.

A computes 1.

B computes 1.

A stores 1.

B stores 1.

Two increments occurred.

Final value: 1.

That is a race.

## Locks create controlled access

A mutex can protect a critical section:

    lock
    read counter
    increment
    write counter
    unlock

Now only one cooperating thread enters at a time.

The race is controlled.

But locks introduce new possibilities:

- waiting;
- contention;
- deadlock;
- priority interactions;
- accidental long critical sections.

We solved one concurrency problem by creating a coordination mechanism that itself needs careful design.

This is normal systems engineering.

## Threads are scheduled independently

An operating-system scheduler can run threads on different cores or time-slice them.

Execution order can vary between runs.

A bug that depends on a rare timing order may disappear when you add logging or run under a debugger.

This is why concurrency bugs are notoriously difficult.

The program text is deterministic-looking.

The interleaving is not fixed.

## Thread-safe does not mean contention-free

A data structure may be thread-safe: simultaneous use does not corrupt its state.

That says nothing about performance under heavy contention.

If one global lock serializes every operation, fifty threads may spend most of their time waiting.

Correctness and scalability are different properties.

Measure both.

## Runtime rules matter

Different language runtimes implement threading differently.

CPython's current execution model and interpreter design have implementation-specific rules around Python execution and thread state.

Other runtimes use different mechanisms.

Do not generalize one language's threading restrictions to all threads on the operating system.

Always identify the layer:

OS thread?

Runtime thread?

Green thread?

Coroutine?

They are related abstractions with different scheduling rules.

## Exercise: create the race on paper

Two threads both execute:

    temp = counter
    temp = temp + 1
    counter = temp

Start counter at 10.

List an interleaving that ends at 11.

Then list an interleaving that ends at 12.

Same code.

Different schedule.

You have demonstrated why concurrent state needs synchronization.

## The lesson to carry forward

Threads let multiple execution flows share one process.

Shared memory makes communication efficient.

Shared mutable state makes ordering important.

The important questions are:

What is shared?

What is private?

Who can modify it?

What synchronization defines safe ordering?

Those questions lead directly into concurrency, scheduling, and race conditions later in the course.
