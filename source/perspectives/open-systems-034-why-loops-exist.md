---
title: "Why Loops Exist"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-034-why-loops-exist.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 10
excerpt: "Loops exist because programs repeat work over data, time, and events. The important questions are what changes each iteration, what stops repetition, and how much work accumulates."
eyebrow: "Open Systems Course · Lesson 34 of 180"
---

You have 10,000 sensor records.

You need to validate each one.

Writing 10,000 separate statements would be absurd.

Repetition creates the need for loops.

## A loop is repeated state transition

Consider:

    total = 0

    for reading in readings:
        total = total + reading

Each iteration changes state.

The loop needs:

- current position;
- current reading;
- accumulated total;
- rule for advancing;
- rule for stopping.

That is already a small state machine.

## Counted loops solve known repetition

If you know the collection:

    for item in items

the iteration structure is bounded by available elements.

If you know a count:

    repeat 10 times

the stopping condition is explicit.

These loops are comparatively easy to reason about.

The number of iterations is connected to input size.

That relationship will matter in algorithm analysis.

## Condition-controlled loops need progress

Consider:

    while queue_not_empty:
        process_one_item()

What guarantees the queue eventually becomes empty?

Perhaps no new work arrives.

Perhaps producers keep adding items forever.

Perhaps processing fails and requeues the same item.

A while loop is safe only when its progress and termination assumptions are understood.

Infinite loops are not always bugs—servers intentionally run event loops forever—but accidental non-progress is.

## Polling is a loop with a cost

A naive program:

    while not button_pressed:
        pass

burns CPU repeatedly checking state.

Another design blocks until an event arrives.

Or sleeps between checks.

Or uses an interrupt.

The loop syntax is not the architecture.

The frequency and waiting mechanism determine resource cost and response latency.

This is why systems programming asks:

How often must we check?

What wakes us?

What happens while we wait?

## Loops magnify small costs

One database query taking 2 ms seems harmless.

Place it inside a loop running one million times:

    2 ms × 1,000,000

The architecture changes.

Repeated work magnifies latency, allocations, logging, network calls, and lock contention.

Performance analysis often begins by locating loops because loops multiply cost.

## Nested loops multiply dimensions

A loop over N users.

Inside it, a loop over M records.

Work may scale roughly with N×M depending on behaviour.

This is where asymptotic analysis becomes useful.

Big O is not mathematical decoration.

It helps ask how work grows when input grows.

We will develop that in Module 5.

## Event loops are different but related

GUI frameworks and network servers often use event loops.

Conceptually:

    wait for event
    take event
    dispatch handler
    repeat

The loop may run for the lifetime of the application.

The important question is not how it terminates but how it avoids blocking unrelated work for too long.

JavaScript runtimes make event-loop behaviour visible to web developers.

Network servers face similar scheduling questions.

## Retry loops need limits and backoff

A failed network request:

    retry immediately forever

can turn one outage into a retry storm.

Good retry loops consider:

- maximum attempts;
- timeout;
- backoff;
- jitter;
- idempotency;
- error classification.

The loop exists to recover.

Without constraints, it can become the failure.

## Exercise: audit one loop

Choose:

    while True:
        work()

Ask:

What event causes work to begin?

What changes during one iteration?

Can one iteration block?

What is the maximum time?

How does the loop stop?

What happens after an error?

How quickly does it repeat after failure?

You have turned two lines of syntax into a system design.

## The lesson to carry forward

Loops exist because repetition is fundamental to computation.

But repetition creates resource growth and termination questions.

For every loop, understand:

- iteration unit;
- changing state;
- stopping rule;
- progress guarantee;
- cost per iteration;
- error behaviour.

Once you can answer those, learning for and while syntax in another language is trivial.
