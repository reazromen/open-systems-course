---
title: "Packet Capture: Seeing the Network Boundary"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-155-packet-capture-seeing-the-network-boundary.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 13
excerpt: "Packet capture observes what crossed a network interface. It can prove DNS answers, TCP handshakes, TLS negotiation, SIP transactions, and RTP flow, but only at the capture point where packets were actually seen."
eyebrow: "Open Systems Course · Lesson 155 of 180"
---

Application logs say what software believes happened.

Packet capture shows what crossed a network observation point.

That difference is invaluable.

## A capture is local evidence

A packet captured on client interface proves the client saw it there.

It does not prove the server saw the same packet.

A packet can be dropped later.

NAT can rewrite it.

A proxy can terminate and create a new connection.

Always label the capture point.

## Start with a narrow filter

Capturing all traffic on a busy host can create too much data and expose unrelated sensitive information.

Filter by:

host;
port;
protocol;
interface;
time window.

Capture only systems and traffic you are authorized to inspect.

## DNS capture proves the answer on the wire

A resolver log can say query succeeded.

A packet capture can show:

question;
response code;
answers;
TTL;
server.

If the application still says name resolution failed, the failure may be in a different resolver path, cache, namespace, or timing window.

## TCP handshake exposes reachability state

SYN;
SYN-ACK;
ACK.

If SYN leaves but no response arrives, the failure is different from receiving RST.

If handshake succeeds and application times out later, basic TCP establishment was not the failing boundary.

Packet flags turn “network issue” into more precise evidence.

## TLS is visible even when payload is encrypted

Modern TLS encrypts application data.

A capture can still reveal:

connection timing;
TLS record sizes;
version negotiation;
some handshake metadata;
connection closure/reset.

Without session keys you should not expect to read encrypted HTTP content.

Encryption changes observability, not connectivity.

## Retransmissions are symptoms

TCP retransmissions can indicate:

loss;
reordering;
delayed ACK behavior;
congestion;
capture artifacts.

Do not conclude “bad network” from one retransmission counter.

Correlate with RTT, loss patterns, interface errors, and captures at multiple points.

## SIP and RTP benefit from protocol-aware capture

SIP headers reveal dialog and transaction state.

RTP sequence numbers reveal loss and ordering.

If signaling is encrypted with TLS, capture at a trusted application boundary or use server logs rather than attempting to bypass encryption.

Observability should respect security boundaries.

## Capture can lie through offload

NIC features such as TCP segmentation offload and generic receive offload can make host captures look different from packets actually transmitted on the wire.

Very large “packets” in host capture can be software aggregates.

For low-level analysis, understand interface offload settings and, when necessary, capture from an independent network point.

## Practical exercise

On your own local service:

capture DNS lookup;
capture TCP connection;
send one HTTP request;
stop capture.

Then build a timeline:

DNS response;
SYN;
SYN-ACK;
ACK;
TLS/application exchange;
FIN or RST.

Compare packet timestamps with application logs.

The goal is to connect layers.

## The lesson to carry forward

Packet capture reveals network truth at one observation point.

The next lesson moves inside the host and asks where CPU time, memory, locks, and I/O are being consumed.
