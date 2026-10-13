---
title: "NAT, STUN, TURN, ICE, and SBCs"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-137-nat-stun-turn-ice-and-sbcs.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 14
excerpt: "Private addresses and NAT break the assumption that signaling metadata is globally reachable. STUN discovers mapped addresses, TURN relays traffic, ICE tests candidate paths, and SBCs impose deployment policy at boundaries."
eyebrow: "Open Systems Course · Lesson 137 of 180"
---

A SIP endpoint says:

send RTP to 192.168.1.50:4000.

The far endpoint is on the public Internet.

That address is useless outside the private LAN.

This is the classic real-time media NAT problem.

## NAT changes address identity

A NAT maps private source addresses and ports to public mappings.

The endpoint often does not know the public mapping in advance.

The mapping can also change over time.

Embedding local interface addresses in SDP therefore fails when peers are separated by NAT.

## STUN discovers server-reflexive addresses

STUN lets a client send a request to a STUN server and learn the mapped public address/port observed by that server.

That discovered candidate can be useful for peer-to-peer media.

STUN is not a relay.

It does not guarantee that every NAT permits the resulting peer traffic.

## TURN relays when direct paths fail

TURN allocates a relay address on a server.

Media can flow:

endpoint A → TURN relay → endpoint B.

Relaying consumes server bandwidth and adds another media hop.

It is more expensive than direct connectivity but much more predictable across difficult NAT/firewall environments.

## ICE tests candidates instead of guessing

Interactive Connectivity Establishment gathers candidate addresses and performs connectivity checks to select a working path.

Candidate types can include:

host;
server-reflexive;
relayed.

ICE does not assume the best-looking address works.

It tests connectivity.

This is a powerful systems pattern: measure the path rather than infer it from topology.

## SIP and WebRTC use related but different ecosystems

WebRTC commonly uses ICE/STUN/TURN as core connectivity machinery.

Traditional SIP deployments often rely on SBCs, symmetric RTP, SIP Outbound, media relays, and topology-specific policy.

SIP can also use ICE when endpoints support it.

Do not assume every SIP phone implements modern WebRTC connectivity behavior.

Interoperability depends on actual capabilities.

## SBCs terminate trust and topology boundaries

A Session Border Controller can:

terminate SIP/TLS;
rewrite signaling;
anchor media;
enforce codec policy;
hide topology;
apply admission control;
normalize interoperability;
protect internal networks.

Because an SBC can become a back-to-back user agent, the call can become two SIP dialogs joined by policy rather than one end-to-end dialog.

That changes what Call-ID, Contact, SDP, and media addresses you observe on each side.

## Media anchoring solves some problems and creates a dependency

If both endpoints send RTP to the SBC/media relay, NAT traversal becomes simpler.

The relay sees and forwards both directions.

But every call now depends on relay capacity, routing, and latency.

High availability and bandwidth planning matter.

## One-way audio is a routing clue

When signaling works and one side hears nothing, inspect actual RTP flow.

Questions:

Does A send RTP?
Does SBC receive A?
Does SBC send toward B?
Does B receive it?
Does B send return RTP?

A packet capture at one boundary cannot prove the entire path.

Follow each direction separately.

## Practical inspection

On a lab or production system you administer, compare SDP before and after an SBC.

Record:

original connection address;
rewritten address;
RTP source observed on wire;
RTP destination;
NAT public mapping.

If ICE is used, record gathered candidates and selected candidate pair.

The goal is to make NAT traversal visible rather than magical.

## The lesson to carry forward

NAT breaks naive end-to-end address assumptions.

The next lesson organizes the major server roles in a telephony platform: registrar, proxy, PBX, B2BUA, SBC, media server, trunk, and PSTN gateway.
