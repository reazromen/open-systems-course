---
title: "Codecs, Packetization, Jitter, and Playout"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-136-codecs-packetization-jitter-and-playout.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 13
excerpt: "Voice quality emerges from codec behavior, packetization, network delay, jitter, packet loss, and receiver buffering. More buffering repairs variation but increases conversational delay."
eyebrow: "Open Systems Course · Lesson 136 of 180"
---

A call can have zero packet loss and still feel bad.

Why?

Because interactive voice is sensitive to delay and variation, not only missing packets.

Audio quality is a system result.

## A codec transforms audio representation

A codec encodes audio samples into a compressed or structured representation and decodes them at the receiver.

Different codecs trade:

bitrate;
CPU;
bandwidth;
complexity;
loss resilience;
audio bandwidth;
licensing/deployment constraints.

Examples deployed in VoIP include G.711, Opus, G.722, AMR-family codecs, and others.

The negotiated codec must be supported end to end or transcoded by an intermediary.

## Packetization groups media in time

If audio is packetized every 20 ms, each RTP packet carries roughly 20 ms of coded media.

Larger packetization reduces packet/header overhead.

It also increases the amount of audio lost when one packet disappears and can add algorithmic delay.

Small packetization lowers per-packet media duration but increases packet rate and overhead.

There is no universally best interval.

## Network jitter is variation in arrival time

Packets can be generated regularly:

0 ms;
20 ms;
40 ms;
60 ms.

But arrive:

25 ms;
41 ms;
83 ms;
84 ms.

The average path can still be fast while arrival spacing varies.

A receiver cannot play packet 3 before it arrives.

## Jitter buffers trade delay for continuity

The receiver holds packets briefly before playback.

That buffer absorbs arrival-time variation.

A larger buffer tolerates more jitter but increases mouth-to-ear delay.

A smaller buffer reduces delay but can classify late packets as unusable.

Adaptive jitter buffers try to follow network conditions.

The trade-off remains fundamental.

## Packet loss can be concealed

If one audio frame is missing, the decoder can sometimes estimate plausible replacement audio from surrounding context.

Packet-loss concealment can make small losses less audible.

It cannot reconstruct arbitrary missing speech perfectly.

Some codecs also support redundancy or in-band FEC.

Those techniques spend bitrate or complexity to improve resilience.

## Delay accumulates across layers

End-to-end conversational delay can include:

microphone/audio buffering;
codec frame accumulation;
packetization;
network queueing;
jitter buffer;
decoder;
speaker/audio pipeline.

Optimizing only IP latency can miss most of the path.

Measure where time is spent.

## Transcoding costs quality and CPU

A media server can decode one codec and encode another.

That enables interoperability.

It adds processing and can degrade quality, especially across repeated lossy transcoding.

Transcoding also consumes CPU at scale.

Codec policy is therefore capacity planning.

## MOS is an estimate, not magic truth

Mean Opinion Score originated as a human subjective quality method.

Operational systems also estimate perceptual quality from network/media parameters using standardized models.

A single MOS-like number is useful for trend detection but can hide the reason for impairment.

Keep underlying loss, jitter, RTT, codec, and playout statistics.

## Practical inspection

Take an RTP trace from a test call.

Calculate or inspect:

packet interval;
sequence gaps;
arrival jitter;
codec;
packetization time.

Then deliberately introduce delay variation in a controlled local test network.

Listen to the effect while observing jitter-buffer behavior.

Do not publish subjective results as universal thresholds.

## The lesson to carry forward

Voice quality is produced by a timing pipeline.

The next lesson attacks one of the most persistent reasons signaling and media disagree: NAT, address discovery, ICE, STUN, TURN, and SBCs.
