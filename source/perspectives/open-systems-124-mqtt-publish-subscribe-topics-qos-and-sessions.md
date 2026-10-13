---
title: "MQTT: Publish/Subscribe, Topics, QoS, and Sessions"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-124-mqtt-publish-subscribe-topics-qos-and-sessions.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 13
excerpt: "MQTT decouples publishers from subscribers through a broker and topic namespace. QoS, retained messages, sessions, keepalive, and duplicate delivery are protocol semantics that applications must understand."
eyebrow: "Open Systems Course · Lesson 124 of 180"
---

MQTT is popular in IoT because it solves a useful problem with relatively small protocol overhead:

many devices need to publish and receive messages without knowing the network address of every other participant.

A broker sits in the middle.

Publishers send messages to topics.

Subscribers express interest in topic filters.

The broker routes messages according to those subscriptions.

## Topics are names, not queues

A topic might look like:

devices/123/telemetry/temperature

or:

tenants/acme/devices/123/commands

Topics form a hierarchical UTF-8 namespace.

They do not automatically create persistence, authorization, schema, or ordering guarantees beyond what the MQTT protocol and broker configuration provide.

Topic design is part of application architecture.

A device should not be able to subscribe to every other tenant merely because it knows the topic name.

## Publish/subscribe decouples endpoints

The publisher does not need to know which subscribers exist.

The subscriber does not need to know which device process generated the message.

That allows:

device → broker → storage service;
device → broker → alerting service;
device → broker → dashboard.

One publication can feed several consumers.

This is temporal and spatial decoupling, but the broker becomes shared infrastructure.

## QoS 0 is at most once delivery

QoS 0 sends a PUBLISH without MQTT-level acknowledgement.

If the connection fails, the message can be lost.

This is appropriate for telemetry where the next sample will arrive soon and loss of one point is acceptable.

It is not appropriate merely because it is fastest.

The business semantics should choose the QoS.

## QoS 1 is at least once

QoS 1 uses acknowledgement so the sender can retransmit when delivery acknowledgement is not observed.

The receiver may therefore see duplicate PUBLISH messages.

Applications must tolerate that.

For telemetry, duplicates can be removed by message ID, timestamp, or sample sequence where the application defines such identity.

For commands that trigger external effects, idempotency becomes critical.

## QoS 2 reduces duplicate delivery at protocol level

MQTT QoS 2 uses a multi-step handshake to provide exactly-once delivery semantics between MQTT peers under the protocol model.

That stronger protocol exchange costs additional messages and state.

It still does not magically create exactly-once business effects outside the broker/client protocol.

If a consumer receives a command, changes a physical actuator, and crashes before recording its own business completion, application-level recovery is still required.

Protocol delivery and real-world effect are separate.

## Retained messages represent last known publication

A retained publication lets the broker store the latest retained message for a topic and deliver it to new matching subscribers.

This is useful for state-like topics.

It is dangerous when confused with event history.

A retained message says something like:

latest retained state for this topic.

It does not provide an audit log of every previous event.

## Sessions preserve subscription state

MQTT sessions can preserve subscriptions and queued messages across reconnects depending on protocol version and session settings.

This helps intermittently connected devices.

It also creates server-side state per client.

Client identifiers therefore matter.

Two devices accidentally using the same client identifier can disrupt each other's sessions.

## Keepalive detects dead peers

MQTT keepalive limits the interval during which the client can remain silent without sending control traffic.

PINGREQ/PINGRESP can maintain liveness when no publications are flowing.

A successful TCP connection does not prove the remote application is still processing messages.

Application-level keepalive closes that gap.

## Last Will and Testament is a failure signal

A client can register a Will message with the broker.

If the broker detects an ungraceful disconnect, it can publish that Will.

This can support presence-like state:

device/123/status = offline.

But network partitions create ambiguity.

The device may still be operating locally while the broker declares it offline.

Presence means “broker lost the MQTT session,” not necessarily “device has no power.”

## MQTT 5 adds richer metadata

MQTT 5 includes features such as reason codes, message expiry, response topics, correlation data, user properties, and improved session controls.

These can reduce the need for application-specific framing around common messaging patterns.

Still, every field should serve a clear contract.

Do not turn MQTT properties into an undocumented second schema.

## Authorization belongs at topic boundaries

A secure broker policy can grant device 123:

publish devices/123/telemetry/#;
subscribe devices/123/commands/#.

It should not grant wildcard access to all devices unless the role requires it.

Identity from TLS or another authentication mechanism should map to broker authorization.

Topic naming alone is not security.

## Practical experiment

Run a local MQTT broker you control.

Use two clients.

Subscribe one client to a telemetry topic.

Publish with QoS 0 and QoS 1.

Disconnect the subscriber, publish more messages under different session settings, reconnect, and observe what arrives.

Then publish a retained state and connect a new subscriber.

The goal is to observe protocol semantics rather than memorize flags.

## The lesson to carry forward

MQTT creates a brokered publish/subscribe fabric with explicit delivery and session semantics.

The next lesson focuses on what the messages should contain: telemetry schema, time, sequence, quality, buffering, and data volume.
