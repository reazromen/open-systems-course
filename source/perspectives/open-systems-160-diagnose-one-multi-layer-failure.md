---
title: "Diagnose One Multi-Layer Failure"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-160-diagnose-one-multi-layer-failure.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 15
excerpt: "A complete investigation moves from user symptom to metrics, logs, traces, packets, profiling, change history, and recovery evidence. The point is not to collect every signal but to choose the next observation that best separates hypotheses."
eyebrow: "Open Systems Course · Lesson 160 of 180"
---

Constructed incident:

Users report intermittent failed checkout.

Error rate rises to 12 percent.

Only one application zone is affected.

Some requests return 504.

CPU appears normal.

We will diagnose it without random restarts.

## 1. Define the symptom

Observation:

POST /checkout;
12 percent 504;
14:02-14:19 UTC;
zone B only;
GET traffic mostly healthy.

Already we know this is not total service failure.

## 2. Check population metrics

Metrics show:

request rate normal;
CPU 45 percent;
memory normal;
checkout latency p99 spikes;
database connection-pool wait time spikes only in zone B.

Now the leading hypothesis becomes pool starvation or a slow dependency holding connections.

CPU saturation becomes weaker.

## 3. Compare healthy zone A

Zone A:

pool wait near zero;
same application version;
same database;
different proxy/sidecar version.

A differential clue appears.

Recent-change timeline shows sidecar upgrade in zone B at 13:58.

That is correlation, not proof.

## 4. Inspect traces

Slow traces show:

request enters app quickly;
database query itself 15 ms;
span waits 4 seconds before database query begins.

The delay is before query execution.

Connection acquisition is the boundary.

Database performance is not the primary cause.

## 5. Inspect application logs

Structured logs show repeated upstream resets to another service.

Retry logic holds the transaction context and database connection while retrying the dependency.

This explains pool exhaustion.

Now the hypothesis connects two symptoms.

## 6. Inspect packet/network evidence only where needed

Packet capture between sidecar and dependency shows connections being reset after a policy change.

Healthy zone A does not show the resets.

Network evidence confirms the sidecar/dependency boundary is behaving differently.

## 7. Build the causal chain

Sidecar upgrade changes upstream connection behavior.

Dependency calls reset.

Application retries while holding DB connection.

Long-held connections exhaust pool.

New checkout requests wait for pool.

Proxy deadline expires.

Users receive 504.

Every step has evidence.

## 8. Mitigate

Roll back sidecar in zone B.

Error rate drops.

Pool wait returns to baseline.

Checkout latency recovers.

That restores service.

The exact sidecar bug can be investigated later.

## 9. Preserve evidence before cleanup

Save:

deployment version;
relevant sidecar config;
trace examples;
packet capture window;
pool metrics;
logs;
timeline.

Do not delete the evidence because recovery succeeded.

## 10. Improve the architecture

Potential corrective actions:

do not hold DB transaction while retrying unrelated dependency;
shorten dependency deadline;
bound retries;
add pool-wait metric alert;
canary sidecar changes;
add integration test for reset behavior.

The incident was enabled by several weak boundaries, not one villain.

## The diagnostic hierarchy

A useful order is:

user symptom;
aggregate metrics;
recent changes;
traces;
targeted logs;
resource profiling;
packet capture;
code inspection.

This order is not mandatory.

Choose the cheapest evidence that best discriminates hypotheses.

## What Module 16 added

Debugging, Observability and Failure connected:

hypothesis testing;
structured logs;
metrics;
traces;
packet captures;
profiling;
SLOs;
incident coordination;
recovery;
multi-layer diagnosis.

Observability is not collecting everything.

It is preserving enough evidence to answer important questions.

## The module to carry forward

Module 17 adds the adversarial dimension: identity, authentication, authorization, secrets, encryption, PKI, trust boundaries, software supply chain, and one authenticated request from user to data.
