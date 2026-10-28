# Lesson 36 — Eventual Consistency and Distributed Transactions

**Course:** System Design — From the Ground Up  
**Module 6 — Distributed Systems**

## Lesson Overview

Distributed systems often update multiple components that cannot participate in one local database transaction. Eventual consistency and workflow patterns help systems make progress while acknowledging that different components may temporarily disagree.

## Eventual Consistency

Eventual consistency means replicas may temporarily show different values but converge if updates stop and the system continues making progress. It can suit activity feeds, counters, and some profile views. It is not the same as immediate correctness: the application must decide which stale views are acceptable.

## A Distributed Workflow

Consider an order that reserves inventory, charges a payment provider, and schedules shipment. These actions may live in separate systems with independent failure modes. A local ACID transaction cannot normally roll them all back atomically. The workflow needs explicit progress states, timeouts, and recovery behavior.

## Sagas and Compensating Actions

A saga breaks a long workflow into local transactions. If a later step fails, the system may run compensating actions, such as releasing a reservation or issuing a refund. Compensation is a new business operation, not a magical rollback; it can fail too and therefore needs retries, tracking, and reconciliation.

## Outbox, Idempotency, and Reconciliation

The transactional outbox pattern records a business change and an event in the same local database transaction; a separate publisher sends the event reliably. Consumers should be idempotent so duplicate delivery does not duplicate effects. Reconciliation jobs compare records across systems and resolve incomplete or contradictory workflows.

## Key Takeaways

Eventual consistency permits temporary divergence. For multi-service workflows, use explicit states, idempotency, outbox or saga patterns, retries, and reconciliation rather than assuming a global transaction exists.

## Practice Exercise

An order is created and inventory is reserved, but the payment provider times out. Design the order states and recovery steps so the customer is not charged twice and reserved stock is not held forever.

## Next Lesson

Batch 4 — Microservices (Lessons 37–41)
