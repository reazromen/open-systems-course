# Lesson 10 — Latency, Bandwidth, and Throughput

**Course:** System Design — From the Ground Up  
**Module 2 — Networking and Communication**

## Learning Objectives

By the end of this lesson, you should be able to:
- Distinguish latency, bandwidth, and throughput.
- Explain why high throughput does not guarantee fast individual responses.
- Interpret p95 and p99 latency at a basic level.

## Lesson Overview

Performance is not one number. Latency, bandwidth, and throughput describe different properties, and confusing them can lead to the wrong system design decisions.

## Latency: How Long It Takes

Latency is the time taken for an operation or a piece of data to travel through a defined path. An API might respond in 80 milliseconds for one request and 900 milliseconds for another. Latency can include DNS lookup, connection setup, network travel, queueing, application work, and database access. Always define where measurement starts and ends.

## Bandwidth: The Capacity of a Link

Bandwidth describes the maximum data-carrying capacity of a link over time, often measured in bits per second. A connection with high bandwidth can carry a large amount of data, but a single small request can still experience high latency due to distance, queueing, or slow processing.

## Throughput: Actual Work Completed

Throughput measures how much work or data a system processes over time: requests per second, orders per minute, or megabytes per second. High throughput does not guarantee low latency. A queue may allow a service to process many requests overall while individual requests wait longer.

## Measure the Distribution

Average latency can hide poor experiences. The 95th percentile (p95) is the value below which 95% of measured requests fall; p99 highlights the slowest tail. Track error rate and throughput alongside latency. A useful capacity test resembles real traffic and checks the whole request path rather than only one component.

## Worked example: a busy API

Suppose an API processes 1,000 requests per second, but p95 latency is 2 seconds. The service has high throughput, yet at least 5% of measured requests take 2 seconds or longer. Requests may be waiting in queues or blocked on a slow dependency. Measure latency distributions, error rates, and resource saturation together before deciding whether to add capacity or remove a bottleneck.

## Check Your Understanding

**1. What does bandwidth describe?**

<details>
<summary>Answer and explanation</summary>

The data-carrying capacity of a link over time, commonly measured in bits per second.

</details>

**2. If p95 latency is 800 ms, what does that mean?**

<details>
<summary>Answer and explanation</summary>

About 95% of measured requests completed in 800 ms or less, while about 5% took longer, assuming the same measurement window and definition.

</details>

## Common Pitfall

Do not use a single average or requests-per-second number as the entire performance story. Tail latency and errors often reveal user-visible problems.

## Key Takeaways

Latency is delay, bandwidth is link capacity, and throughput is completed work per unit time. Define measurements and examine percentiles, errors, and load together.

## Practice Exercise

A service handles 1,000 requests per second, but some users wait three seconds. Explain why high throughput does not prove the system is responsive.

## Next Lesson

Lesson 11 — Synchronous and Asynchronous Communication
### Practice Hint and Self-Check

**Hint:** Distinguish the number of requests completed each second from how long one request takes.

**Self-check:** Your explanation correctly defines all three metrics and uses a percentile to describe slow requests.

