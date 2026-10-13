---
title: "Queues: Decoupling Work Across Time"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-108-queues-decoupling-work-across-time.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "A queue lets producers hand work to consumers asynchronously. That decouples timing and load, but introduces acknowledgement, redelivery, ordering, retention, and duplicate-processing semantics."
eyebrow: "Open Systems Course · Lesson 108 of 180"
---

A user submits an operation.

Instead of completing all work inside the HTTP request, the application creates a message and returns.

A worker processes the message later.

That is a major architectural change.

The producer and consumer are now decoupled across time.

## A queue changes the request boundary

Without a queue:

request → application → slow work → response

With a queue:

request → application → enqueue → response

and later:

queue → worker → slow work

The user-facing request can become faster and more resilient to temporary worker load.

But HTTP success now means the work was accepted, not necessarily completed.

Those are different application states.

## Messages need acknowledgement semantics

A broker must know when a message is safe to remove or mark complete.

One common pattern is explicit consumer acknowledgement.

RabbitMQ, for example, distinguishes delivery from consumer acknowledgement. If a connection closes before acknowledgement, a message can be redelivered depending on queue and consumer behavior.

This produces an essential rule:

processing code must be prepared for redelivery.

## At-least-once delivery creates duplicates

Suppose a worker:

1. charges a card;
2. crashes before acknowledging the message.

The broker redelivers it.

If the worker charges again, the customer is charged twice.

The broker did not fail. It kept its delivery promise.

The consumer failed to make the operation idempotent.

This is why exactly-once business effects are harder than exactly-once message transport claims.

## Idempotency belongs at the effect boundary

A consumer can store a unique operation identifier.

Before applying an effect, it checks whether that operation was already completed.

Or the downstream API can accept an idempotency key.

The general model is:

message may arrive again → business effect must recognize duplicate → same logical result

That often requires durable deduplication state.

Memory-only duplicate tracking disappears on restart.

## Ordering is usually scoped

Teams often say messages must stay in order.

Order relative to what?

One global ordering can severely limit parallelism.

Many systems instead provide ordering inside a partition, queue, or key.

That can be enough if all events for one account or device share the same ordering key.

Architecture should define the required scope explicitly.

## Backpressure appears when producers outrun consumers

If producers enqueue 10,000 jobs per second and workers process 5,000, the queue grows.

That buffer buys time.

It does not solve the capacity mismatch.

Eventually you face:

- increased latency;
- storage growth;
- retention limits;
- expired messages;
- producer throttling;
- consumer scaling.

Queue depth is therefore a measure of delayed work, not merely infrastructure health.

## Retries can amplify failure

A dependency becomes slow.

Workers fail and retry immediately.

More retries create more load.

The dependency gets slower.

This positive feedback loop is a retry storm.

Useful controls include exponential backoff, jitter, retry limits, dead-letter handling, and circuit-breaking behavior where appropriate.

A retry policy is part of the workload architecture.

## Dead-letter queues preserve failed work

After repeated failure, a message can be moved to a dead-letter path rather than retried forever.

That preserves evidence and protects the main queue.

But a dead-letter queue is not a trash bin.

Someone needs a policy for inspection, replay, correction, and retention.

Otherwise failed work silently accumulates.

## Queues are storage systems

A durable queue must persist messages under a defined contract.

RabbitMQ distinguishes durable queues, persistent messages, publisher confirms, consumer acknowledgements, and other reliability mechanisms.

No one flag means every failure case is solved.

Producer acknowledgement, broker persistence, replication, and consumer acknowledgement are different stages.

## Practical experiment

Run a local queue or write a tiny file-backed job queue for a test.

Create one producer and one worker.

Make the worker deliberately crash after performing an action but before acknowledgement.

Restart it and observe whether the message appears again.

Then add an idempotency key to the business operation and repeat.

The lesson is to distinguish message delivery from business effect.

## The lesson to carry forward

Queues decouple producers and consumers across time and load.

They also introduce delivery semantics, acknowledgements, duplicates, retries, ordering scope, retention, and backpressure.

The next lesson returns to durability directly: write-ahead logs, replication, backups, and recovery.
