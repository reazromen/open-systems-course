# Lesson 17 — SQL vs. NoSQL: How to Choose

**Course:** System Design — From the Ground Up  
**Module 3 — Database Fundamentals**

## Lesson Overview

Choosing a database is a workload decision. Compare the shape of the data, relationships, query patterns, consistency needs, scale, operational skills, and cost instead of assuming one category always wins.

## Relational Strengths

Relational databases are a natural fit for structured records, joins, constraints, and transactions across related rows. They are often a strong default for orders, accounts, inventory, and financial records. They also support varied query patterns, though performance still depends on schema, indexes, and capacity.

## NoSQL Strengths

A NoSQL model may fit access patterns that are key-oriented, document-centric, relationship-heavy, or designed for particular distributed workloads. Some products make partitioning and horizontal distribution central to their design. The benefit comes with product-specific trade-offs in queries, consistency, and operations.

## Compare the Real Workload

Write down read and write rates, record size, data growth, query patterns, transaction boundaries, availability goals, and recovery requirements. Include backup and restore testing, monitoring, migration effort, licensing, and the team's operational experience. A theoretically scalable database is not useful if the team cannot run it reliably.

## Use More Than One Only When Needed

A system can use a relational database for authoritative orders, a cache for hot reads, and object storage for images. Each extra system introduces failure modes, synchronization, security boundaries, and operational cost. Add a second database only when a concrete requirement justifies the added complexity.

## Learning Objectives

- Compare SQL and NoSQL using relationships, query patterns, transactions, and operational needs.
- Explain why one application may use more than one storage model.

## Worked Example

An order and payment ledger often benefits from relational constraints and transactions. A product catalog with varying attributes may use a document store. The architecture should follow each workload's requirements rather than a universal SQL-versus-NoSQL rule.

## Check Your Understanding

1. **Is schema flexibility the same as having no schema?**

   No. Applications still need validation and a plan for field meaning and evolution.

2. **What should influence the choice besides data shape?**

   Queries, consistency, transactions, scale, team expertise, recovery, and operating cost.

## Common Pitfall

Treating SQL and NoSQL as opposing camps instead of tools with different trade-offs.

## Key Takeaways

Select databases based on access patterns and correctness needs. A relational database is often a good starting point; introduce specialized stores when their benefits justify their operational cost.

## Practice Exercise

Choose storage for (1) orders and payments, (2) frequently accessed temporary sessions, and (3) uploaded photos. Explain why one database need not store all three.


### Practice Hint

Create a short requirements table and compare candidate databases against each requirement rather than comparing brand names.

### Self-Check

Can you defend a database choice by linking each reason to a concrete requirement?
## Next Lesson

Lesson 18 — Monoliths and Application Architecture
