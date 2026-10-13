---
title: "Partial Failure: The Defining Problem of Distributed Systems"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-141-partial-failure-the-defining-problem.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "In a distributed system one component can fail while others continue, and a timeout cannot tell you whether work never happened or completed without a reply. That uncertainty shapes every reliable design."
eyebrow: "Open Systems Course · Lesson 141 of 180"
---

A single process can crash.

A distributed system can do something harder:

half of it can work.

One service can be healthy while another is unreachable. A request can reach the database while the response is lost. A network can partition two groups that both believe the other side failed.

This is partial failure.

## Timeouts reveal uncertainty, not truth

Suppose service A calls service B and waits 500 ms.

No response arrives.

What happened?

B never received the request;
B received it but crashed;
B completed it but the response was lost;
the network delayed the response;
A's timeout was too short.

A timeout proves only that A did not receive a usable response before its deadline.

That uncertainty is the root of retries, idempotency, deduplication, leases, and distributed transactions.

## Failure detection is approximate

A machine cannot perfectly distinguish:

remote process dead;
network path broken;
remote process paused;
packet delayed;
remote overloaded.

Heartbeat and health checks create evidence.

They do not create perfect knowledge.

This is why distributed systems often use terms such as suspected failure rather than absolute certainty.

## Network partitions preserve both sides

If communication fails between two groups, both can continue running.

Now each side has local state and may accept operations.

When connectivity returns, those histories can conflict.

Design must decide:

stop writes on one side;
accept writes and reconcile later;
elect one leader;
partition ownership;
reject operations requiring unavailable quorum.

There is no universal answer.

## Clocks are also distributed state

Machine clocks drift.

NTP reduces drift but does not make all clocks identical.

Wall-clock timestamps are therefore dangerous as the only conflict-resolution mechanism.

Monotonic clocks are useful for local duration measurement.

Logical clocks, versions, sequence numbers, or consensus ordering can be safer for distributed causality.

## Fail-stop is a simplifying model

Many algorithms model a node as either operating correctly or stopped.

Real systems can fail more strangely:

disk full;
slow CPU;
corrupted memory;
expired certificate;
stuck process;
network path only partly broken;
one dependency unavailable.

Fault models matter because an algorithm only protects against the failures it assumes.

## Redundancy creates coordination work

Two replicas can improve availability.

They also create a new question:

which copy is authoritative?

Three replicas can tolerate more failures under some protocols.

They also add message traffic, election state, and consistency rules.

Redundancy is not simply duplication.

It is duplication plus coordination.

## Deadlines should propagate

If an HTTP request has 2 seconds remaining, a downstream database call should not start a 30-second timeout.

Otherwise the outer request ends while inner work continues.

A distributed request benefits from a deadline budget that shrinks as it crosses services.

This reduces wasted work and makes failures more predictable.

## Practical experiment

Run two small local services.

Make A call B with a timeout.

Add three test modes to B:

sleep longer than timeout;
perform state change then delay response;
return immediately.

From A's perspective, the first two both time out.

Inspect B's state and logs.

That experiment demonstrates why retrying after timeout can duplicate effects.

## The lesson to carry forward

Distributed systems are defined by independent failure and incomplete knowledge.

The next lesson asks how multiple copies of state are maintained: leaders, followers, replication lag, failover, and split-brain risk.
