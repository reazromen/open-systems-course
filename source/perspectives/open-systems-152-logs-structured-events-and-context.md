---
title: "Logs: Structured Events, Context, and Correlation"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-152-logs-structured-events-and-context.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "Logs are discrete event records. Structured fields, stable event codes, request context, and careful secret handling turn text output into operational evidence."
eyebrow: "Open Systems Course · Lesson 152 of 180"
---

A log line is a claim made by software about an event.

Good logging makes those claims searchable and correlatable.

Bad logging produces thousands of lines that cannot answer who, what, when, or which request.

## Log events, not prose alone

This is readable:

payment failed.

This is diagnosable:

event=payment_failed
request_id=...
order_id=...
provider=...
reason=timeout
attempt=2
latency_ms=...

Structured fields let machines aggregate and humans filter.

The human-readable message can remain.

The stable fields carry the operational contract.

## Event codes survive wording changes

If alerts depend on the text “Connection failed,” changing the sentence breaks automation.

A stable event code such as db_connection_failed is safer.

The display message can improve over time.

The event identity remains stable.

## Correlation connects components

One user action can produce logs in:

edge;
application;
database client;
queue producer;
worker.

A request or trace identifier links those events.

For asynchronous work, propagate correlation or causation identifiers in message metadata.

Without correlation, searching by timestamp is guesswork under load.

## Severity should mean operational consequence

DEBUG, INFO, WARN, ERROR are useful only if teams use them consistently.

An expected 404 should not necessarily be ERROR.

A failed background retry can be WARN.

A terminal loss of a required operation can be ERROR.

If every exception logs ERROR during normal control flow, alerting becomes noise.

Severity is policy.

## Logs must not become credential leaks

Never casually log:

passwords;
private keys;
session cookies;
bearer tokens;
full authorization headers;
sensitive personal data.

Redaction after ingestion is too late if secrets already crossed systems.

Design logging at the source to exclude sensitive fields.

## Stack traces need boundaries

A stack trace is useful for unexpected software failures.

It is less useful when emitted for every known validation error.

Log the stack where it helps identify code path.

Avoid duplicating the same exception at every layer unless each layer adds distinct context.

Otherwise one failure becomes ten scary errors.

## High-cardinality logs are different from metrics

Logs are well suited to per-request IDs and device IDs.

Metrics systems can suffer if the same high-cardinality values become labels on every time series.

Choose the telemetry signal based on how the data will be queried.

## Sampling changes evidence

High-volume systems may sample logs.

Sampling should preserve rare failures and important state transitions.

Randomly keeping one percent of all lines can discard the only evidence for a low-frequency corruption bug.

Tail-based or severity-aware strategies can preserve higher-value events.

## Retention is part of incident capability

If an incident is discovered 14 days later but logs are retained for 7 days, the evidence is gone.

Longer retention costs money and may increase privacy risk.

Set retention from:

detection delay;
audit needs;
storage cost;
data sensitivity.

## Practical exercise

Take one service you control.

Choose one request.

Produce a structured log at:

request accepted;
dependency call started;
dependency completed;
business state committed;
response returned.

Use one request_id across all entries.

Then query only that identifier and reconstruct the timeline.

If the timeline is ambiguous, add the missing context rather than adding generic more logging.

## The lesson to carry forward

Logs capture discrete events with context.

The next lesson moves from individual events to aggregate behavior: metrics, counters, gauges, histograms, and cardinality.

## Interactive companion exercise

Use the [queue-and-worker simulator](../prototypes/interactive-system-design.html#queue-title) as a companion model for queued event processing and worker capacity. The model does not represent log storage or query semantics.
