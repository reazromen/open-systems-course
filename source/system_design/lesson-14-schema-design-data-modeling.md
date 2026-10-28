# Lesson 14 — Schema Design and Data Modeling

**Course:** System Design — From the Ground Up  
**Module 3 — Database Fundamentals**

## Lesson Overview

Data modeling translates real-world concepts into records, fields, identifiers, and relationships. A good model supports the application's important queries while protecting data integrity.

## Identify Entities and Relationships

Start with the nouns and business concepts: customers, products, orders, payments, and shipments. Determine how they relate. A customer may have many orders; an order may contain many products. A join table such as order_items can represent the many-to-many relationship between orders and products.

## Keys and Constraints

A primary key gives each row a stable identity. Foreign keys connect related records. Unique constraints prevent duplicate values where uniqueness matters, and check constraints can enforce valid ranges or states. These database rules help preserve correctness even if multiple application instances write concurrently.

## Normalization and Duplication

Normalization separates facts into appropriate tables to reduce unintended duplication and update anomalies. If a customer's address is copied into many unrelated rows, changing it can leave inconsistent copies. Some systems intentionally duplicate data for performance, but that denormalization should be deliberate and have a clear update strategy.

## Model for Queries and Change

Understand common reads and writes before finalizing a schema. Define what happens when records are deleted, how historical changes are retained, and how migrations will be rolled out. A schema is a long-lived contract between the application and its data; changes require compatibility and recovery planning.

## Key Takeaways

Model entities, relationships, keys, and constraints first. Normalize to protect integrity; denormalize only for a measured reason and with an update plan.

## Practice Exercise

Model customers, orders, and order items for an online store. Name the primary keys, foreign keys, and one constraint that prevents invalid data.

## Next Lesson

Lesson 15 — Database Indexes
