---
title: "Consensus, Leader Election, and Quorums"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-144-consensus-leader-election-and-quorums.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 14
excerpt: "Consensus lets nodes agree on a sequence of decisions despite failures. Terms, quorums, replicated logs, leader election, and membership rules turn multiple machines into one coordinated state machine."
eyebrow: "Open Systems Course · Lesson 144 of 180"
---

If five servers all need to agree who the leader is, asking each server to choose independently does not work.

They need a protocol.

Consensus algorithms such as Raft and Paxos address a core distributed problem:

how can nodes agree on a value or ordered log despite failures and delayed messages?

## Consensus is not replication alone

Copying data to three nodes is replication.

Agreeing on one authoritative order of changes is consensus.

A consensus-backed replicated log lets nodes execute the same commands in the same order.

That can implement strongly consistent metadata, configuration, locks, or a database log.

## Quorums overlap

In a five-node cluster, a majority quorum is three.

Any two majorities overlap in at least one node.

That overlap helps prevent two independent groups from both safely committing conflicting decisions under the same term/state rules.

Quorum is not magic voting.

Its safety comes from intersection plus protocol rules about which history can be accepted.

## Terms or epochs distinguish leadership generations

Raft uses terms.

Other systems use epochs, ballots, or generations.

A leadership number prevents stale leaders from pretending they still belong to the current generation.

When a higher term is observed, old leadership is invalid.

This same pattern appears in fencing tokens and distributed leases.

## Election chooses a leader

If followers stop hearing from the current leader, they can start an election after randomized timeouts.

Randomization reduces synchronized election collisions.

A candidate requests votes.

If it receives a majority under the protocol, it becomes leader for that term.

The leader then replicates log entries.

## Commit is a quorum property

A leader does not treat a write as committed merely because it stored it locally.

It replicates the entry.

Once the required quorum acknowledges according to the algorithm, the entry can become committed and later applied to the state machine.

This is why consensus writes usually require network round trips.

## Consensus favors safety during partition

If a five-node cluster splits 3/2, the majority side can usually continue.

The two-node side lacks quorum and cannot safely elect/commit under normal rules.

The minority being healthy does not make it authoritative.

Availability is intentionally sacrificed to preserve one history.

## Membership changes are themselves consensus problems

Adding or removing nodes changes quorum mathematics.

If membership were updated independently on each node, two groups could believe different cluster sizes and both claim majority.

Consensus systems therefore use carefully defined membership-change protocols.

Operations such as replacing several members at once should follow product guidance, not intuition.

## Consensus does not solve application semantics

A linearizable key-value store can correctly serialize:

set balance = -100.

If that value violates business policy, consensus faithfully agrees on the wrong data.

Consensus solves agreement, not domain correctness.

## Practical experiment

Run a three-node etcd or another consensus-backed local cluster if you already use one.

Observe leader identity.

Stop one follower and confirm writes continue.

Restart it.

Then stop the leader and observe election.

Finally stop two of three nodes and see that the surviving minority cannot commit writes.

Perform only in a disposable test cluster.

## The lesson to carry forward

Consensus creates one agreed history out of multiple failure-prone nodes.

The next lesson returns to request execution and asks how timeouts, retries, backoff, idempotency, and circuit breaking should work across services.
