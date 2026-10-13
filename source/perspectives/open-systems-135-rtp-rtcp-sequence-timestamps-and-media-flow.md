---
title: "RTP and RTCP: Sequence, Timestamps, and Media Flow"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-135-rtp-rtcp-sequence-timestamps-and-media-flow.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 13
excerpt: "RTP carries real-time media with sequence numbers, timestamps, payload types, and synchronization identifiers. RTCP reports reception and timing information; neither protocol guarantees delivery."
eyebrow: "Open Systems Course · Lesson 135 of 180"
---

Once a call is established, voice becomes packets.

RTP provides structure for those packets.

It does not guarantee delivery, retransmit every loss, or establish the SIP call.

It provides timing and sequence metadata so receivers can reconstruct a real-time stream.

## RTP sequence numbers reveal ordering and loss

Each RTP packet has a sequence number.

The receiver can detect:

missing numbers;
duplicates;
reordering.

A gap indicates a packet was not observed in sequence.

It does not prove where the loss occurred.

That requires captures or counters at multiple points.

## RTP timestamps represent media time

The RTP timestamp advances according to the media clock rate, not wall-clock milliseconds.

For an 8 kHz audio clock, 160 timestamp units represent 20 ms of media.

This lets the receiver schedule playout even when network packet arrival times vary.

Sequence number answers ordering.

Timestamp answers media timing.

They are different fields for different problems.

## SSRC identifies a synchronization source

RTP uses an SSRC identifier to distinguish media sources within an RTP session.

A mixer or topology change can introduce new sources.

Do not assume one UDP 5-tuple maps permanently to one speaker identity in every conference architecture.

## Payload type connects RTP to codec mapping

The payload type field tells the receiver how to interpret payload according to static assignments or session signaling.

For dynamic values, SDP provides the mapping.

An RTP capture without its SDP can therefore be ambiguous.

## RTP usually uses UDP

Voice prefers timely arrival over perfect retransmission.

A packet that arrives hundreds of milliseconds late is often useless for live conversation.

UDP avoids head-of-line waiting from transport retransmission.

Application-level techniques such as jitter buffers, packet-loss concealment, redundancy, or FEC can handle some impairment.

## RTCP reports session quality

RTCP accompanies RTP and provides control reports.

Receiver Reports and Sender Reports can convey information such as:

packet counts;
loss fraction;
cumulative loss;
jitter estimates;
timing relationships.

RTCP does not replace packet capture.

It provides endpoint-observed quality evidence.

## Symmetric RTP is operationally common

Behind NAT, systems often learn the actual source address/port from incoming RTP and send media back there rather than trusting an unreachable private SDP address.

SBCs and media relays commonly normalize this behavior.

This is deployment behavior around RTP, not a property that makes NAT disappear.

## Silence does not always mean no RTP

Voice activity detection can suppress transmission during silence in some codecs or profiles.

Comfort noise and discontinuous transmission can change packet patterns.

A gap in packet rate may therefore be intentional.

Interpret RTP timing in context of codec and negotiated features.

## Practical inspection

Capture one test call you are authorized to analyze.

Filter one RTP SSRC.

Record:

sequence range;
timestamp step;
payload type;
packet interval;
source/destination IP and port.

Then inspect RTCP reports if present.

Compare packet loss reported by the receiver with gaps visible at your capture point.

If they differ, your capture is observing a different boundary.

## The lesson to carry forward

RTP gives real-time media enough identity and timing to be reconstructed under imperfect networks.

The next lesson explains the user-visible consequence of network variation: codecs, packetization, jitter buffers, delay, loss, and perceived audio quality.
