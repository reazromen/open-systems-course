---
title: "Consistency Models: What Reads Are Allowed to See"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-143-consistency-models-what-reads-are-allowed-to-see.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 13
excerpt: "Consistency is not one Boolean property. Linearizability, serializability, causal ordering, read-your-writes, monotonic reads, and eventual consistency describe different guarantees about distributed state."
eyebrow: "Open Systems Course · Lesson 143 of 180"
---

Engineers often ask:

is this database consistent?

That question is too broad.

Consistency is a family of observable guarantees.

## Linearizability gives a single real-time order

A linearizable register behaves as though each operation took effect at one instant between invocation and response.

If write X completes before read Y begins, Y must observe X or something newer.

This is a strong and intuitive model for locks, configuration, and coordination.

It can require communication with an authoritative quorum and therefore cost latency or availability during partitions.

## Serializability is about transactions

Serializability says concurrent transactions behave like some serial execution.

It does not necessarily respect real-time order between separate transactions.

Strict serializability combines serial transaction behavior with a real-time constraint and is stronger.

Do not use linearizable and serializable as synonyms.

## Read-your-writes is a session guarantee

After a user changes a profile name, they usually expect to see the new name immediately.

A system with asynchronous replicas can violate this if the next read goes to a lagging replica.

Read-your-writes can be achieved without making every global read linearizable.

Session-level guarantees are often enough for product behavior.

## Monotonic reads prevent going backward

Suppose a client observes version 12.

A later read should not return version 10.

Routing the client between replicas at different lag levels can violate monotonic reads.

Sticky sessions, version tracking, or replica selection can preserve monotonicity.

## Causal consistency preserves cause before effect

If message B was written because process observed message A, causal consistency ensures observers do not see B while missing A.

Causality is weaker than a single total global order and can therefore scale differently.

It fits collaboration and social-style workloads better than some financial invariants.

## Eventual consistency promises convergence, not timing

If writes stop and communication continues, replicas eventually converge under the system's conflict rules.

“Eventually” does not say whether convergence takes 10 ms or 10 hours.

Operationally, you still need lag metrics and user-facing expectations.

Eventual consistency is not “anything goes.”

It is a specific convergence claim under assumptions.

## Stronger consistency can reduce availability

During a network partition, a system that requires a quorum may reject operations rather than risk conflicting state.

A system that accepts writes on both sides remains available but needs reconciliation.

This trade-off is related to the CAP theorem, but real systems involve latency, partial quorums, dynamic membership, and many guarantees beyond the three-letter summary.

Use CAP as a boundary result, not a complete architecture method.

## The domain chooses the guarantee

Examples:

feature flag controlling a safety interlock may need strong ordering;
social feed view can tolerate brief staleness;
shopping cart can merge additions;
financial ledger should preserve stronger invariants;
IoT telemetry can be eventually ingested while command authorization remains strongly controlled.

One application can contain several consistency models.

## Practical exercise

For one system, list five pieces of state.

For each, write the weakest guarantee users can safely tolerate.

Then describe the visible anomaly if the guarantee is weaker.

If you cannot name the anomaly, the consistency requirement is not yet concrete.

## The lesson to carry forward

Consistency models describe what histories clients are allowed to observe.

The next lesson examines one way systems agree on shared order and leadership: consensus.

## Companion exercise: consistency during partitions

For a focused example of quorum behavior during a network partition, use the [CAP trade-off explorer](../prototypes/interactive-system-design.html#cap-title). It is a simplified teaching model, not a complete consensus protocol, and complements rather than replaces the consistency models discussed above.
