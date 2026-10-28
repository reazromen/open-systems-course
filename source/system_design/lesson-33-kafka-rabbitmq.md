# Lesson 33 — Kafka and RabbitMQ

**Course:** System Design — From the Ground Up  
**Module 6 — Distributed Systems**

## Lesson Overview

Kafka and RabbitMQ both support message-driven systems, but they have different core models and strengths. Select a broker by understanding the workload and the operational responsibilities, not by assuming they are interchangeable.

## RabbitMQ: Brokered Messaging

RabbitMQ is commonly used for task queues and flexible routing through exchanges, queues, and bindings. It supports acknowledgment and delivery patterns that help distribute work among consumers. It is often a natural fit when applications need work queues, routing rules, and task-oriented messaging.

## Kafka: Distributed Event Log

Kafka stores ordered records in partitioned topics and allows consumers to read records by offset. Records can be retained for a configured period or policy, so multiple consumer groups can independently process the same event stream. It is well suited to event pipelines, replay, and high-throughput streaming workloads.

## Ordering, Replay, and Delivery

Ordering guarantees are scoped: Kafka ordering is generally within a partition, not across every partition in a topic. Queue ordering can also be affected by competing consumers and retries. Reprocessing events is useful, but consumers must be prepared for duplicates and for schema evolution over time.

## Operations Matter

Both systems require capacity planning, monitoring, security, upgrades, recovery procedures, and clear ownership. Kafka requires attention to partitions, consumer lag, retention, and replication; RabbitMQ requires attention to queue depth, acknowledgments, consumer capacity, and broker health. Choose the least complex system that satisfies the actual messaging requirements.

## Key Takeaways

RabbitMQ often fits routed task queues; Kafka often fits retained, replayable event streams. Understand ordering scope, delivery semantics, consumer behavior, and operations.

## Practice Exercise

A team needs to retain events for several days so multiple independent applications can replay them. Which broker would you evaluate first, and what operational concerns would you plan for?

## Next Lesson

Lesson 34 — Consistency, Availability, and Partition Tolerance
