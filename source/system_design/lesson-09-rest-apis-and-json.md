# Lesson 09 — REST APIs and JSON

**Course:** System Design — From the Ground Up  
**Module 2 — Networking and Communication**

## Learning Objectives

By the end of this lesson, you should be able to:
- Model API endpoints around resources and consistent operations.
- Read and sketch simple JSON objects and arrays.
- Explain pagination, validation, authorization, and compatibility concerns.

## Lesson Overview

A well-designed API gives clients a stable, understandable way to access resources and perform operations. REST conventions and JSON are common tools for building web APIs.

## Think in Resources

REST-style APIs commonly represent things as resources identified by URLs. Examples include /books, /books/42, and /orders/9001. HTTP methods express operations on those resources. Not every API is fully RESTful, but resource-oriented naming can make an interface easier to learn and maintain.

## JSON Data

JSON represents objects, arrays, strings, numbers, booleans, and null. A response might contain a book identifier, title, and price. Field names, types, optionality, and error shapes should be documented. JSON syntax alone does not guarantee valid data: the server must validate values, required fields, lengths, and business constraints.

## Design for Clients

Use consistent naming, pagination for large collections, filtering where useful, and explicit error formats. Avoid returning an unbounded list when a table may eventually contain millions of records. Keep response fields stable and add compatible fields carefully; removing or changing a field can break deployed clients.

## Versioning and Security

An API contract evolves over time. Teams may use versioned paths, headers, or backward-compatible changes, but they need a policy for deprecation. Authentication establishes who the caller is; authorization determines what that caller may do. Validate every request and return only data the caller is permitted to see.

## Worked example: a paginated books endpoint

A request such as `GET /books?limit=20&cursor=abc` can return a bounded page of results plus a cursor for the next page. A JSON response might include an `items` array and `nextCursor`. The server should validate the limit, apply the caller's access rules, and define what happens when the cursor is invalid. Pagination prevents a client from requesting an unbounded collection.

## Check Your Understanding

**1. Does valid JSON guarantee valid application data?**

<details>
<summary>Answer and explanation</summary>

No. JSON only defines syntax and data types. The server must still validate required fields, value ranges, relationships, and business rules.

</details>

**2. Why is returning every book in one response risky?**

<details>
<summary>Answer and explanation</summary>

The collection may grow very large, increasing response time, memory use, bandwidth, and database work. Pagination bounds the work per request.

</details>

## Common Pitfall

REST-style URLs and JSON do not automatically provide security, consistency, or compatibility. Those must be part of the API design.

## Key Takeaways

Model resources clearly, document JSON shapes and errors, paginate collections, and treat compatibility and authorization as part of the API design.

## Practice Exercise

Sketch JSON for a book with an ID, title, author, and price. Then design a paginated endpoint for listing books.

## Next Lesson

Lesson 10 — Latency, Bandwidth, and Throughput
### Practice Hint and Self-Check

**Hint:** Include a stable identifier and requested book fields in your JSON. For the list endpoint, include a page size and a way to request the next page.

**Self-check:** Your JSON is plausible, and the endpoint explains pagination plus one validation or authorization rule.

