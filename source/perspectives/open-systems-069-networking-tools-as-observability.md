---
title: "Networking Tools as Observability"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-069-networking-tools-as-observability.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 13
excerpt: "Linux network tools answer different questions: addresses and routes, sockets, DNS, ICMP reachability, HTTP behaviour, and packet paths. No single tool proves the network is healthy."
eyebrow: "Open Systems Course · Lesson 69 of 180"
---

"The network is broken."

That sentence is too large to debug.

Linux gives us tools that observe different layers.

The skill is not memorizing commands.

It is choosing the tool that can answer the current question.

## ip: what does this host believe about interfaces and routes?

Useful examples:

    ip addr
    ip link
    ip route

Questions:

- Which addresses are assigned?
- Is the interface up?
- Which route will be used?
- What is the default gateway?

If a machine has no route to the destination, HTTP debugging is premature.

Start lower.

## ss: what sockets exist?

The Linux ss utility reports socket statistics and can expose listening and connected TCP, UDP, and Unix sockets.

Examples:

    ss -ltn
    ss -tpn

Questions:

- Is service actually listening?
- On which address?
- Which port?
- Are connections established?
- Are queues growing?

A process can be alive while no socket listens.

Service health and socket state are different evidence.

## ping: can ICMP echo traverse this path?

ping sends ICMP Echo Request messages and measures replies when allowed.

A successful ping can show some IP reachability.

A failed ping does not prove the destination is completely unreachable.

Firewalls can block ICMP while TCP service works.

Networks can rate-limit or deprioritize echo.

Use ping as one probe, not universal truth.

## DNS tools answer a name question

A hostname fails.

Try resolving it with tools such as:

    dig
    resolvectl

Question:

Does this resolver produce the expected address?

If DNS fails, connecting to an IP may still work.

That difference separates naming from reachability.

Always distinguish:

name resolution

from:

network connection.

## curl answers an application-protocol question

curl can make HTTP requests and expose:

- DNS timing;
- connection timing;
- TLS details;
- response headers;
- status codes.

A successful TCP connection can still produce HTTP 500.

A valid HTTP response can still contain wrong application data.

Each layer requires its own evidence.

## traceroute-like tools reveal path hints

Tools such as traceroute or tracepath infer intermediate hops using TTL or hop-limit behaviour.

They can reveal where responses stop or path MTU information depending on tool.

But routers may filter, rate-limit, or answer asymmetrically.

The displayed path is an observation under one probe method.

It is not a perfect map of all traffic behaviour.

## tcpdump and Wireshark observe packets

When high-level tools disagree, packet capture can show what actually crossed an interface:

- ARP/neighbor discovery;
- DNS queries;
- TCP handshake;
- retransmissions;
- TLS packets;
- resets.

A capture location matters.

Seeing a packet leave one interface does not prove it arrived at the destination.

Always record where and when capture occurred.

## Build a diagnostic ladder

For:

    https://example.com

ask:

1. Interface has address?
2. Route exists?
3. Name resolves?
4. Transport connection succeeds?
5. TLS succeeds?
6. HTTP response succeeds?
7. Application content correct?

Move only as deep as evidence requires.

This is systems troubleshooting.

## Exercise: test localhost service

Run a harmless local HTTP server you own.

Observe:

    ss -ltn

Then request it with curl.

Stop server.

Repeat both.

You should see the difference between:

port listening

and:

connection refused.

The network stack becomes observable state.

## The lesson to carry forward

Network tools are sensors.

Each observes one boundary.

No command proves "the Internet works."

Use them to replace broad claims with smaller questions.

The next modules will explain the protocols those tools expose.
