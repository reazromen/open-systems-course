---
title: "Interrupts: When Hardware Events Enter Software"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-113-interrupts-hardware-events-enter-software.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 11
excerpt: "Interrupts let hardware request CPU attention asynchronously. They reduce polling but introduce latency, priority, shared-state, and execution-context constraints."
eyebrow: "Open Systems Course · Lesson 113 of 180"
---

A processor can poll a GPIO forever asking whether anything changed.

That works.

It also wastes time and can miss timing requirements when many things need attention.

Interrupts invert the relationship: hardware raises an event and the processor temporarily changes control flow to handle it.

## An interrupt is asynchronous to normal code

Main code can be executing one instruction stream when a timer, GPIO edge, UART, DMA engine, or other peripheral signals an interrupt.

The processor saves enough context, transfers control to an interrupt handler, and later resumes interrupted execution.

That creates two execution contexts touching shared state.

Concurrency begins even on a single-core MCU.

## ISR means interrupt service routine

An ISR should usually do the smallest time-critical work necessary.

Common responsibilities are acknowledging or clearing the interrupt source, capturing essential state, placing data into a queue or buffer, and waking deferred work.

Heavy parsing, logging, dynamic allocation, blocking I/O, and long computations are often poor ISR choices.

Why? Because while a long ISR runs, lower-priority work and interrupts may be delayed.

## Latency is different from execution time

Interrupt latency is the time from the hardware event to the ISR beginning useful handling.

ISR execution time is how long the handler occupies its execution context.

Both matter.

Latency can be affected by disabled interrupts, higher-priority handlers, critical sections, cache effects, and architecture-specific entry overhead.

Real-time debugging must measure the path, not assume the interrupt is immediate.

## Priority is a scheduling policy

Many MCUs support interrupt priorities.

A higher-priority interrupt can preempt a lower-priority one according to architecture and configuration.

That lets critical timing events win CPU time.

It can also create starvation or hard-to-debug nested execution when priorities are chosen badly.

Priority should express timing requirement, not emotional importance.

## Shared variables need synchronization semantics

Suppose an ISR increments a counter while a task reads and resets it.

Both contexts access the same state.

Marking a variable volatile can tell the compiler that the value may change unexpectedly, but volatile is not a complete synchronization primitive.

It does not make compound updates atomic and does not automatically provide ordering between cores or execution contexts.

Use the synchronization primitives appropriate to the architecture and RTOS: atomic operations, critical sections, interrupt-safe queues, or locks designed for ISR use.

## Interrupt flags must be handled correctly

Many peripherals latch a status bit when an event occurs.

The ISR must identify the source and clear or acknowledge it according to the peripheral rules.

If the flag is never cleared, the handler can immediately fire again.

If it is cleared too early or incorrectly, events can be lost.

Peripheral reference manuals matter because acknowledgement semantics differ.

## Edge and level triggering behave differently

An edge-triggered interrupt reacts to a transition.

A level-triggered interrupt remains asserted while a condition remains true.

With level-triggering, returning from the ISR without removing the cause can immediately retrigger it.

With edge-triggering, events that occur while handling or masking may need explicit status capture to avoid loss.

Choose and debug according to the source's real behavior.

## Deferred work is a powerful pattern

A clean architecture is:

hardware event → short ISR → queue/notification → task handles expensive work.

The ISR preserves timing. The task runs in a normal scheduler context where blocking operations and richer APIs are safer.

FreeRTOS provides ISR-safe variants of queue and notification APIs for this pattern.

## Practical experiment

Configure a GPIO interrupt on a development board and increment a counter in the ISR.

Then signal a task to print the counter rather than printing from inside the ISR.

Toggle the input slowly and then more rapidly from a safe signal source.

Observe whether events are lost, coalesced, or delayed. If you have a logic analyzer, toggle a second diagnostic pin at ISR entry and exit to measure real latency and execution time.

## The lesson to carry forward

Interrupts let hardware enter software asynchronously.

They improve responsiveness but create concurrency, priority, and timing constraints.

The next lesson introduces the hardware that often generates those interrupts: clocks, counters, timers, capture/compare, and PWM.

## Interactive companion exercise

For a simplified view of how event bursts wait for processing capacity, use the [queue-and-worker simulator](../prototypes/interactive-system-design.html#queue-title). It models queued work and backpressure, not hardware interrupt latency.
