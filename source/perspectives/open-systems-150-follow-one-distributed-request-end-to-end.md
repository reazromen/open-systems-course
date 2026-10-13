---
title: "Follow One Distributed Request End to End"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-150-follow-one-distributed-request-end-to-end.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 16
excerpt: "One user request can cross load balancers, service discovery, several services, caches, replicated databases, queues, retries, and background workflows. End-to-end tracing reveals where time and uncertainty accumulate."
eyebrow: "Open Systems Course · Lesson 150 of 180"
---

Constructed example:

A user places an order.

The request reaches an API gateway, order service, inventory service, payment service, database, event log, and notification worker.

No real provider is being described.

## 1. The request enters through an edge

DNS resolves the public service.

TLS authenticates the edge.

HTTP request receives a request/trace identifier.

The edge chooses a healthy application instance.

This is the first load-balancing decision, not necessarily the last.

## 2. Order service establishes a deadline

The frontend gives the request a total deadline.

Order service reserves part of that budget for:

inventory;
payment;
database;
response serialization.

Downstream calls inherit shorter deadlines.

No component gets to work forever.

## 3. Service discovery chooses inventory endpoint

Order service resolves logical service inventory.

A client-side or proxy load balancer chooses one instance.

The selected instance can fail after selection.

Discovery state being correct does not guarantee request success.

## 4. Inventory uses authoritative storage

Inventory service begins a local transaction.

It checks current stock and writes a reservation.

Isolation prevents two concurrent orders from overselling under the chosen model.

The transaction commits.

Now the reservation is authoritative in that service.

## 5. Response is lost

Inventory sends success.

A network fault drops the response.

Order service times out.

From its perspective the reservation is uncertain.

This is where idempotency matters.

Order service retries with reservation_id.

Inventory recognizes the existing completed operation and returns the same logical result.

No second reservation is created.

## 6. Payment is a separate distributed boundary

Payment service receives a unique payment operation ID.

It calls an external provider.

The provider can time out after charging.

Payment service stores operation state so retry does not create a second charge.

The same timeout ambiguity appears at every network boundary.

## 7. Order database commits with outbox

Order service writes:

order status = paid;
outbox event = OrderPlaced.

Both commit in one local transaction.

HTTP response can now say the order was accepted according to application policy.

The notification email has not necessarily been sent.

## 8. Replication lags

The primary database contains the order.

A read replica is 200 ms behind.

If the browser immediately GETs the order from that replica, it may see not found.

The product needs read-your-writes handling.

That can be leader read, version wait, or session routing.

## 9. Outbox publisher emits event

Background publisher reads the outbox row and sends OrderPlaced to the event log.

It crashes after publish but before marking the row sent.

After restart, it publishes again.

Consumers must deduplicate by event ID.

At-least-once delivery is functioning as designed.

## 10. Consumers build derived state

Notification service sends email.

Analytics updates metrics.

Search indexer creates a searchable document.

These are derived effects.

The order can be correct even if search indexing is delayed.

Operational dashboards should distinguish core transaction health from asynchronous lag.

## 11. Trace context connects synchronous spans

Distributed tracing can connect:

edge;
order service;
inventory call;
payment call;
database query.

Asynchronous events need trace linkage or correlation metadata to continue the story beyond the HTTP request.

A trace is a causal map, not just a waterfall chart.

## 12. Metrics reveal population behavior

One trace explains one slow request.

Metrics answer:

how often does this happen?

Track:

error rate;
latency distributions;
retry counts;
queue lag;
replica lag;
saturation.

Observability needs both individual evidence and population statistics.

## Failure drill

In a local test:

delay inventory after commit;
kill outbox publisher after send;
lag a replica;
make payment dependency slow;
remove one service instance;
partition one consensus minority.

For each failure, identify:

what committed;
what is uncertain;
what can retry;
what can duplicate;
what can be stale.

## What Module 15 added

Distributed Systems and Cloud Architecture introduced:

partial failure;
replication;
consistency;
consensus;
retries;
event logs;
service discovery;
sharding;
sagas/outbox;
end-to-end distributed request reasoning.

## The module to carry forward

Module 16 turns these architectures into diagnosable systems through logs, metrics, traces, packet captures, profiling, SLOs, incidents, and recovery.
