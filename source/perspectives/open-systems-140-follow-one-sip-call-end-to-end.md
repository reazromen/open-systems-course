---
title: "Follow One SIP Call End to End"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-140-follow-one-sip-call-end-to-end.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 16
excerpt: "A complete VoIP call crosses registration, identity, proxy routing, authentication, SDP negotiation, NAT traversal, RTP, codec timing, PBX policy, trunking, and teardown. Following one Call-ID reveals the control plane; following RTP reveals the media plane."
eyebrow: "Open Systems Course · Lesson 140 of 180"
---

Now trace one complete call.

Constructed example:

Extension 3005 calls an external number through a PBX and SIP trunk.

The phone is behind NAT.

The PBX uses an SBC/media relay at the public boundary.

## 1. The phone registers

Endpoint 3005 sends REGISTER.

The registrar authenticates it and stores:

AOR sip:3005@example.com;
Contact;
source flow;
expiry.

This creates inbound reachability state.

No call exists yet.

## 2. The user dials

The phone converts digits into a SIP request URI according to its dial plan or local rules.

It sends INVITE with:

From;
To;
Call-ID;
CSeq;
Contact;
Via;
SDP offer.

The SDP proposes audio codecs and a media address.

## 3. Edge/SBC receives the call

The SBC authenticates or trusts the endpoint-side flow according to policy.

It can normalize headers, hide topology, rewrite SDP, and anchor media.

If it behaves as a B2BUA, it creates a separate dialog toward the PBX.

Now there can be two Call-IDs or dialog identities on different sides.

## 4. PBX applies dial-plan policy

The PBX decides:

is extension 3005 allowed to call this destination?
how should the number be normalized?
which trunk should be used?
which caller identity is presented?
are recording or routing policies applied?

This is business routing, not IP routing.

## 5. Trunk-side INVITE leaves the domain

The PBX or SBC sends a new INVITE toward the carrier.

DNS, static trunk routes, TLS, or IP authentication determine reachability.

The carrier can send:

100 Trying;
183 Session Progress;
180 Ringing;
final success or failure.

Early media can begin during provisional signaling if SDP establishes it.

## 6. SDP offer/answer settles media parameters

Across one or more B2BUA boundaries, each leg negotiates codecs and media addresses.

The PBX may keep one codec end to end.

It may transcode between different codecs.

The selected payload type mapping belongs to each RTP leg.

Do not assume payload number has identical meaning across a transcoder.

## 7. RTP starts

Phone sends RTP to the SBC/media relay.

Relay sends RTP toward PBX/carrier side.

Reverse media returns through corresponding paths.

The signaling path may be:

phone → SBC → PBX → carrier.

The media path may be:

phone → SBC media relay → carrier media gateway.

Different topology, same user call.

## 8. NAT is hidden by maintained flows and media anchoring

The phone's private address is not globally reachable.

Its SIP signaling uses an outbound flow.

Its RTP reaches the public relay from a NAT mapping.

The relay can send return media to the observed/negotiated reachable address.

NAT is handled by architecture, not by pretending private addresses are public.

## 9. Codec and jitter buffer create the audible stream

RTP sequence numbers reveal ordering.

Timestamps define media time.

The receiver buffers enough packets to absorb network jitter.

Decoder turns payload into audio.

A packet that arrives too late can be discarded even though IP eventually delivered it.

## 10. RTCP reports quality

Endpoints or relays can exchange RTCP reports.

These expose receiver-observed loss and jitter.

PBX/SBC metrics can correlate those values with call identifiers.

Quality monitoring should keep both signaling outcome and media health.

## 11. DTMF uses the negotiated mechanism

When the caller presses a digit, the system may send RFC 4733 telephone-event RTP.

The IVR detects the event.

If SDP negotiation omitted or mismatched telephone-event parameters, audio can work while DTMF fails.

That is another example of a partial-success call.

## 12. Call teardown identifies the initiator

Suppose the remote party hangs up.

Carrier sends BYE toward the PBX.

The B2BUA terminates its internal dialog and sends BYE toward the phone.

Each leg has its own transaction.

The phone returns 200 OK to BYE.

RTP stops.

Call-detail and billing systems finalize records.

## 13. One trace is not enough when B2BUAs exist

A packet capture at the phone side proves phone↔SBC behavior.

It does not show the trunk-side Call-ID if the SBC replaces it.

Operators need correlation identifiers, timestamps, or mapping logs across call legs.

Without correlation, a B2BUA can make one human call appear as unrelated SIP dialogs.

## Evidence map

For one call, preserve:

registration contact;
endpoint IP/transport;
Call-ID on each leg;
From/To;
final SIP response;
SDP offer/answer;
codec;
RTP endpoints;
SSRC;
packet loss/jitter;
trunk route;
teardown initiator;
duration;
server reason.

This is enough to answer most first-order call questions without guessing.

## Failure drill

Break one controlled layer at a time:

remove registration;
reject authentication;
route to nonexistent trunk;
offer incompatible codec;
block RTP one direction;
expire NAT mapping;
stop media relay;
trigger session timer failure.

Observe what changes in SIP and RTP.

The visible symptom “call failed” becomes a precise boundary.

## What Module 14 added

Telephony and Real-Time Media connected:

SIP signaling;
registration;
transactions/dialogs;
SDP offer/answer;
RTP/RTCP;
codecs;
jitter;
NAT traversal;
SBC/PBX roles;
call failure analysis.

A call is a distributed real-time system.

## The module to carry forward

Module 15 generalizes these ideas beyond telephony into Distributed Systems and Cloud Architecture: partial failure, replication, consistency, coordination, retries, discovery, partitioning, distributed transactions, and one complete cross-service request.

## Interactive companion exercise

Follow a simplified SIP call from INVITE and SDP negotiation through ACK, RTP media, and BYE in the [end-to-end call-flow companion](../prototypes/interactive-system-design.html#sip-title). Registration is assumed complete and proxy Record-Route is assumed.
