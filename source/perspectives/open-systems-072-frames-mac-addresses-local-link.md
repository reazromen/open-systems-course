---
title: "Frames, MAC Addresses, and the Local Link"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-072-frames-mac-addresses-local-link.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "Before an IP packet can leave an Ethernet-like local network, it rides inside a link-layer frame addressed for the next hop. MAC addressing is local delivery state, not an Internet-wide routing system."
eyebrow: "Open Systems Course · Lesson 72 of 180"
---

Your laptop sends an IP packet to a server in another country.

The first Ethernet frame does not carry the remote server's Ethernet MAC address.

It usually carries the MAC address of the next hop on the local link, commonly your router.

This one fact fixes a lot of networking confusion.

## A frame is local transport

Ethernet carries data in frames.

A simplified frame contains ideas such as:

- destination MAC;
- source MAC;
- type/length information;
- payload;
- frame check information.

The IP packet is carried in the payload.

The frame gets the packet across this link.

At the router, the IP packet is forwarded again inside a new link-layer frame appropriate for the next link.

The Ethernet header is not carried unchanged across the Internet.

## MAC addresses identify link-layer interfaces

Ethernet uses MAC addresses for local frame delivery.

They are commonly 48-bit identifiers in ordinary Ethernet environments.

But do not treat a MAC address as a permanent global human identity.

Addresses can be:

- assigned;
- randomized;
- virtualized;
- changed;
- duplicated accidentally.

A MAC address is a networking identifier under link-layer rules.

It is not proof of who owns a device.

## Switches learn where addresses appear

An Ethernet switch receives a frame on one port.

It can learn the source MAC is reachable through that port.

Later, a frame destined for that MAC can be forwarded more selectively.

Unknown or broadcast traffic may be flooded according to switching rules.

This creates a dynamic forwarding table.

The switch is making a local forwarding decision, not an IP routing decision.

## Broadcast is local scope

Ethernet broadcast addresses allow frames to reach all relevant nodes in the broadcast domain.

Protocols such as ARP use broadcast requests in IPv4 Ethernet environments.

Broadcast does not travel arbitrarily across routers.

Routers create boundaries between IP networks.

This is why "same LAN" matters.

## VLANs create logical link boundaries

A physical switch can host multiple virtual LANs.

Traffic can be separated into distinct Layer-2 broadcast domains.

Trunks can carry tagged traffic for multiple VLANs between infrastructure devices.

One physical cable can therefore carry several logical local networks.

The link boundary is partly configuration, not only geography.

## Wi-Fi is not simply wireless Ethernet on the air

Wi-Fi has different frame formats, association, management frames, radio contention, encryption, and wireless-specific behaviour.

Bridges and access points make Wi-Fi and Ethernet interoperate at higher logical layers.

For a beginner, it is useful to say both are link technologies.

It is inaccurate to assume their over-the-air frames are identical.

## Frame checks detect some corruption

Ethernet includes a frame check sequence based on CRC.

It can detect many transmission errors.

It does not authenticate the sender.

Integrity detection and cryptographic authenticity are different properties.

Do not turn "CRC passed" into a security claim.

## Exercise: inspect local link state

On Linux:

    ip link
    ip neigh

The first shows interfaces and link-layer information.

The second shows IP-to-neighbor link-layer mappings when available.

Then ask:

Which MAC belongs to my default gateway?

Which entries are local neighbors?

None of this tells you the MAC of a remote web server across the Internet.

That is the lesson.

## The lesson to carry forward

Link-layer frames solve one-hop delivery.

MAC addresses belong to that local link context.

Routers remove one link-layer envelope and create another while forwarding the IP packet.

Once you separate:

    local next hop

from:

    remote destination

the rest of networking becomes much easier.
