---
title: "Routers and Forwarding"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-075-routers-and-forwarding.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "A router does not know the whole future path of every packet. It selects the next hop using a forwarding table, usually by longest-prefix match, and repeats the process hop by hop."
eyebrow: "Open Systems Course · Lesson 75 of 180"
---

Your packet is going from Khulna to a server in Europe.

Does your home router know the full physical path?

Usually not.

It knows enough to choose a next hop.

That next router chooses another.

Internet forwarding is hop by hop.

## Forwarding and routing are related but different

Forwarding:

Given packet and current table, which output/next hop should be used?

Routing:

How is that table learned, configured, or computed?

A static route changes routing state.

OSPF or BGP exchanges information that influences routing state.

The forwarding plane uses resulting entries for packets.

Separating control plane from data plane will matter throughout infrastructure engineering.

## The host routes too

Before a packet reaches a dedicated router, the sending host performs route selection.

Linux has a routing table.

The host determines:

- destination is local?
- which interface?
- which next hop?
- which source address?

Then it performs local neighbor resolution and transmits the frame.

The first router is not the first component making a routing decision.

## Longest prefix match chooses specificity

Routes:

    0.0.0.0/0 -> default gateway
    10.0.0.0/8 -> tunnel A
    10.20.0.0/16 -> tunnel B

Destination 10.20.5.2 matches all three.

The /16 is most specific.

Forwarding systems use prefix-match structures optimized for high-speed lookup.

The conceptual rule is more important than implementation.

## TTL prevents infinite loops

IPv4 has Time To Live.

Routers decrement it.

If it reaches zero, the packet is discarded and an ICMP Time Exceeded message may be generated.

IPv6 uses Hop Limit for the corresponding purpose.

This prevents a routing loop from circulating a packet forever.

Traceroute-like tools exploit this mechanism to discover responding hops.

## Routers replace local frames

An Ethernet router receives:

    Ethernet frame
        contains IP packet

It removes/validates the incoming link framing, makes an IP forwarding decision, then sends the packet inside a new frame on the outgoing link.

Source and destination MAC addresses change hop by hop.

IP source and destination generally remain end-to-end unless translation or other mechanisms modify them.

This is why link and network addressing must stay separate in your mental model.

## A route can exist while the path fails

Your table says:

    default via gateway

That proves local routing configuration.

The gateway may be offline.

The ISP may lack a route.

A later link may fail.

A firewall may drop traffic.

The destination may reject transport.

A route table entry is intent/state, not proof of end-to-end reachability.

## Asymmetric routes are normal

Traffic from A to B can follow one path.

Replies from B to A can follow another.

The Internet does not require one symmetric physical path.

This complicates troubleshooting.

Packet capture at one location may see only one direction.

Stateful firewalls and NAT can be sensitive to asymmetry depending on design.

Always specify observation point.

## Exercise: read your route table

On Linux:

    ip route

Find:

- connected subnet;
- default route;
- tunnel routes if present.

For one destination, ask:

Which route has the longest matching prefix?

Which interface and next hop will be used?

Now networking is a table lookup, not a cloud icon.

## The lesson to carry forward

Routers forward packets one hop at a time using routing state.

The central model is:

    destination IP
       -> longest matching route
       -> outgoing interface / next hop
       -> local link delivery

Routing protocols later determine how larger networks learn those routes.

For now, master forwarding.
