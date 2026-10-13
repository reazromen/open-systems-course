---
title: "Metrics: Counters, Gauges, Histograms, and Cardinality"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-153-metrics-counters-gauges-histograms-and-cardinality.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "Metrics compress many events into time series. Correct metric type, labels, histograms, rates, and bounded cardinality make population behavior visible without storing every event."
eyebrow: "Open Systems Course · Lesson 153 of 180"
---

A trace explains one request.

A log explains one event.

A metric answers:

how often, how much, how many, and how is it changing?

Metrics are intentionally lossy summaries.

That is their strength.

## Counters only move forward

A counter represents cumulative occurrences:

requests_total;
errors_total;
bytes_sent_total.

The useful view is usually the rate of increase over time.

If a process restarts, the counter resets and the monitoring system must handle that.

Do not use a counter for current queue depth.

## Gauges move both directions

A gauge represents a current value:

memory_bytes;
queue_depth;
temperature;
active_calls.

It can increase or decrease.

A gauge is a snapshot-like measurement, not an accumulated event count.

## Histograms preserve distributions

Latency averages hide tails.

Ten requests at 10 ms and one request at 2 seconds can produce a harmless-looking average.

A histogram counts observations into buckets and can support percentile-style analysis.

Useful for:

request latency;
packet size;
job duration;
queue wait;
payload size.

Choose buckets that match the operational range.

## Percentiles are population questions

p50 answers a median-like question.

p99 asks about the slow tail.

One percent of a million requests is still ten thousand requests.

Tail behavior often determines user pain even when average latency is excellent.

## Labels multiply time series

A metric:

http_requests_total{method,status}

has bounded label combinations.

Add user_id or request_id and cardinality can become enormous.

Cardinality is approximately the product of distinct label-value combinations.

Use high-cardinality identities in logs/traces instead.

## RED and USE are useful heuristics

For request-driven services, RED focuses on:

Rate;
Errors;
Duration.

For resources, USE focuses on:

Utilization;
Saturation;
Errors.

These are not universal laws.

They are checklists that help avoid dashboards containing only CPU and memory.

## Derived ratios need compatible denominators

An error percentage should divide comparable populations.

If numerator counts only POST requests and denominator counts all requests, the ratio is misleading.

Likewise, averages across already-averaged values can be mathematically wrong when sample counts differ.

Monitoring is applied statistics.

## Missing metrics can mean missing target

If a service stops exporting metrics, a graph can look empty rather than red.

Alerting should distinguish:

value is healthy;
target is unreachable;
series disappeared.

Absence is a state.

## Practical exercise

Instrument one local service with:

requests_total;
request_errors_total;
request_duration histogram;
inflight_requests gauge.

Generate fast and slow requests.

Observe how rate, error ratio, and histogram differ.

Then deliberately add a high-cardinality label in a test and inspect the number of series created.

Remove it before production.

## The lesson to carry forward

Metrics reveal population behavior cheaply when their semantics and cardinality are controlled.

The next lesson connects individual operations across services through distributed tracing.
