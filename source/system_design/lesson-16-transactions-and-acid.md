# Lesson 16 — Transactions and ACID

**Course:** System Design — From the Ground Up  
**Module 3 — Database Fundamentals**

## Lesson Overview

A transaction groups related database operations so the system does not leave partial, contradictory results when something fails. ACID describes four important transaction properties.

## Atomicity

Atomicity means a transaction's operations are treated as a unit: they commit together or are rolled back together. If a transfer debits one account and credits another, the system must not permanently apply only one side.

## Consistency

Consistency means a transaction preserves the database's defined invariants and constraints. The application and database must both be designed correctly; ACID does not invent business rules that were never specified. Constraints, validation, and transaction logic work together.

## Isolation and Durability

Isolation describes how concurrent transactions interact; the exact guarantees depend on the isolation level and database. Durability means committed changes survive the failures covered by the database's durability design. Replication, storage configuration, and recovery mechanisms influence practical durability.

## Transactions Have Boundaries

Keep transactions focused and avoid holding locks while waiting for a slow external API. A database transaction usually cannot atomically include a third-party payment provider. Distributed workflows need patterns such as idempotency, an outbox, sagas, and reconciliation to manage partial failures.

## Key Takeaways

ACID means atomicity, consistency, isolation, and durability. Understand isolation levels and keep transactions short; external systems require additional failure-handling patterns.

## Practice Exercise

A money transfer must debit one account and credit another. Explain how a transaction helps, and why calling a payment API inside a long-held database transaction can be risky.

## Next Lesson

Lesson 17 — SQL vs. NoSQL: How to Choose
