# Lesson 09 — REST APIs and JSON

**Course:** System Design — From the Ground Up  
**Module 2 — Networking and Communication**

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

## Key Takeaways

Model resources clearly, document JSON shapes and errors, paginate collections, and treat compatibility and authorization as part of the API design.

## Practice Exercise

Sketch JSON for a book with an ID, title, author, and price. Then design a paginated endpoint for listing books.

## Next Lesson

Lesson 10 — Latency, Bandwidth, and Throughput
