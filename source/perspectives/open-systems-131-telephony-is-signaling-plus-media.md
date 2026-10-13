---
title: "Telephony Is Signaling Plus Media"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-131-telephony-is-signaling-plus-media.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "A phone call is not one protocol. Signaling establishes, changes, and ends a session; media carries audio or video; routing, identity, policy, and billing sit around both."
eyebrow: "Open Systems Course · Lesson 131 of 180"
---

A phone call feels like one thing.

Technically, it is several systems cooperating.

At minimum, separate:

signaling;
media;
identity;
routing;
policy;
transport.

In modern VoIP, SIP commonly carries signaling while RTP carries media. That separation explains many failures that otherwise seem contradictory.

## A successful call setup does not prove audio works

SIP can complete successfully:

INVITE → 100 Trying → 180 Ringing → 200 OK → ACK.

The call is established.

Audio can still fail because RTP is sent to the wrong address, a firewall blocks UDP, NAT mapping is wrong, a codec is incompatible, or an SBC rewrites media incorrectly.

This is the first telephony rule to keep:

**signaling success and media success are different observations.**

## Signaling describes intent and state

Signaling answers questions such as:

Who is calling?
Who is being called?
Where should the session be routed?
Which media formats are offered?
Has the remote side answered?
Has the call ended?

SIP is an application-layer signaling protocol for creating, modifying, and terminating sessions.

It does not itself carry the voice samples.

## Media has its own timing

Audio is delay-sensitive.

A voice stream is usually packetized into short intervals and sent continuously.

If one packet arrives late, waiting for retransmission may be worse than losing it.

That is why real-time media often uses RTP over UDP.

The application values timeliness differently from a file download.

## A PBX is a policy and call-control system

A PBX can provide:

extensions;
dial plan;
trunks;
voicemail;
queues;
recording;
conferencing;
call transfer;
routing.

It may also act as a SIP user agent, registrar, proxy-like router, or back-to-back user agent depending on architecture.

Do not reduce “PBX” to one protocol role.

## SIP addresses are not IP addresses

A SIP URI can look like:

sip:3005@example.com.

That identity does not tell you the current IP address of endpoint 3005.

Registration, location services, DNS, proxy routing, or static configuration can map the logical address to a reachable contact.

Telephony therefore has another naming/routing layer above IP.

## Real-time systems have two clocks

Signaling can tolerate hundreds of milliseconds during setup.

Media cannot tolerate the same delay continuously without becoming unusable.

A system therefore has:

call-control timing;
media packet timing.

Monitoring should separate call setup delay from RTP jitter, packet loss, and one-way delay.

## Media can bypass the PBX

In some deployments, endpoints negotiate media directly:

phone A ↔ phone B.

In others:

phone A ↔ SBC/media relay ↔ phone B.

The signaling path and media path can therefore be physically different.

This is why packet capture must be taken at the correct boundary.

## Practical inspection

On a SIP system you administer, make one test call and record:

caller URI;
callee URI;
SIP Call-ID;
INVITE time;
answer time;
selected codec;
RTP source/destination addresses;
call end reason.

Then draw signaling arrows separately from media arrows.

If they are the same path, that is an architectural result. Do not assume it in advance.

## The lesson to carry forward

A VoIP call is a distributed session with separate control and media planes.

The next lesson opens the signaling protocol itself: SIP requests, responses, transactions, dialogs, and identifiers.
