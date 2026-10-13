---
title: "Errors, Exceptions, and Failure Paths"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-037-errors-exceptions-failure-paths.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 11
excerpt: "Failure is part of the program contract. Return codes, exceptions, timeouts, retries, and partial success are different mechanisms for representing what did not happen as expected."
eyebrow: "Open Systems Course · Lesson 37 of 180"
---

The network is unavailable.

A file does not exist.

A user enters invalid data.

Memory allocation fails.

A remote API returns an error.

A program that models only the success path is incomplete.

Failures are states the design must represent.

## Not every failure is exceptional

A user entering the wrong password is normal application behaviour.

A requested file being absent may be expected.

A network timeout can occur in any distributed system.

A programmer invariant becoming impossible may indicate a bug.

Different failure categories deserve different handling.

Calling everything an exception does not make the system clearer.

## Return values are one representation

A function can return:

    success / failure

or:

    value / error

This makes failure explicit in the ordinary control flow.

But callers can ignore return codes.

Languages and libraries differ in how strongly they encourage checking.

The mechanism is less important than the contract:

Can the operation fail, and how must the caller know?

## Exceptions separate normal return from failure transfer

Exception mechanisms let a function signal a condition that transfers control to a handler.

This can remove repetitive manual checks.

It can also hide control flow if overused.

A good exception boundary answers:

- what can be thrown;
- where it is caught;
- what cleanup is required;
- whether operation can retry;
- whether state is still valid.

An exception is not a substitute for failure design.

## Partial success is harder

Suppose:

1. charge payment;
2. create booking;
3. send confirmation.

Payment succeeds.

Booking fails.

What does the function return?

The system cannot simply pretend "operation failed" and forget the successful charge.

Distributed and multi-step operations create partial state.

Recovery may require:

- compensation;
- retry;
- reconciliation;
- manual intervention.

This is why real systems need state machines around workflows.

## Timeouts represent uncertainty

You send a request.

No response arrives before 5 seconds.

Did the server fail?

Maybe.

Did the request reach it and complete, while the response was lost?

Also possible.

A timeout tells you:

**I do not know the result within the allowed time.**

That uncertainty is different from a definitive rejection.

Retry logic must account for it.

## Retrying can duplicate effects

Suppose:

    transfer $100

times out.

Client retries.

If the first operation succeeded, the second may transfer another $100.

Safe retry therefore depends on operation semantics and mechanisms such as idempotency keys.

An error handler can create a new failure if it assumes too much.

## Cleanup must survive failure

Open file.

Acquire lock.

Allocate resource.

Then an error occurs.

Who releases them?

Languages provide mechanisms such as finally blocks, context managers, destructors, defer statements, or RAII patterns.

The syntax varies.

The invariant is universal:

Resources need defined ownership and cleanup on both success and failure paths.

## Logs are not error handling

Writing:

    ERROR: database failed

does not recover the operation.

Logging creates evidence.

Handling determines system behaviour.

Sometimes the correct handling is to fail fast after logging.

Sometimes retry.

Sometimes degrade.

Sometimes queue work.

Separate observability from recovery policy.

## Exercise: write the failure table

For:

    fetch_weather()

list:

- DNS failure;
- connection timeout;
- HTTP 500;
- HTTP 404;
- malformed response;
- stale response;
- success.

For each decide:

Retry?

Return error?

Use cached data?

Alert?

Do nothing?

Now you are designing failure semantics instead of adding try/catch after the fact.

## The lesson to carry forward

Failures are first-class system states.

Errors, exceptions, timeouts, retries, and partial completion are representations of different failure situations.

For every important operation, ask:

What can fail?

What state may already have changed?

What does the caller learn?

Can it retry safely?

Who cleans up?

Robust software is not code that never fails.

It is software whose failure paths are designed.
