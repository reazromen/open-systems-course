---
title: "Debugging Is Hypothesis Testing"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-151-debugging-is-hypothesis-testing.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 11
excerpt: "Good debugging is not random command execution. It is a sequence of hypotheses, discriminating tests, preserved evidence, and progressively smaller failure domains."
eyebrow: "Open Systems Course · Lesson 151 of 180"
---

A production system fails.

The fastest-looking response is to start running commands.

Restart service.
Clear cache.
Reboot host.
Retry deployment.

That can restore service.

It can also destroy the evidence needed to understand the failure.

Debugging is more disciplined when treated as hypothesis testing.

## Start with the symptom, not the cause

“The database is down” is already a diagnosis.

A better starting observation is:

POST /checkout returned 504 for 18 percent of requests between 14:02 and 14:07.

Now the system can ask which layers are capable of producing that symptom.

Precise observations create testable hypotheses.

## Build a failure boundary

For a web request:

client;
DNS;
network;
TLS;
edge;
proxy;
application;
connection pool;
database;
downstream service.

For a SIP call:

registration;
routing;
INVITE transaction;
SDP;
RTP;
NAT;
trunk.

For an IoT device:

sensor;
firmware;
Wi-Fi;
DNS;
TLS;
MQTT;
broker;
ingestion.

The architecture gives the search space.

## A good test separates hypotheses

Suppose two hypotheses are:

database slow;
application CPU saturated.

A test that only says “request slow” separates nothing.

Database query timing and CPU run-queue evidence can distinguish them.

Choose observations that produce different expected outcomes for competing explanations.

## Change one variable at a time

If you restart the app, database, proxy, and host together and the incident disappears, you learned very little.

A controlled change should have an expected effect.

If the change works, update the model.

If it does not, update the model.

Debugging is iterative science on a live system.

## Preserve timestamps

Cross-system investigation depends on time.

Collect:

incident start;
deployments;
alerts;
log timestamps;
trace timestamps;
packet timestamps;
user reports.

Clock skew can create false ordering.

Know whether timestamps are UTC, local time, monotonic durations, or synchronized wall clock.

## Negative evidence is useful

If the request never appears in the application access log but exists in edge logs, the failure boundary is between those components.

If SIP INVITE exists but no RTP packets arrive, signaling and media have diverged.

If a device publishes telemetry but ingestion has no record, the broker/consumer path deserves attention.

What is absent can narrow the search.

## Restarts are experiments with side effects

A restart can:

clear leaked memory;
drop stuck connections;
re-resolve DNS;
re-elect leadership;
lose in-memory state;
remove evidence.

If a restart is necessary for recovery, record state first when possible:

process metrics;
logs;
open sockets;
memory;
thread/task state;
recent changes.

Recovery and diagnosis are separate goals.

## Compare healthy and unhealthy paths

One of the strongest debugging tools is differential comparison.

Compare:

working instance vs failing instance;
old version vs new version;
region A vs region B;
successful call vs failed call;
healthy device cohort vs failing cohort.

The difference often reveals the hypothesis faster than examining one system in isolation.

## Reproduction is a model test

A reproduction should recreate the smallest set of conditions needed for the symptom.

If the production failure requires:

firmware 2.4;
hardware revision B;
weak Wi-Fi;
OTA after long uptime;

then reproducing only “firmware 2.4 on my desk” may prove little.

Each reproduction step is an attempt to identify necessary conditions.

## Write the current hypothesis

During a confusing incident, explicitly write:

Observation:
Checkout 504s only from one proxy pool.

Hypothesis:
Those proxies have exhausted upstream connection pools.

Prediction:
Failing proxies will show high wait time and healthy proxies will not.

Test:
Compare pool metrics and upstream socket counts.

This prevents teams from jumping between unrelated guesses.

## Practical exercise

Take a past incident or create a local failure.

Write three competing hypotheses before touching the system.

For each, define one test that would strongly support or weaken it.

Then perform the tests in order of lowest risk and highest information value.

The goal is not to guess correctly first.

The goal is to shrink uncertainty deliberately.

## The lesson to carry forward

Debugging is evidence-driven model refinement.

The next lesson studies the most familiar evidence source: logs, and why structured events, context, correlation, and retention matter.
