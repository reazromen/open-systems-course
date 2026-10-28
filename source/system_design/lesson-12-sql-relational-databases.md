# Lesson 12 — SQL and Relational Databases

**Course:** System Design — From the Ground Up  
**Module 3 — Database Fundamentals**

## Lesson Overview

Relational databases organize information into tables with defined relationships and use SQL to query and modify data. They are a strong choice for many systems that need consistent records and transactions.

## Tables, Rows, and Columns

A table represents a kind of entity, such as customers or orders. Each row is a record and each column describes an attribute. A primary key uniquely identifies a row. A foreign key references a row in another table, allowing the database to enforce relationships—for example, an order can reference the customer who placed it.

## Querying with SQL

SQL is used to define, read, insert, update, and delete relational data. A query can filter records, sort results, join related tables, and aggregate values. Queries should request only the data needed. Selecting every column from every row can waste resources and become expensive as the database grows.

## Constraints and Transactions

Constraints enforce rules such as uniqueness and non-null values close to the data. Transactions group operations so that they succeed or fail as a unit according to the database's transaction guarantees. For a purchase, the system may need to create an order and reserve inventory without leaving inconsistent partial state.

## Design Starts with Access Patterns

Before choosing a database, understand what the application reads and writes, which relationships matter, how concurrent updates should behave, and what consistency is required. Relational databases can scale substantially, but indexes, query plans, connection limits, storage, and replication still require deliberate design.

## Key Takeaways

Relational databases provide tables, relationships, constraints, SQL, and transactions. Model real entities and invariants, then design queries around actual access patterns.

## Practice Exercise

Design two tables for customers and orders. Identify each table's primary key and the foreign key connecting an order to its customer.

## Next Lesson

Lesson 13 — NoSQL Databases and Their Data Models
