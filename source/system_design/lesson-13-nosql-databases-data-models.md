# Lesson 13 — NoSQL Databases and Their Data Models

**Course:** System Design — From the Ground Up  
**Module 3 — Database Fundamentals**

## Lesson Overview

NoSQL is a broad family of database designs built for different data shapes and access patterns. It is not a single database type, and it is not automatically better or faster than relational storage.

## Key-Value Stores

A key-value store associates a unique key with a value. It can be useful for sessions, feature flags, counters, and cached results when the application usually retrieves data by key. The value may be opaque to the database, which means complex queries across its contents may be limited.

## Document Databases

A document database stores records as documents, often JSON-like objects. Documents can represent entities whose fields vary, such as product catalogs or user preferences. Flexible structure can make iteration easier, but teams still need validation, indexes, and a plan for fields shared across many documents.

## Wide-Column and Graph Models

Wide-column databases organize data around partition and clustering keys and can support large distributed workloads with known query patterns. Graph databases model nodes and relationships, making relationship traversal a central operation. Each model optimizes different questions; choosing one without understanding queries can create unnecessary complexity.

## Choose from Access Patterns

Start by listing the queries and updates the application must support, their expected volume, consistency needs, and data relationships. Then compare data models. NoSQL systems may offer horizontal distribution or flexible schemas, but those benefits depend on the product and design. Relational databases can also scale and remain excellent general-purpose choices.

## Learning Objectives

- Distinguish key-value, document, wide-column, and graph models.
- Choose a data model from access patterns and correctness requirements.

## Worked Example

A product catalog with variable attributes may fit a document model; a banking ledger usually needs relational constraints and transactions. The decision depends on required queries and guarantees, not the label “NoSQL.”

## Check Your Understanding

1. **Does NoSQL automatically scale better than SQL?**

   No. Scaling depends on the database, workload, partitioning, and operations.

2. **What should you list before choosing a model?**

   Queries, updates, relationships, volume, consistency needs, and recovery requirements.

## Common Pitfall

Choosing a database because it is fashionable before writing down the queries it must serve.

## Key Takeaways

NoSQL includes key-value, document, wide-column, and graph models. Choose the model that matches the access patterns and correctness requirements, not a trend.

## Practice Exercise

A product catalog has flexible attributes, while a banking ledger needs strong transactional constraints. Which database models would you evaluate for each, and why?


### Practice Hint

Write two or three representative queries for each workload, then compare how each model stores and retrieves the required data.

### Self-Check

Can you explain which query pattern makes each of the four NoSQL models useful?
## Next Lesson

Lesson 14 — Schema Design and Data Modeling
