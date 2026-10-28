# Lesson 46 — Logs, Metrics, and Traces

**Course:** System Design — From the Ground Up  
**Module 8 — Reliability, Security, and Observability**

## Lesson Overview

Observability helps teams infer what a system is doing from the signals it emits. Logs, metrics, and distributed traces answer different questions and are most useful when they share consistent context.

## Logs Explain Events

Logs record discrete events with context, such as a failed payment request or a configuration change. Structured fields make them searchable and aggregatable. Include request or trace identifiers, but avoid logging passwords, access tokens, payment secrets, or unnecessary personal information.

## Metrics Show Trends

Metrics are numeric measurements over time: request rate, error rate, latency, CPU utilization, queue depth, and database connection usage. Histograms and percentiles can reveal tail latency. Avoid unbounded label values such as raw user IDs or full URLs, which can create excessive cardinality and cost.

## Traces Follow a Request

A distributed trace connects spans from a request across services and dependencies. It can show where time is spent and which downstream call failed. Trace context should propagate across supported HTTP, RPC, and message boundaries, while sampling and retention should be chosen according to traffic and diagnostic needs.

## Use the Signals Together

A latency alert may point to a metric; a trace can identify a slow dependency; logs from that trace can reveal the specific error. Define actionable alerts tied to user impact, keep clocks and identifiers usable, and verify that dashboards and alerts work during incidents.

## Learning Objectives

- Distinguish logs, metrics, and distributed traces.

- Correlate telemetry across services using request or trace identifiers.

- Use observability signals to investigate latency and errors.

## Worked Example

Users report occasional slow requests, but average latency looks normal.

**Reasoning:** Inspect latency percentiles and error rates, follow a slow trace across service boundaries, then correlate structured logs using the trace ID and dependency timing.

## Check Your Understanding

Which signal is best suited to show the path and timing of one request across multiple services?

- A. A distributed trace

- B. A host disk-capacity gauge alone

- C. An uncorrelated text log file

**Answer and explanation:** A — traces connect spans across services and show where a particular request spent time.

## Common Pitfall

High-cardinality identifiers such as user IDs should not be metric labels by default; they can overwhelm the time-series backend and increase cost.

## Practice Hint

Start with the user-visible symptom, then choose a metric for scope, a trace for path, and logs for event details.

## Self-Check

Can you explain when you would use a metric, a trace, and a structured log?

## Key Takeaways

Metrics show how behavior changes, logs explain specific events, and traces connect work across services. Correlate them with request context and protect sensitive data.

## Practice Exercise

Users report intermittent slow requests. Name one metric, one trace detail, and one structured log field that would help investigate the problem.

## Next Lesson

Lesson 47 — Backups, Recovery, and Operational Readiness
