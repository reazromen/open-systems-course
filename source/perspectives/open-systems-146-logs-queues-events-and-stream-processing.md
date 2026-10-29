---
title: "Logs, Queues, Events, and Stream Processing"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-146-logs-queues-events-and-stream-processing.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 13
excerpt: "Queues distribute work while durable logs preserve ordered event streams for multiple consumers. Consumer offsets, partitions, retention, replay, and schema evolution determine how asynchronous systems behave."
eyebrow: "Open Systems Course · Lesson 146 of 180"
---

A queue answers:

who should process this work?

A durable event log answers a different question:

what happened, in what order, and where has each consumer reached?

Products such as Kafka popularized append-only partitioned logs as shared infrastructure.

## A log preserves sequence

Events are appended.

Each partition has an order.

Consumers track an offset and read forward.

Different consumers can independently process the same event stream.

This makes one publication reusable for:

analytics;
search indexing;
billing;
monitoring;
materialized views.

## Partitioning scopes order

A single global partition gives one total order but limits parallelism.

Many partitions increase throughput.

Ordering then exists within each partition, not necessarily across the whole topic.

Choosing the partition key is therefore choosing the ordering domain.

All events for one account can share a key if account-local order matters.

## Consumer groups divide work

Several consumer instances can cooperate as one logical group.

Partitions are assigned among them.

When membership changes, partitions can be reassigned.

Rebalancing affects latency and can cause duplicate processing if work was completed but offsets were not committed.

Again, business idempotency matters.

## Offsets represent processing position

An offset can be committed before or after business effects.

Commit before processing risks message loss on crash.

Commit after processing risks duplicate work after crash.

Many systems choose at-least-once processing and make effects idempotent.

Exactly-once stream-processing features exist in some systems, but external side effects still require careful transaction boundaries.

## Replay is a major architectural feature

Because the log retains history, a new consumer can start from an earlier offset and rebuild derived state.

This is powerful for:

bug fixes;
new projections;
analytics;
recovery.

It also means schema evolution must support old events.

Events are historical contracts.

## Events should describe facts

An event such as:

OrderPaid

describes something that happened.

A command such as:

ChargeOrder

asks something to happen.

Mixing commands and events creates ambiguous ownership.

Events should generally be immutable facts after publication.

Corrections become new events.

## Event time and processing time differ

A device event can occur at 10:00 and reach stream processing at 10:10.

Windowed analytics need a policy for late events.

Watermarks and allowed lateness are stream-processing techniques for reasoning about incomplete event-time windows.

Distributed data rarely arrives perfectly ordered.

## Practical experiment

Use a local Kafka-compatible or simple append-log setup.

Produce keyed events for two devices.

Use multiple partitions.

Observe that per-key order can be preserved while global interleaving varies.

Stop a consumer after processing an event but before committing its offset, then restart and observe redelivery.

## The lesson to carry forward

Durable logs decouple event history from consumers and make replay possible.

The next lesson returns to synchronous traffic and asks how clients find services and how load is distributed among instances.

## Interactive companion exercise

Explore how queued events wait for worker capacity in the [queue-and-worker simulator](../prototypes/interactive-system-design.html#queue-title). It is a simplified flow model rather than a stream-processing benchmark.
