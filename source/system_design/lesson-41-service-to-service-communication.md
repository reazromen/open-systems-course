# Lesson 41 — Service-to-Service Communication

**Course:** System Design — From the Ground Up  
**Module 7 — Microservices**

## Lesson Overview

Services usually communicate through synchronous requests, asynchronous messages, or a combination of both. The choice affects latency, coupling, failure behavior, and how users experience incomplete work.

## Synchronous Requests

HTTP or RPC calls let a caller request an operation and wait for a response. This is easy to understand when the result is needed immediately, but caller latency depends on downstream latency. Long chains of synchronous calls can multiply failure probability and make tail latency worse.

## Asynchronous Messages

A producer can publish a message and continue without waiting for every consumer. This is useful for notifications, analytics, and workflows that can complete later. It introduces eventual completion, message delivery semantics, retries, and the need to expose job or workflow status when users care about progress.

## Design the Contract

Specify request and response schemas, error behavior, timeouts, version compatibility, and ownership. For events, define what happened, when it is safe to consume the event, and how schemas evolve. Avoid exposing implementation details that force every consumer to change with the producer.

## Choose Per Interaction

Use synchronous communication when the caller genuinely needs an immediate answer; use asynchronous communication when work can happen later or must survive temporary consumer outages. Avoid adding a broker solely for fashion, and avoid long synchronous chains where independent processing would be safer.

## Key Takeaways

Synchronous calls provide immediate responses but couple latency and availability. Asynchronous messages improve decoupling but require delivery, retry, and workflow-state design.

## Practice Exercise

For a purchase, identify one operation that likely needs an immediate response and two operations that could run asynchronously after the order is accepted.

## Next Lesson

Lesson 42 — High Availability and Fault Tolerance
