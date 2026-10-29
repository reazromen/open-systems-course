---
title: "IP Addresses and Subnets"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-074-ip-addresses-and-subnets.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 13
excerpt: "An IP address identifies an interface in an IP topology; the prefix tells a host which destinations are on-link and which need routing. CIDR is arithmetic over address prefixes, not decorative slash notation."
eyebrow: "Open Systems Course · Lesson 74 of 180"
---

Your laptop has:

    192.168.1.20/24

What does the slash mean?

It tells the host which leading address bits form the network prefix for routing decisions.

The address alone is not enough.

The prefix length gives structure.

## IPv4 has 32 bits

An IPv4 address contains 32 bits.

Dotted decimal such as:

    192.168.1.20

is a human-readable representation of four octets.

A /24 prefix means the first 24 bits are the network prefix.

For this example:

    network: 192.168.1.0/24

Addresses sharing that prefix are ordinarily considered on the same subnet under the configured route.

## On-link versus routed is the important question

Destination:

    192.168.1.50

With 192.168.1.20/24, that destination is on the local subnet.

The host can resolve the neighbor directly.

Destination:

    192.168.2.50

does not share the /24 prefix.

The host needs a route, often through a gateway.

Subnetting therefore directly determines whether the next hop is the destination or a router.

## Masks are just another representation

IPv4 /24 corresponds to:

    255.255.255.0

The binary mask has 24 leading ones followed by zeros.

CIDR prefix notation is usually clearer.

The core operation is a bitwise prefix match.

Routers use prefix matching at much larger scale.

## Longer prefix is more specific

Routes:

    10.0.0.0/8
    10.20.0.0/16
    10.20.30.0/24

Destination:

    10.20.30.40

matches all three.

Routing normally selects the longest matching prefix, subject to route policy and implementation.

The most specific route wins among these prefix matches.

This is why one destination can match several routing-table entries without ambiguity.

## IPv6 uses 128-bit addresses

IPv6 addresses are 128 bits and commonly written in hexadecimal groups.

Example:

    2001:db8::1

IPv6 also uses prefix lengths.

A common subnet prefix is /64, though network design has additional rules and exceptions.

Do not apply IPv4 broadcast assumptions to IPv6.

IPv6 replaces several local mechanisms with multicast and Neighbor Discovery.

## Private does not mean secure

IPv4 private ranges include RFC 1918 spaces such as:

    10.0.0.0/8
    172.16.0.0/12
    192.168.0.0/16

These addresses are not globally routable in the ordinary public Internet.

That does not make traffic encrypted or authenticated.

Private addressing is an addressing/routing property.

Security requires security mechanisms.

## Overlapping subnets create routing ambiguity

Network A uses:

    10.0.0.0/24

Remote VPN also uses:

    10.0.0.0/24

Which 10.0.0.5 do you mean?

Overlapping private ranges are common in VPN and merger scenarios.

The problem is not that IP failed.

Two administrative domains chose the same address space.

Architecture needs coordination or translation.

## Exercise: calculate the next hop

Host:

    192.168.10.37/24

Gateway:

    192.168.10.1

Destinations:

    192.168.10.80
    192.168.11.80

First is on-link under /24.

Second requires a route.

Now change host prefix to /16.

Both addresses share the first 16 bits.

One configuration change changed next-hop behaviour.

## The lesson to carry forward

IP addresses do not work alone.

Prefixes define network membership and route matching.

Subnetting answers the first forwarding question:

Is the destination local, or do I send toward a router?

Once that is clear, routing stops feeling like magic.

## Interactive companion exercise

Follow source/destination IP addressing and the same-subnet versus remote-subnet decision in the [packet path explorer](../prototypes/interactive-system-design.html#network-title).
