# Lesson 05 — HTTP, HTTPS, and APIs

**Course:** System Design — From the Ground Up  
**Module 1 — System Design Fundamentals**

## Lesson Overview

HTTP defines how clients and servers exchange web messages. HTTPS adds transport encryption and server authentication through TLS, while an API defines an interface that software can use.

## HTTP Messages

An HTTP request includes a method, a target path, headers, and optionally a body. The response includes a status code, headers, and often a body. Methods express intent: GET typically retrieves a representation, POST submits data or requests processing, PUT replaces a resource representation, PATCH modifies part of one, and DELETE requests removal. Actual behavior must still be defined by the API contract.

## Status Codes

Status codes help clients interpret outcomes. Broadly, 2xx indicates success, 3xx redirection, 4xx a client-side request or permission problem, and 5xx a server-side failure. For example, 404 means a resource was not found, while 500 indicates an unexpected server error. A useful API returns appropriate codes and a safe, understandable error body.

## Why HTTPS Matters

HTTPS is HTTP carried over TLS. It helps protect confidentiality and integrity in transit and allows clients to authenticate the server's identity through certificate validation. HTTPS does not automatically make an application secure: authorization flaws, unsafe input handling, exposed secrets, and incorrect business rules can still cause harm.

## What an API Is

An Application Programming Interface is a defined way for one program to interact with another. A web API might expose endpoints such as GET /products/42 or POST /orders. Its contract should specify inputs, outputs, authentication, errors, and compatibility expectations. APIs are boundaries: changes at a boundary can affect every client that depends on it.

## Key Takeaways

HTTP is a message protocol; HTTPS protects HTTP with TLS; an API is the interface contract. Design predictable methods, status codes, data shapes, and errors.

## Practice Exercise

Design an API request for retrieving a book and one for creating an order. State the method, path, expected success code, and one possible error.

## Next Lesson

Lesson 06 — What Is a Database and Why Do We Need One?
