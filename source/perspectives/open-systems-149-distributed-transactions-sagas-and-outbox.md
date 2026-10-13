---
title: "Distributed Transactions, Sagas, and the Outbox Pattern"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-149-distributed-transactions-sagas-and-outbox.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 14
excerpt: "When one business operation spans multiple independent systems, a local database transaction is not enough. Two-phase commit, sagas, idempotency, and transactional outbox patterns define different ways to preserve intent under failure."
eyebrow: "Open Systems Course · Lesson 149 of 180"
---

An order service commits an order.

Then it publishes an event.

The process crashes between those two steps.

Now the order exists but no event was published.

This is the dual-write problem.

## One local transaction cannot cover independent systems

A database transaction can atomically update tables in one transactional domain.

It cannot automatically roll back:

an email;
a payment provider;
a separate message broker;
another autonomous database.

Distributed state needs a different coordination model.

## Two-phase commit coordinates a prepare/commit decision

In two-phase commit, participants first prepare to commit.

If all required participants prepare successfully, a coordinator tells them to commit.

This can provide atomic outcomes across participants that implement the protocol.

It also introduces coordinator state, blocking scenarios, operational coupling, and latency.

2PC is useful in some systems, not a universal answer.

## Sagas model a sequence of local transactions

A saga breaks one workflow into steps:

reserve inventory;
charge payment;
create shipment.

Each step commits locally.

If a later step fails, compensating actions attempt to undo business effects:

release inventory;
refund payment;
cancel shipment.

Compensation is not database rollback.

It is a new business operation.

A refund may itself fail and require retry.

## Orchestration and choreography differ

Orchestrated saga:

a coordinator tells each step what to do next.

Choreographed saga:

services react to events from previous steps.

Orchestration centralizes workflow state.

Choreography reduces central control but can make global behavior harder to understand.

Both need durable progress state and idempotency.

## Transactional outbox fixes the database-plus-message gap

The application writes:

business row;
outbox event row

inside one database transaction.

A separate publisher reads committed outbox rows and sends them to the broker.

If publishing fails, it retries.

Because the event intent is durably recorded with the business change, a crash cannot create committed data with no publication record.

Consumers must still tolerate duplicate publication.

## Inbox/deduplication protects consumers

A consumer can store processed message IDs in the same transaction as its business change.

On redelivery, it sees the ID already processed and avoids repeating the effect.

This creates an inbox pattern.

Exactly-once business processing is achieved through state and idempotency, not by hoping the network never duplicates a message.

## Workflow state should be inspectable

A saga instance can expose:

current step;
completed steps;
retry count;
next attempt;
compensation state;
terminal failure reason.

If support staff cannot tell whether payment succeeded but shipment failed, the distributed workflow is operationally opaque.

## Practical experiment

Build a local order service with SQLite and a mock message publisher.

First:

insert order;
commit;
then publish event.

Kill the process after commit but before publish.

Observe the missing event.

Then implement an outbox table in the same transaction and a retrying publisher.

Repeat the failure.

The system now has durable evidence that publication is pending.

## The lesson to carry forward

Distributed transactions are about preserving business intent when no single atomic boundary covers every system.

The final lesson of this module follows one request across services, replicas, retries, queues, and storage.
