---
title: "TCP: Reliable Byte Streams"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-077-tcp-reliable-byte-streams.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 14
excerpt: "TCP turns an unreliable packet network into an ordered reliable byte-stream abstraction using sequence numbers, acknowledgments, retransmission, flow control, and congestion control."
eyebrow: "Open Systems Course · Lesson 77 of 180"
---

An application writes:

    hello world

across a TCP socket.

The network underneath can:

- drop packets;
- duplicate packets;
- reorder packets;
- delay packets.

Yet the receiving application normally reads an ordered byte stream.

TCP is the machinery creating that abstraction.

RFC 9293 is the current consolidated TCP specification.

## TCP is a byte stream

This is the first rule to internalize.

Application writes:

    write 5 bytes
    write 5 bytes

Receiver is not guaranteed to read:

    5 bytes
    5 bytes

It may read:

    10 bytes

or:

    3 + 7

or other segmentations.

TCP preserves byte order.

It does not preserve application message boundaries.

Your protocol must define framing.

## Sequence numbers order bytes

TCP numbers positions in the byte stream.

The receiver can determine:

- which data arrived;
- what is missing;
- what is duplicate;
- how data should be ordered.

Acknowledgments tell the sender which stream progress has been received according to TCP semantics.

When data appears lost, retransmission can occur.

Reliability is a state machine over sequence space and timers.

## Connection setup synchronizes state

TCP begins with a handshake.

The familiar simplified form:

    SYN
    SYN-ACK
    ACK

establishes connection state and synchronizes initial sequence information.

The handshake proves transport setup between endpoints.

It does not prove the application above TCP is healthy.

A port can accept TCP while the application later returns an error.

Layer contracts remain separate.

## Flow control protects the receiver

The receiving application may consume data slowly.

TCP advertises receive-window information so the sender knows how much data the receiver can currently accept.

This is flow control.

It protects the receiver.

Congestion control is different.

That protects the network path from excessive sending.

Two different limits.

## Congestion control adapts to the network

Packets are lost or delayed because paths have finite capacity.

TCP implementations use congestion-control algorithms to adjust sending rate.

The specific algorithms evolve and vary.

The architectural principle is stable:

A sender cannot assume the network can absorb unlimited data.

Transport must react to congestion evidence.

## Head-of-line blocking follows ordering

Suppose later TCP bytes arrive while one earlier segment is missing.

The receiver cannot deliver the later bytes as an ordered stream beyond the missing gap.

It waits for recovery.

This is head-of-line blocking.

For many applications, ordered reliability is exactly what they want.

For multiplexed independent streams, this can become undesirable.

QUIC addresses some of these constraints differently.

## A TCP connection is state

Each endpoint tracks:

- sequence numbers;
- acknowledgment state;
- windows;
- timers;
- connection state;
- retransmission information.

A firewall or NAT can also track flow state.

Restart one endpoint.

The peer may temporarily believe an old connection still exists.

TCP is not just packet format.

It is distributed state between endpoints.

## Close is a protocol too

One side can finish sending while still receiving.

TCP supports half-close semantics.

FIN participates in orderly shutdown.

RST represents abrupt reset conditions.

Application developers who treat socket close as "connection vanished instantly everywhere" can misread traces.

Shutdown is another state transition.

## Exercise: prove TCP has no messages

Write a TCP sender that writes:

    ABC
    DEF

in separate calls.

Write a receiver that calls read with different buffer sizes.

Observe that application write boundaries do not necessarily match receive boundaries.

Then add explicit framing:

    length + payload

Now the application protocol can reconstruct messages.

## The lesson to carry forward

TCP creates a reliable ordered byte-stream abstraction over IP.

It uses:

- sequence numbers;
- acknowledgments;
- retransmission;
- flow control;
- congestion control;
- connection state.

That is a lot of machinery so applications can pretend they have one continuous stream.

Respect the abstraction, but remember what it does not provide: message framing, application success, security, or user-level meaning.
