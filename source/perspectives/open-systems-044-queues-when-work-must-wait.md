---
title: "Queues: When Work Must Wait"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-044-queues-when-work-must-wait.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 11
excerpt: "Queues appear when work arrives faster or at different times than it can be processed. They decouple producers from consumers—but they do not create capacity."
eyebrow: "Open Systems Course · Lesson 44 of 180"
---

A sensor emits 1,000 events each second.

Your processor can handle 700.

Where do the other 300 go?

This problem creates a queue.

A queue holds work that has arrived but has not yet been processed.

## FIFO is the simplest policy

First in, first out:

    A arrives
    B arrives
    C arrives

Processing order:

    A
    B
    C

This is fair for many workloads.

Not all queues are FIFO.

Priority queues, deadline queues, weighted queues, and topic partitions use different policies.

"Queue" describes waiting plus ordering, not one universal algorithm.

## Queues decouple timing

A producer can create work now.

A consumer can process it later.

This helps when:

- arrival is bursty;
- processing is slower;
- consumer restarts;
- work can be asynchronous.

Example:

Web request submits image processing.

Instead of keeping the user connection open for two minutes:

    web -> queue -> worker

The web service acknowledges accepted work.

The worker processes later.

The architecture changed user-facing latency and failure behaviour.

## A queue does not create throughput

If arrival rate is continuously:

    1000 jobs/s

and processing capacity is:

    700 jobs/s

the queue grows:

    +300 jobs/s

Buffering postpones failure.

It does not solve insufficient capacity.

Eventually you need:

- more consumers;
- faster processing;
- lower input;
- backpressure;
- dropping or load shedding.

This is one of the most important queue lessons.

## Queue length is latency waiting to happen

A job at position 10,000 must wait for earlier work depending on concurrency and policy.

As backlog grows, waiting time grows.

Operational systems therefore monitor:

- queue depth;
- age of oldest item;
- processing rate;
- failure rate;
- retry count.

A queue being "up" tells little about whether work is timely.

## Delivery and processing are separate states

A broker may deliver a message.

Consumer crashes before finishing.

Should message be delivered again?

Systems use acknowledgement models to decide when work is considered complete.

This creates semantics such as:

- at-most-once;
- at-least-once;
- effectively-once under stronger application rules.

Exactly-once claims need careful boundary definitions.

A duplicate-resistant consumer often matters more than marketing language.

## Retries create duplicate work

Job fails.

Queue retries.

Did failure occur before side effect or after?

If worker charged payment and crashed before acknowledgement, a retry can charge again.

Queue consumers therefore need idempotency where side effects matter.

Messaging cannot remove application semantics.

## Dead-letter paths preserve failures

Some work repeatedly fails.

Retry forever?

That can poison throughput.

A dead-letter queue or failure store can isolate items needing investigation.

But moving a message to dead-letter storage is not resolution.

It is a state transition:

automatic processing gave up.

Operations still needs visibility and policy.

## Backpressure is a conversation

If consumers are overloaded, producers need some signal:

Slow down.

Reject.

Buffer locally.

Drop optional work.

Without backpressure, queues can move overload deeper until memory, disk, or latency collapses.

This pattern appears in network protocols, streaming systems, audio pipelines, and embedded buffers.

## Exercise: calculate backlog

Arrival:

    100 jobs/s

Consumer capacity:

    80 jobs/s

After 60 seconds, ignoring bursts and retries:

    backlog growth = 20 × 60 = 1200 jobs

If average service capacity remains below arrival, the system is unstable.

No queue setting fixes that arithmetic.

## The lesson to carry forward

Queues exist because work and processing happen at different times.

They provide decoupling, buffering, ordering, and recovery opportunities.

They also create backlog, duplicate-delivery, retry, persistence, and monitoring problems.

A queue is not storage you can ignore.

It is delayed work with semantics.
