---
title: "UDP: A Minimal Transport"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-076-udp-minimal-transport.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 11
excerpt: "UDP adds ports, length, and checksum semantics over IP while preserving datagram boundaries. It does not provide reliable delivery, ordering, congestion recovery, or a connection state machine."
eyebrow: "Open Systems Course · Lesson 76 of 180"
---

An application has a message.

It wants to send one datagram to another application.

It does not want the transport layer to create a reliable ordered byte stream.

UDP is the Internet transport designed around that smaller contract.

RFC 768 is remarkably short because UDP deliberately does less.

## UDP adds application endpoints

IP gets the packet to a host or interface.

UDP adds:

- source port;
- destination port.

This lets the receiving operating system deliver the datagram to the appropriate socket.

One host can run many UDP applications at the same IP address because ports distinguish transport endpoints.

## Datagram boundaries are preserved

Send one UDP datagram containing 100 bytes.

The receiver reads one datagram boundary.

Send two 50-byte datagrams.

They remain two transport messages.

This differs from TCP, which exposes an ordered byte stream without preserving application message boundaries.

Applications over TCP must define framing.

UDP already has datagram framing.

## Delivery is not guaranteed

UDP does not guarantee:

- arrival;
- order;
- duplicate suppression;
- retransmission;
- flow control;
- congestion control.

That does not mean UDP is "unreliable junk."

It means those properties are not provided by UDP itself.

An application can add whatever reliability semantics it needs.

Protocols such as QUIC build sophisticated reliable transport over UDP while controlling their own loss recovery and congestion behaviour.

## Checksum detects corruption

UDP includes a checksum covering transport data and parts of the IP addressing context.

In IPv4, a zero UDP checksum can indicate no checksum under historical rules.

IPv6 requires UDP checksum use in ordinary cases, with narrowly defined exceptions in later specifications.

The point is:

Checksum helps detect corruption.

It does not provide retransmission.

Detection and recovery are different mechanisms.

## Why choose UDP?

Real-time audio can prefer timely newer media over retransmitting old audio that would arrive too late.

DNS historically uses UDP for many queries because one request/response can fit the datagram model, while also supporting TCP and newer encrypted transports when needed.

Telemetry protocols may use UDP when application-level loss tolerance exists.

The choice depends on semantics.

Do not select UDP merely because someone said it is faster.

## UDP can still congest a network

No built-in congestion control does not mean congestion disappears.

An application that sends UDP faster than the path can carry it can cause:

- packet loss;
- queue buildup;
- unfairness;
- network collapse.

Responsible UDP-based protocols implement appropriate rate/congestion behaviour.

Transport omission moves responsibility upward.

## NAT and firewalls create state around stateless-looking UDP

UDP itself has no TCP-style connection handshake.

Middleboxes often create temporary flow mappings after observing UDP traffic.

Those mappings expire.

A real-time application may send keepalives or use traversal protocols to preserve reachability.

The transport is simple.

The network environment is not.

## Exercise: send one datagram

On two local processes, use a safe UDP test tool such as netcat if available.

Receiver:

    nc -u -l 9999

Sender:

    echo hello | nc -u 127.0.0.1 9999

Observe with packet capture if desired.

Then stop receiver and send again.

The sender may not immediately know nobody consumed the datagram.

That uncertainty is part of UDP's contract.

## The lesson to carry forward

UDP provides a small transport abstraction:

    ports + datagrams + checksum

It does not promise reliable ordered delivery.

That simplicity is valuable when applications want their own timing or recovery semantics.

The question is not "UDP or TCP, which is better?"

It is:

Which transport contract matches the application?
