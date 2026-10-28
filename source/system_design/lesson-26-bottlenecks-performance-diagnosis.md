# Lesson 26 — Bottlenecks and Performance Diagnosis

**Course:** System Design — From the Ground Up  
**Module 5 — Scalability and Performance**

## Lesson Overview

A bottleneck is a component that limits the performance of the overall system. Good system design identifies the limiting resource with evidence before adding capacity or rewriting code.

## Start with the User-Visible Symptom

Define what is slow: request latency, throughput, error rate, page rendering, or a background job's completion time. Establish a baseline and compare normal behavior with the period when the problem occurs. Averages alone can hide a poor experience, so inspect percentiles such as p95 and p99.

## Follow the Request Path

A request may pass through DNS, a proxy, an application, a cache, a database, and an external API. Measure each stage where possible. Distributed tracing can reveal whether time is spent waiting on the database, calling a third party, contending for locks, or executing application code.

## Resource Saturation and Queues

CPU saturation can indicate compute-bound work; memory pressure may trigger garbage collection or swapping; disk latency can slow persistence; connection pools can be exhausted; and queues can grow when incoming work exceeds processing capacity. A symptom such as high latency can have several causes, so correlate metrics rather than guessing.

## Change One Thing and Verify

Form a hypothesis, make a controlled change, and compare results against the baseline. Load tests should resemble real traffic and data distributions. Watch for bottleneck migration: after optimizing one dependency, another may become the new limit. Keep rollback options for risky changes.

## Key Takeaways

Diagnose from user-visible symptoms through the request path. Use percentiles, traces, resource metrics, and controlled experiments; do not guess from a single metric.

## Practice Exercise

Users report slow checkout. List four components you would inspect and one metric or trace signal that could help distinguish each cause.

## Next Lesson

Lesson 27 — Database Replication
