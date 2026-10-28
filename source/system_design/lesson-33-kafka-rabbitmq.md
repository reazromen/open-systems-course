# Lesson 33 — Kafka and RabbitMQ: Choosing a Message Broker

**Course:** System Design — From the Ground Up  
**Module 7 — Distributed Systems**

## Learning Objectives
- Understand the broad differences between Kafka and RabbitMQ.
- Match broker behavior to workload requirements.
- Compare retention, routing, replay, and operations.

## Core Concept
Kafka is a distributed event-streaming platform built around partitioned, retained logs and consumer offsets; it is well suited to high-volume streams and replay. RabbitMQ is a message broker with flexible routing and queueing patterns, often useful for task distribution and application messaging. Both can support reliable systems, but configuration and operations matter more than slogans.

## Worked Example
A team needs to retain clickstream events for several days so analytics consumers can independently replay them. Kafka's retained log and consumer offsets fit that access pattern. A job-processing application needs routing by task type and flexible queue semantics; RabbitMQ may be a natural candidate. Validate throughput, delivery, ordering, and operational requirements before deciding.

## Common Pitfall
Choosing by benchmark headline alone. Broker durability, partitioning, acknowledgements, consumer concurrency, message size, and operational expertise affect outcomes.

## Knowledge Check
1. Which model naturally supports consumers replaying retained events from an offset?
   - **Answer:** Kafka's retained log model.
2. Does either broker remove the need to handle duplicate processing?
   - **Answer:** No. Consumers should account for retries and delivery semantics.

## Practice Hint
List required ordering scope, replay duration, routing rules, throughput, and recovery objectives before selecting a broker.

## Self-Check
Can you justify a broker choice using workload requirements rather than popularity?

## Next Lesson

Lesson 34
