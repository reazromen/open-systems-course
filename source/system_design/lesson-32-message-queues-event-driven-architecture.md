# Lesson 32 — Message Queues and Event-Driven Architecture

**Course:** System Design — From the Ground Up  
**Module 7 — Distributed Systems**

## Learning Objectives
- Explain producers, consumers, and queues.
- Describe how queues buffer bursts and decouple services.
- Identify delivery and ordering trade-offs.

## Core Concept
A producer publishes a message; a queue or broker stores it until a consumer processes it. This decouples the producer from immediate consumer availability and can smooth bursts. It also introduces asynchronous behavior, delivery guarantees, retries, dead-letter handling, and possible duplicate processing.

## Worked Example
After an order is placed, the API stores the order and publishes an event for email delivery. The customer need not wait for the email provider. If the provider is temporarily unavailable, the consumer can retry while the order service continues accepting work within its capacity.

## Common Pitfall
Acknowledging a message before its work is safely completed can lose work after a crash. Retrying without idempotent processing can perform the same action twice.

## Knowledge Check
1. What does a queue help absorb?
   - **Answer:** Temporary differences between production and consumption rates.
2. Why design consumers to be idempotent?
   - **Answer:** A message may be delivered more than once, and repeated handling should not duplicate its effect.

## Practice Hint
Draw an order API, broker, email worker, retry path, and dead-letter queue. Decide when the worker acknowledges a message.

## Self-Check
Can you describe what happens during a consumer outage and how failed messages are recovered?

## Next Lesson

Lesson 33
