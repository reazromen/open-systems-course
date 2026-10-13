---
title: "RTOS Tasks, Queues, and Synchronization"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-118-rtos-tasks-queues-and-synchronization.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 13
excerpt: "An RTOS lets embedded software divide work into scheduled tasks, but concurrency introduces priorities, blocking, queues, mutexes, deadlocks, stack limits, and timing dependencies."
eyebrow: "Open Systems Course · Lesson 118 of 180"
---

A simple firmware loop can do everything:

read sensor, update display, check network, blink LED, repeat.

That architecture works until different activities need different timing and blocking behavior.

An RTOS introduces tasks and a scheduler so independent activities can wait, run, and communicate under explicit rules.

## A task is an execution context

An RTOS task typically has its own stack, saved CPU context, state, and priority.

At any moment a task may be running, ready, blocked, suspended, or waiting for time or an event.

The scheduler chooses which ready task runs according to the RTOS policy.

This is not parallelism by itself on a single core. It is controlled interleaving.

On multicore MCUs, tasks can also execute truly in parallel depending on the RTOS port and affinity rules.

## Blocking is better than busy waiting

A task that continuously checks whether data arrived wastes CPU time and power.

A better design blocks on a queue, semaphore, notification, timer, or event and becomes ready only when useful work exists.

This creates a central embedded pattern:

peripheral/ISR produces event → task wakes → task processes event → task blocks again.

CPU time becomes available for other work or low-power idle states.

## Queues transfer ownership and data

RTOS queues can move fixed-size messages between tasks or from ISR to task using interrupt-safe APIs.

A queue creates a clear boundary:

producer owns data before send; consumer owns the received copy or referenced object according to the design.

If pointers are queued instead of copied data, buffer lifetime becomes critical.

A pointer to a stack variable that disappears before the consumer uses it is a bug even if the queue itself works perfectly.

## Mutexes protect shared resources

If two tasks use the same I2C bus, filesystem, or data structure, they may need mutual exclusion.

A mutex ensures one owner enters the protected critical section at a time.

That solves one problem and can create others:

- deadlock;
- priority inversion;
- long blocking;
- hidden coupling.

Keep critical sections short and define lock ordering.

## Priority inversion is a scheduling interaction

Imagine a low-priority task holds a mutex needed by a high-priority task.

A medium-priority task runs repeatedly and prevents the low-priority owner from releasing the mutex.

The high-priority task is indirectly delayed by medium-priority work.

Priority inheritance can temporarily raise the mutex owner's effective priority to reduce this problem.

FreeRTOS mutexes provide priority-inheritance behavior for this reason.

## Semaphores and notifications represent events, not ownership

A binary semaphore or task notification can signal that an event occurred.

A counting semaphore can represent a count of available events or resources.

These are not interchangeable with mutex ownership semantics.

Use the primitive that expresses the contract.

## Real-time scheduling is about deadlines

Giving everything high priority does not make a system real-time.

Priorities should reflect timing constraints and blocking relationships.

A high-priority task that performs long blocking I/O can still damage system latency.

Measure worst-case execution and blocking paths for time-critical work.

## Tick timing is not exact hardware timing

Task delays are scheduler-level timing.

If a task delays for 10 ms, it becomes eligible according to tick and scheduling rules. Execution can happen later if a higher-priority task occupies the CPU.

For precise waveforms or capture, use hardware peripherals.

Use the RTOS for scheduling software work around those events.

## Stack size belongs to each task

Every task stack consumes RAM.

Too large wastes scarce memory.

Too small risks corruption.

RTOS diagnostics can expose stack high-water marks and overflow detection depending on configuration.

Production sizing should come from measurement under representative paths, not a copied number from an example.

## Practical experiment

Build three tasks on a development board:

- one periodic sensor-like task;
- one logging task;
- one command task.

Move samples through a queue rather than a shared global variable.

Then deliberately slow the logging task and observe queue depth.

Next, protect a shared resource with a mutex and instrument how long each task waits.

The goal is to see scheduler state, not merely that all tasks print messages.

## The lesson to carry forward

An RTOS converts one firmware control flow into interacting scheduled contexts.

Queues, mutexes, semaphores, priorities, and notifications make concurrency explicit.

The next lesson asks what happens when the system stops making progress: watchdogs, reset reasons, brownouts, sleep, and power.
