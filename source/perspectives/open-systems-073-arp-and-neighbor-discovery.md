---
title: "ARP and Neighbor Discovery"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-073-arp-and-neighbor-discovery.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "A host can know the next-hop IP address and still need a link-layer destination. IPv4 ARP and IPv6 Neighbor Discovery solve that local-neighbor problem through different protocols."
eyebrow: "Open Systems Course · Lesson 73 of 180"
---

Your route table says:

    default via 192.168.1.1

Good.

Now Ethernet still asks:

What destination MAC address should carry the frame to 192.168.1.1?

For IPv4 on Ethernet-like links, ARP answers that local mapping question.

For IPv6, Neighbor Discovery performs a broader set of functions using ICMPv6.

## ARP maps IPv4 to local hardware address

A host needs to reach IPv4 address:

    192.168.1.1

If no ARP cache entry exists, it can broadcast an ARP request asking which local interface owns that protocol address.

The owner replies with its hardware address.

The host caches the result.

Now it can construct an Ethernet frame toward the next hop.

ARP is not DNS.

DNS maps names to IP addresses.

ARP maps local IPv4 neighbor addresses to link-layer addresses.

Different layer, different problem.

## ARP stays local

ARP broadcasts are not routed across the Internet.

If the final server is remote, your host ARPs for the local router, not the remote server.

The router then performs its own next-hop resolution on its outgoing link.

This is hop-by-hop link delivery underneath end-to-end IP addressing.

## Caches reduce repeated requests

Without caching, every packet could trigger a new neighbor query.

Hosts maintain neighbor/ARP state for some time.

Entries age, change, or become invalid.

This creates familiar state questions:

- How fresh is the mapping?
- Is neighbor reachable?
- Did MAC change?
- Is cache stale?

Networking is stateful even before TCP appears.

## ARP has weak trust

Classic ARP does not provide strong cryptographic authentication.

A malicious or misconfigured host on the same local network can send misleading ARP information.

This is the foundation of ARP spoofing attacks.

Switch security, network segmentation, static policy, and higher-layer encryption can mitigate risks depending on environment.

Do not use ARP as proof of device identity.

## IPv6 Neighbor Discovery is broader

RFC 4861 defines IPv6 Neighbor Discovery.

It handles functions including:

- link-layer address resolution;
- router discovery;
- neighbor reachability;
- prefix information;
- redirect information.

It uses ICMPv6 rather than ARP.

IPv6 hosts use multicast mechanisms rather than IPv4-style broadcast ARP requests.

The design is different even though one familiar job is similar.

## Neighbor state can explain strange failures

Host has an IP address.

Route exists.

DNS works.

But local gateway neighbor resolution fails.

Packets never leave correctly at Layer 2.

A high-level test may report:

    network unreachable
    timeout

The root problem is below DNS and TCP.

Tools such as:

    ip neigh

make this state visible.

## Duplicate addresses create conflict

If two hosts use the same IP address on one link, neighbor resolution can oscillate or map unpredictably.

IPv6 includes Duplicate Address Detection as part of its neighbor-discovery ecosystem.

IPv4 networks can also detect conflicts through ARP-related mechanisms, though behaviour varies.

Address uniqueness is a local network invariant.

## Exercise: clear the mental model

Destination:

    8.8.8.8

Local network:

    192.168.1.0/24

Gateway:

    192.168.1.1

Question:

Which IPv4 address does your laptop ARP for?

Normally the gateway 192.168.1.1, because 8.8.8.8 is not on the local subnet.

That one answer proves you understand next-hop resolution.

## The lesson to carry forward

Knowing an IP next hop is not enough on an Ethernet-like local link.

The host needs a link-layer destination.

IPv4 ARP and IPv6 Neighbor Discovery connect network-layer addressing to local-link delivery.

This is the bridge between route selection and frame transmission.

## Interactive companion exercise

Use the [network path explorer](../prototypes/interactive-system-design.html#network-title) to compare ARP resolution for a same-subnet destination versus the default gateway.
