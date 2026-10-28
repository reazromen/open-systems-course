# Lesson 11 — Synchronous and Asynchronous Communication

**Course:** System Design — From the Ground Up  
**Module 2 — Networking and Communication**

## Lesson Overview

Communication style determines how long a caller waits, how components are coupled, and how a system handles work that takes time or fails.

## Synchronous Calls

In a synchronous interaction, the caller waits for a result before continuing. A mobile app asking an API for a profile is a common example. This is easy to understand, but a slow dependency can keep the caller waiting and consume connections or worker capacity.

## Asynchronous Work

With asynchronous processing, a component accepts work and the result may arrive later. A user might submit a video for processing, receive a job identifier, and check status while a background worker handles the file. Queues can absorb bursts and separate the speed of producers from consumers.

## Trade-offs and Failure Modes

Asynchronous design adds complexity: queued work can be delayed, delivered more than once, or fail after partial progress. Systems need retry limits, dead-letter handling, idempotent consumers, monitoring, and a way to expose status. A queue is not a guarantee that work will eventually succeed unless the surrounding system provides that guarantee.

## Choose Deliberately

Use synchronous communication when the user needs an immediate answer and the operation is predictably short. Consider asynchronous processing for slow jobs, bursty workloads, or tasks that can finish independently. A single product can use both: synchronously validate an upload, then asynchronously generate thumbnails.

## Key Takeaways

Synchronous calls simplify immediate responses; asynchronous workflows decouple acceptance from completion but require explicit job state, retries, and failure handling.

## Practice Exercise

Design the flow for uploading a large video and generating thumbnails. Which steps should be synchronous, and which can run asynchronously?

## Next Lesson

Lesson 12 — SQL and Relational Databases
