---
title: "Timeouts, Retries, Backoff, and Idempotency"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-145-timeouts-retries-backoff-and-idempotency.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 13
excerpt: "Retries convert transient failures into success only when deadlines, backoff, jitter, and idempotency are designed together. Otherwise they amplify overload and duplicate side effects."
eyebrow: "Open Systems Course · Lesson 145 of 180"
---

A request fails.

Retry it.

That advice can fix a transient network error.

It can also charge a customer twice or collapse an overloaded service.

Retries are a distributed state machine.

## A timeout is an ambiguity boundary

After a timeout, the caller does not know whether the remote operation happened.

That is why a write retry requires idempotency.

If POST /payments creates a new charge on every delivery, blind retry is unsafe.

If the request carries an idempotency key and the server stores the completed result, duplicate delivery can map to the same logical operation.

## Retry only errors that can plausibly recover

Useful retry candidates include:

connection reset;
temporary unavailable;
rate limit with retry guidance;
leader change;
some timeout conditions.

Do not automatically retry:

validation failure;
permission denied;
permanent not found;
business conflict requiring user action.

Retry policy should classify outcomes.

## Exponential backoff reduces pressure

If every client retries immediately, a failing service receives more traffic exactly when it has least capacity.

Exponential backoff increases delay after repeated failures.

Jitter randomizes that delay so a large client population does not synchronize.

Backoff is not only politeness.

It is stability control.

## Retry budgets limit amplification

Suppose one frontend request fans out to five services.

Each retries three times.

Those services call databases that also retry.

One user request can explode into dozens of attempts.

A retry budget caps how much extra load failures are allowed to create.

Retries should usually happen at the layer with enough semantic knowledge to do them safely.

## Hedged requests spend capacity for latency

For idempotent reads, a client can send a duplicate request to another replica when the first is unusually slow and use whichever completes first.

This can reduce tail latency.

It intentionally increases load.

Use it carefully and only for safe operations.

## Circuit breakers stop repeated doomed work

If a dependency is clearly failing, callers can temporarily stop sending normal requests and fail fast.

After a cool-down, limited probe traffic checks recovery.

A circuit breaker reduces wasted work.

It also creates state that must be tuned and observed.

A badly configured breaker can hide recovery or cause synchronized reopen storms.

## Deadlines should be end-to-end

The user request has a total time budget.

Each downstream call should inherit a shorter deadline.

Do not stack independent 30-second timeouts inside a 2-second request.

The system should stop work once the result is no longer useful.

## Idempotency keys need durable semantics

An idempotency record can contain:

key;
request fingerprint;
operation status;
final response;
expiry.

If the same key is reused with different parameters, the server should reject or define behavior explicitly.

If deduplication state expires too early, a very late retry can create a duplicate.

The idempotency window is part of the contract.

## Practical experiment

Build a local service whose handler increments a durable counter and deliberately delays the response after commit.

Call it with a timeout shorter than the delay.

Retry.

Observe the duplicate increment.

Then add an idempotency key table and repeat.

The exact network failure is the same.

The business outcome changes because the application contract changed.

## The lesson to carry forward

Retries are safe only when failure ambiguity, deadlines, and operation identity are designed together.

The next lesson examines asynchronous systems built around logs, queues, and event streams.
