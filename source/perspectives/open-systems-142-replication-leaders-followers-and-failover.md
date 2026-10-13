---
title: "Replication: Leaders, Followers, and Failover"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-142-replication-leaders-followers-and-failover.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 13
excerpt: "Replication creates additional copies of data for availability and read scale, but lag, leader election, failover, and conflict handling determine what those copies actually guarantee."
eyebrow: "Open Systems Course · Lesson 142 of 180"
---

Replication sounds simple:

copy data from one node to another.

The hard part is deciding when each copy may accept writes, when reads are safe, and what happens when nodes disagree.

## Leader-based replication

A common model has one leader accepting writes.

Followers receive the leader's changes.

Conceptually:

client → leader → replication stream → followers.

This simplifies write ordering because one node establishes the authoritative sequence.

Followers can serve reads if the application tolerates replication lag.

## Asynchronous replication creates stale reads

If the leader commits value X and a follower has not applied it yet, a client reading the follower can see the previous value.

This creates a read-after-write problem.

The application can solve it by:

read from leader after own write;
wait for replica position;
use session consistency;
accept bounded staleness.

Replication topology alone does not choose the user experience.

## Synchronous replication changes commit cost

A leader can wait for one or more replicas before acknowledging commit.

That improves durability across node failure.

It also adds network latency and can reduce availability if required replicas are unreachable.

Every stronger acknowledgement policy creates a trade-off.

## Failover needs a new authority

If the leader fails, a follower can be promoted.

But which follower?

One may be more up to date.

Two nodes may both believe they should lead after a partition.

This is why election and quorum mechanisms matter.

Split brain means multiple nodes accept conflicting authoritative writes.

Avoiding it requires coordination or fencing.

## Fencing stops the old leader

After failover, the old leader may recover.

If it resumes writing to shared storage or serving clients, the system can corrupt state.

Fencing ensures the old leader cannot continue acting as authority.

Techniques include leases, storage fencing, generation numbers, or infrastructure-level isolation.

Leader election without fencing can be incomplete.

## Multi-leader replication accepts conflict

Some systems allow writes in multiple locations.

This improves locality or partition tolerance.

It creates conflict resolution.

Conflicts can be resolved by:

application merge;
last-write-wins;
CRDT rules;
manual reconciliation;
domain-specific arbitration.

The correct rule depends on data meaning.

A shopping cart and bank balance do not have the same safe merge policy.

## Replication lag is a first-class metric

Monitor:

bytes/records behind;
time lag;
apply rate;
replay position;
replica connection state.

A replica that is “up” but thirty minutes behind is not healthy for every workload.

Health is defined by the read contract.

## Practical experiment

Use a local database with one primary and one replica if you already have such a setup, or simulate it with a simple append log and delayed follower.

Write on the leader.

Delay the follower.

Read immediately from the follower and observe staleness.

Then promote the follower in a controlled test and ask which acknowledged writes are present.

## The lesson to carry forward

Replication gives additional copies, but consistency and authority must be defined.

The next lesson makes those read/write guarantees explicit through consistency models.
