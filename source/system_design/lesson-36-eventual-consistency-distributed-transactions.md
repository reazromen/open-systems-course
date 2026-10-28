# Lesson 36 — Eventual Consistency and Distributed Transactions

**Course:** System Design — From the Ground Up  
**Module 6 — Distributed Systems**

## Learning Objectives
- Explain eventual consistency and identify when temporary stale reads are acceptable.
- Describe why a database transaction usually cannot atomically cover several independent services.
- Apply sagas, idempotency, transactional outbox, and reconciliation to a multi-step workflow.

## Core Concept
Eventual consistency allows replicas or services to disagree temporarily, with the expectation that they converge when updates stop and communication and processing recover. It is useful only when the application can tolerate that temporary divergence. A distributed workflow coordinates business steps across systems that may fail independently; it needs explicit state and recovery rules rather than an assumption that one global transaction will undo everything.

## Eventual Consistency
A profile update may appear immediately on one replica and a few seconds later on another. That delay can be acceptable for an activity feed or a non-critical profile view. It may not be acceptable for a bank balance, an inventory reservation, or an authorization decision. The system must define which reads may be stale, how users see pending changes, and how conflicts are resolved.

## Worked Example
An online order must reserve inventory, charge a payment provider, and arrange shipment. The order service commits its own database row, then calls the inventory service. Inventory reserves a unit, but the payment provider times out. The timeout does not prove that payment failed: the provider may have processed the request while its response was lost. Retrying blindly could charge the customer twice. The order therefore needs a pending-payment state, a stable idempotency key, and a way to query or reconcile the provider's final result.

## Sagas and Compensating Actions
A saga breaks a long workflow into local transactions. If a later step fails, the workflow runs a compensating business action—for example, releasing reserved inventory after a confirmed payment failure. Compensation is not a database rollback: the original action already happened, and compensation can fail or require human review. Record each step and its outcome so retries can resume safely.

## Outbox, Idempotency, and Reconciliation
- **Transactional outbox:** write the business change and an event record in the same local database transaction; a separate publisher sends the event.
- **Idempotent consumer:** make repeated delivery of the same event safe, commonly by recording a stable event or operation identifier.
- **Reconciliation:** periodically compare related records across systems and repair or escalate incomplete workflows.

Queues often provide at-least-once delivery, so duplicate messages must be expected. An outbox reduces the risk that a database update succeeds while its event is lost, but it does not by itself make every downstream side effect exactly once.

## Common Pitfall
Do not treat a timeout as proof of failure, and do not treat compensation as a magical rollback. The remote service may have completed an operation even when the caller never received the response. Use idempotency keys, explicit states, bounded retries, and reconciliation.

## Knowledge Check
1. Inventory is reserved, then the payment request times out. What should the order service do before charging again?
   - **Answer:** Reuse the same idempotency key and query or reconcile the payment provider's result; keep the order in a pending state until the outcome is known.
2. Why use a transactional outbox?
   - **Answer:** It atomically records the local business change and the event to publish, reducing the chance that one commits without the other. Delivery and consumers still need retries and idempotency.

## Practice Hint
Draw the order workflow as states: created, inventory-reserved, payment-pending, paid, cancelled, and compensation-pending. Add the timeout path and decide which steps are safe to retry.

## Self-Check
Can you distinguish eventual consistency from incorrect data, explain why a saga is not a global rollback, and describe how duplicate events are handled?

## Next Lesson
Batch 4 — Microservices (Lessons 37–41)
