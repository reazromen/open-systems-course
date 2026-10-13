---
title: "Registrar, Proxy, PBX, B2BUA, SBC, and Media Server"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-138-registrar-proxy-pbx-b2bua-sbc-and-media-server.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 14
excerpt: "Telephony platforms contain distinct control and media roles. A registrar stores contacts, a proxy routes SIP, a B2BUA terminates dialogs, an SBC enforces borders, and a media server handles audio resources."
eyebrow: "Open Systems Course · Lesson 138 of 180"
---

Telephony diagrams often draw one box labeled PBX.

Inside that box can be half a dozen protocol roles.

Understanding those roles makes architecture portable across Asterisk, FreeSWITCH, OpenSIPS, Kamailio, commercial SBCs, and carrier platforms.

## Registrar stores location bindings

The registrar processes REGISTER and maintains mappings from address-of-record to Contact.

It answers:

where is this identity currently registered?

It does not inherently have to process media.

## Proxy routes SIP requests

A SIP proxy receives a request, applies routing logic, and forwards it.

It can be stateless or stateful.

Stateful proxying tracks transaction state and can handle forking and response correlation.

A proxy normally preserves the end-to-end dialog identity more directly than a B2BUA.

## B2BUA creates two call legs

A Back-to-Back User Agent behaves as a user agent server toward one side and a user agent client toward the other.

It terminates one dialog and creates another.

This gives strong control over:

headers;
SDP;
routing;
billing;
features;
interoperability.

PBX systems frequently act as B2BUAs.

The cost is more state and less end-to-end transparency.

## PBX is a product role

A PBX provides business telephony behavior:

extensions;
dial plan;
trunks;
queues;
voicemail;
conferences;
transfer;
recording.

It can implement those features using B2BUA behavior, media services, databases, and routing logic.

“PBX” describes the system purpose more than one standards-defined SIP role.

## SBC is a boundary role

An SBC sits at a trust/network boundary.

It often provides:

topology hiding;
NAT traversal;
TLS/SRTP policy;
media anchoring;
codec normalization;
DoS protection;
admission control;
interoperability fixes.

An SBC can overlap with proxy and B2BUA functions.

The architectural question is not the product label; it is which signaling and media state the component terminates.

## Media server handles audio work

A media server can:

play prompts;
record;
mix conferences;
transcode;
detect DTMF;
bridge streams;
generate tones.

This is CPU- and bandwidth-sensitive work.

Separating call routing from media processing can scale large systems more cleanly.

## SIP trunks connect administrative domains

A SIP trunk connects the enterprise or platform to another telephony provider/domain.

The trunk can have:

IP authentication;
digest credentials;
TLS certificates;
registered or static routing;
codec policy;
number-format rules;
concurrency limits.

Trunk failure is not the same as extension-registration failure.

They are different borders.

## PSTN gateways translate network worlds

When a call reaches the traditional telephone network, gateways translate between SIP/RTP and carrier signaling/media systems.

Number routing, E.164 formatting, caller identity, emergency calling, lawful requirements, and carrier interconnect policy enter the architecture.

VoIP does not erase the PSTN; it often terminates into it.

## Separate control from media scaling

A proxy can route thousands of calls while carrying no RTP.

A media server can be saturated by transcoding with relatively few control messages.

Capacity planning therefore needs separate metrics:

calls per second;
concurrent dialogs;
registrations;
RTP sessions;
codec/transcoding CPU;
media bandwidth.

One number called concurrent calls can hide the real bottleneck.

## Practical architecture exercise

Draw a system with:

phones;
registrar/proxy;
PBX/B2BUA;
SBC;
media server;
SIP trunk;
PSTN.

For each arrow, label:

SIP transport;
RTP path;
TLS/SRTP;
NAT boundary;
identity used;
logs/metrics.

Then remove the media server and ask which features stop working.

Remove the registrar and ask which inbound routes fail.

The diagram should explain roles, not brands.

## The lesson to carry forward

Telephony platforms are compositions of signaling and media roles.

The next lesson focuses on call-state failures: retransmissions, timeouts, CANCEL/BYE, busy responses, session timers, and how to identify who ended a call.
