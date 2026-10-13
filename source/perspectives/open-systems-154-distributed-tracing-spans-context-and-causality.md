---
title: "Distributed Tracing: Spans, Context, and Causality"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-154-distributed-tracing-spans-context-and-causality.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 13
excerpt: "Distributed tracing follows one logical operation across process and service boundaries. Trace context, spans, parent-child relationships, attributes, and sampling reveal where latency and errors propagate."
eyebrow: "Open Systems Course · Lesson 154 of 180"
---

A user request reaches five services.

Every service has logs.

Which log lines belong to this request?

Distributed tracing propagates context so one logical operation can be reconstructed across boundaries.

## A trace contains spans

A span represents one timed operation:

HTTP server handling;
database query;
outbound RPC;
queue publish;
cache lookup.

A trace groups related spans.

Parent-child relationships describe causality or nesting.

The trace becomes a distributed call tree.

## Trace context must propagate

The W3C Trace Context standard defines traceparent and tracestate fields for propagating identifiers across HTTP-style boundaries.

OpenTelemetry also defines context propagation APIs and semantic conventions.

If a service fails to propagate context, the trace breaks there.

The request still works.

Observability loses causality.

## Span timing reveals where latency accumulated

Suppose total request time is 900 ms.

Trace shows:

edge 5 ms;
application work 20 ms;
database 40 ms;
payment API 800 ms.

Now the performance hypothesis is narrower.

Tracing does not prove why payment was slow.

It identifies the boundary consuming time.

## Attributes need controlled cardinality and privacy

Useful span attributes include:

HTTP method;
route template;
status;
database system;
peer service;
RPC method.

Avoid adding raw passwords, tokens, personal data, or unbounded request bodies.

Trace storage can become both expensive and sensitive.

## Errors should be attached to the responsible span

If a database call times out, the database client span should record the error.

The parent application span can record the effect.

This produces a causal chain rather than one generic root-level failure.

## Sampling decides what history exists

Head sampling decides near trace start.

Tail sampling can make decisions after observing outcomes, allowing systems to retain slow or failed traces at higher rates.

Sampling changes what questions can be answered later.

Metrics can tell you all requests had 2 percent errors.

Sampled traces explain some representative failures.

Use both.

## Asynchronous boundaries need links

A queue consumer may run seconds after the producer request finished.

The consumer span is not always a normal child in one synchronous stack.

Trace links or correlation metadata can represent that causal relationship.

Distributed systems are graphs, not always trees.

## Clock skew can distort waterfalls

Span durations should rely on appropriate local clocks.

Cross-host start timestamps can still appear slightly inconsistent if wall clocks differ.

Tracing backends can compensate for some skew, but good time synchronization remains useful.

Do not diagnose negative-looking gaps without considering clocks.

## Practical exercise

Instrument three local services with OpenTelemetry.

Propagate trace context from A to B to C.

Add one database span.

Introduce a delay in C.

Observe the waterfall.

Then deliberately remove propagation between B and C and see how the trace fragments.

This makes context propagation failure visible.

## The lesson to carry forward

Tracing maps causal latency across service boundaries.

The next lesson drops below application telemetry and observes packets directly.
