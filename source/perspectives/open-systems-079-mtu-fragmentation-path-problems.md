---
title: "MTU, Fragmentation, and Path Problems"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-079-mtu-fragmentation-path-problems.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 13
excerpt: "Every link has a maximum packet size it can carry. Path MTU is the smallest limit along the route; when endpoints ignore it, small packets can work while larger transfers stall."
eyebrow: "Open Systems Course · Lesson 79 of 180"
---

Ping works.

TCP handshake works.

Small response works.

A larger transfer stalls.

One possible explanation is a path-MTU problem.

MTU means Maximum Transmission Unit: the largest packet a link can carry at the relevant network layer without requiring additional fragmentation or link-specific handling.

The end-to-end path is constrained by the smallest relevant link MTU.

## One path, several limits

Imagine:

    link A: 1500
    tunnel: effective 1400
    link B: 1500

The path cannot safely carry a 1500-byte inner packet through the 1400-byte tunnel without adaptation.

The limiting value is not bandwidth.

It is packet size.

## IPv4 fragmentation

Classic IPv4 permits fragmentation in the network when a router encounters a smaller outgoing MTU unless the packet is marked not to fragment.

Fragments are reassembled at the destination.

Fragmentation creates overhead and makes packet loss more costly because losing one fragment can invalidate the whole reassembled packet.

Modern stacks prefer avoiding unnecessary fragmentation when possible.

## IPv6 changes the rule

IPv6 routers do not fragment packets in transit.

RFC 8200 defines a minimum IPv6 link MTU of 1280 octets and expects endpoints to adapt packet sizes, including through Path MTU Discovery where implemented.

If a router cannot forward an oversized IPv6 packet, ICMPv6 Packet Too Big feedback is part of the mechanism used to inform the sender.

Blocking all ICMPv6 can therefore break valid network behaviour.

## TCP MSS is related but different

TCP Maximum Segment Size describes how much TCP payload an endpoint can receive in one segment.

MTU applies at the IP/link boundary.

MSS applies to TCP payload sizing.

Headers consume part of the packet budget.

Tunnels consume more.

A rough IPv4/TCP example with no options:

    MTU 1500
    minus IP header 20
    minus TCP header 20
    gives MSS 1460

Real headers, options, and tunnels can change this.

## Why small probes can mislead

Suppose the path allows 1300-byte packets.

A small ICMP echo succeeds.

The TCP handshake uses small packets and succeeds.

Then the application sends a larger segment.

If needed MTU feedback is lost or filtered, the large packet may repeatedly fail.

RFC 8201 discusses this class of failure in the context of Path MTU Discovery.

The key symptom is selective failure by packet size.

It is a hypothesis, not a diagnosis by itself.

## Tunnels consume packet budget

VPNs and overlays add encapsulation.

Examples include WireGuard, IPsec, GRE, VXLAN, and other tunnels.

Every outer header reduces space available to the inner packet when the physical link MTU stays fixed.

Nested encapsulation can compound the reduction.

Virtual networking still sits on physical packet-size constraints.

## Path MTU can change

Routing is dynamic.

A new path may include a smaller link.

A mobile device may move between networks.

A tunnel may appear or disappear.

Cached path information therefore has a lifetime.

Transport implementations must be able to adapt.

## Exercise: reason about one tunnel

Outer-link MTU:

    1500 bytes

Tunnel overhead:

    60 bytes

Approximate maximum inner packet:

    1440 bytes

If inner IPv4 plus TCP headers consume 40 bytes:

    approximate TCP payload = 1400 bytes

This is a constructed arithmetic example, not a configuration recommendation.

The purpose is to show that encapsulation uses space.

## The lesson to carry forward

Packet size is part of network compatibility.

Path MTU is constrained by the smallest usable link along the route.

When tunnel overhead or ICMP feedback is mishandled, connectivity can fail selectively.

Do not test a path only with tiny packets.

Sometimes size is the variable.

## Interactive companion exercise

Change payload size and path MTU in the [network path explorer](../prototypes/interactive-system-design.html#network-title) to compare TCP segmentation with the caveats around oversized UDP datagrams, IPv4 fragmentation, and PMTUD.
