# Lesson 32 — Message Queues and Event-Driven Architecture

**Course:** System Design — From the Ground Up  
**Module 6 — Distributed Systems**

## Lesson Overview

A message queue lets one component hand work to another without requiring both to be available at the same moment. Event-driven architecture uses messages or events to communicate that something happened or that work should be performed.

## Producer, Queue, Consumer

A producer publishes a message, a broker stores or routes it, and a consumer processes it. For example, after an order is placed, a service can enqueue work to send a receipt or update analytics. The checkout response does not need to wait for every downstream task to finish.

## Decoupling and Backpressure

Queues buffer bursts when producers temporarily outpace consumers. Consumers can scale separately, and a downstream service outage need not immediately stop all producers. But queues do not create unlimited capacity: if messages arrive faster than they are processed for long enough, backlog and delay grow.

## Delivery and Duplicate Processing

Brokers offer different delivery guarantees. Consumers may receive a message more than once, particularly after a crash or acknowledgment timeout. Handlers should be idempotent where possible, and messages should have stable identifiers so repeated delivery does not repeat irreversible business effects.

## Retries and Dead-Letter Queues

Transient errors may succeed on retry, but retries need limits, delay, and backoff. Repeatedly retrying a permanently invalid message can waste capacity and block progress. A dead-letter queue can isolate messages that exceed retry policy for investigation and controlled replay.

## Key Takeaways

Queues decouple producers and consumers and absorb temporary bursts, but introduce lag, duplicate delivery, retries, and backlog monitoring. Build idempotent handlers.

## Practice Exercise

An order event triggers an email and inventory update. Which work can be asynchronous, and how would you prevent duplicate message delivery from decrementing inventory twice?

## Next Lesson

Lesson 33 — Kafka and RabbitMQ
