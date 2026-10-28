# Lesson 06 — What Is a Database and Why Do We Need One?

**Course:** System Design — From the Ground Up  
**Module 1 — System Design Fundamentals**

## Learning Objectives

By the end of this lesson, you should be able to:
- Explain why applications need durable shared storage.
- Choose between a database and file or object storage for different data.
- Identify database responsibilities beyond storing bytes.

## Lesson Overview

Most useful applications need to preserve information beyond a single request. A database provides structured ways to store, retrieve, update, and protect that information.

## Memory Is Not Enough

An application can hold data in memory while it runs, but that state may disappear when the process restarts. Multiple application instances also have separate memory. A database gives an application a shared, durable place to keep information such as accounts, products, orders, and messages.

## Basic Operations

Applications commonly create, read, update, and delete records—the CRUD operations. A bookstore may create an order, read its status, update its shipping address, and eventually archive or delete data according to policy. Data modeling defines which records exist and how they relate.

## Database Versus File

A file can be suitable for documents, images, exports, or simple configuration. A database is better suited to structured queries, concurrent updates, relationships, constraints, and transactions. Many systems use both: database rows describe an uploaded image while object storage holds the image bytes.

## A Database Is a Component, Not a Magic Box

A database needs a schema or data model, access control, backups, capacity planning, monitoring, and a recovery strategy. It can become a performance bottleneck or a single point of failure if poorly designed. System design asks which data is authoritative, who can change it, how consistency is maintained, and what happens when the database is unavailable.

## Worked example: storing a product image

When a seller uploads a product photo, the image bytes may go into object storage. The database stores metadata such as product ID, object key, content type, upload time, and visibility. The application queries the database to find the image and uses the object key to retrieve its bytes. This separates structured product data from large binary content.

## Check Your Understanding

**1. Why can in-memory application state be insufficient for orders?**

<details>
<summary>Answer and explanation</summary>

It can disappear when a process restarts and is not automatically shared between multiple application instances. Orders usually need durable, controlled storage.

</details>

**2. Should every file be stored as a database row?**

<details>
<summary>Answer and explanation</summary>

Not necessarily. Large files often fit object storage better, while the database stores searchable metadata and relationships.

</details>

## Common Pitfall

A database is not automatically backed up, secure, highly available, or correctly modeled just because it persists data.

## Key Takeaways

Choose storage according to the shape and use of the data. Define ownership, durability, access patterns, and recovery needs—not just where the bytes will live.

## Practice Exercise

For an online bookstore, list five kinds of information that should persist. Which would you keep in a database, and which might belong in file or object storage?

## Next Lesson

Lesson 07 — TCP and UDP
### Practice Hint and Self-Check

**Hint:** Separate structured records (customers, inventory, orders) from large files (book covers, invoices, exports).

**Self-check:** You classify at least five data types and justify storage choices using data shape or access patterns.

