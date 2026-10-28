# Lesson 10 — Latency, Bandwidth, and Throughput

**Course:** System Design — From the Ground Up  
**Module 2 — Networking and Communication**

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

## Key Takeaways

Latency is delay, bandwidth is link capacity, and throughput is completed work per unit time. Define measurements and examine percentiles, errors, and load together.

## Practice Exercise

A service handles 1,000 requests per second, but some users wait three seconds. Explain why high throughput does not prove the system is responsive.

## Next Lesson

Lesson 11 — Synchronous and Asynchronous Communication
