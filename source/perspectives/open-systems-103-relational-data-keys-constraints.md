---
title: "Relational Data: Tables, Keys, and Constraints"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-103-relational-data-keys-constraints.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 10
excerpt: "A relational schema does more than describe columns. Keys and constraints make important invariants executable so invalid states can be rejected close to the data."
eyebrow: "Open Systems Course · Lesson 103 of 180"
---

A database schema is often treated as documentation. It is stronger than that.

A relational schema can make parts of the application's truth executable. If every order must reference a real customer, the database can enforce that relationship. If email addresses must be unique, the database can reject conflicts. If a field must always exist, the database can reject NULL.

The schema is therefore part of the system's correctness boundary.

## Tables give data a shared shape

A table defines named columns and rows that follow the table's schema.

That structure gives every consumer a common vocabulary. One application process does not get to interpret a timestamp as a Boolean while another treats it as text without violating the schema.

SQL systems include implementation behavior beyond the pure relational model, but the model remains useful: think in structured sets of rows rather than unrelated files.

## Types remove impossible interpretations

If created_at is a timestamp column, the database can reject a value that cannot be represented as a timestamp.

Types move some validation closer to the data. They do not encode every business rule. A text column can still contain an invalid email address, and an integer can still represent a semantically impossible quantity.

Database types and application validation work together.

## Primary keys define row identity

A primary key gives each row a stable unique identity within a table.

Identity is more than a performance hint. Other tables can reference it. The application can reason about one entity even if descriptive fields change.

Natural keys, generated integers, UUIDs, and other identifiers have different trade-offs. The important property is that identity should not accidentally change when a display name or description changes.

## Foreign keys encode relationships

If orders.customer_id must refer to customers.id, a foreign-key constraint can enforce that relationship.

Now the database can reject an order referring to a nonexistent customer.

That prevents one class of orphaned data. It also forces lifecycle decisions: should customer deletion cascade, be restricted, or leave a nullable reference?

Those are domain semantics made explicit.

## UNIQUE protects global invariants

Suppose no two users can share the same handle.

Checking in application code is not enough under concurrency. Request A can check that the handle is free, request B can check the same thing, and both can attempt insertion.

A unique constraint gives the database authority to serialize that conflict and reject one write.

Application checks can still produce friendly messages. The database remains the final guard.

## NOT NULL encodes whether absence is valid

Nullable columns are not simply optional fields. NULL has special semantics in SQL and participates in three-valued logic.

If every order must have a creation timestamp, marking the column NOT NULL makes that invariant executable.

Many unexplained nullable columns often indicate that the data model has not decided what absence means.

## CHECK constraints encode local rules

A CHECK constraint can enforce rules such as quantity greater than zero or end_at not earlier than start_at.

This does not mean all business logic belongs in SQL. It means that invariants the database can evaluate cheaply and reliably should not depend only on every application caller remembering the same rule.

## Normalization reduces contradictory copies

Duplicated facts create opportunities for disagreement. If the same current address appears in thousands of rows, changing it becomes ambiguous.

Normalization is a family of techniques for representing dependencies more cleanly and reducing unnecessary duplication.

Denormalization can be deliberate for performance, snapshots, or history. It should be a conscious trade-off rather than accidental duplication.

## Joins reconstruct relationships

When orders reference customers by key, queries can combine them with a join.

The database can choose an execution plan based on indexes, statistics, and available operators. The query says what result is wanted more than exactly how to retrieve every page.

This separation between declarative intent and execution strategy is one of the strengths of relational systems.

## Schema changes are production changes

Adding a column may be easy. Changing a type, adding a constraint, or building a large index can be operationally expensive.

Before a migration ask: is it backward compatible, can old and new application versions coexist, can it lock large tables, can it be rolled back, and what happens to replicas?

The database schema is part of the contract between application versions.

## Practical experiment

Create a small SQLite database with customers and orders. Add a primary key, UNIQUE email, NOT NULL fields, a positive-quantity CHECK, and a foreign key.

Then deliberately attempt a duplicate email, a missing customer reference, zero quantity, and a NULL required field.

Enable foreign-key enforcement according to SQLite's documentation before testing.

The exercise shows which invalid states are rejected by the database rather than by application code.

## The lesson to carry forward

Tables organize structured rows. Keys define identity. Foreign keys define relationships. Constraints define invariants.

The next lesson asks how a database finds rows efficiently without scanning everything: indexes and the cost trade-offs they introduce.


Explore these storage guarantees and trade-offs in the [interactive storage and database model](../prototypes/interactive-system-design.html#database-title). The scenarios are deterministic teaching examples, not real I/O measurements.
