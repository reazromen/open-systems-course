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

## Learning Objectives

- Compare synchronous request-response with asynchronous messaging.

- Choose communication style based on latency and coupling requirements.

- Design timeouts, retries, and idempotent contracts.

## Worked Example

A customer submits an order; sending a receipt and updating analytics do not need to block the confirmation response.

**Reasoning:** Validate and persist the order synchronously, then publish reliable events for receipt and analytics. Track delivery and make consumers safe to retry.

## Check Your Understanding

Which operation is usually a good candidate for asynchronous processing after an order is accepted?

- A. Validating the request's required fields.

- B. Sending a confirmation email.

- C. Returning whether the API accepted the order.

**Answer and explanation:** B — email can usually happen after acceptance; request validation and the immediate acceptance result belong on the synchronous path.

## Common Pitfall

Retries without idempotency can create duplicate charges, emails, or records when a caller cannot tell whether the first attempt succeeded.

## Practice Hint

For each interaction, ask whether the user must wait for the result and what happens if the dependency is slow or unavailable.

## Self-Check

Can you give one synchronous and one asynchronous interaction and explain the reason for each?

## Key Takeaways

Synchronous calls provide immediate responses but couple latency and availability. Asynchronous messages improve decoupling but require delivery, retry, and workflow-state design.

## Practice Exercise

For a purchase, identify one operation that likely needs an immediate response and two operations that could run asynchronously after the order is accepted.

## Next Lesson

Lesson 42 — High Availability and Fault Tolerance
