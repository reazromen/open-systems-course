---
title: "Follow One Device-to-Cloud-to-Device Loop"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-130-follow-one-device-cloud-device-loop.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 15
excerpt: "One IoT control loop crosses sensor physics, firmware, identity, Wi-Fi, TLS, MQTT, ingestion, storage, dashboards, command policy, broker delivery, device state, and an actuator. Each boundary has distinct evidence and failure modes."
eyebrow: "Open Systems Course · Lesson 130 of 180"
---

We can now trace a complete IoT loop.

Constructed example:

An environmental device measures room temperature.

The cloud stores the sample.

An operator changes the fan target.

The command returns to the device.

The device updates PWM and reports the new state.

No real deployment is being described.

## 1. Physics becomes data

The sensor converts temperature into an electrical or digital measurement.

Calibration and driver code produce:

temperature_c = 31.4.

The device records event time, boot ID, and sample sequence.

At this moment, nothing has reached the network.

## 2. Device identity already exists

The device was provisioned earlier.

It has:

device_id;
per-device credential;
service endpoint policy;
firmware identity.

When it connects, the service does not infer identity from IP address.

The device proves identity using the configured authentication method, commonly a certificate or another per-device credential.

## 3. Wi-Fi and IP create reachability

The radio associates.

DHCP or IPv6 configuration establishes network parameters.

DNS resolves the MQTT service.

A route exists.

TCP connects.

TLS authenticates the service and protects traffic.

MQTT authenticates/authorizes the device at the broker.

Every line is a separate state.

## 4. Telemetry is published

The device publishes to an authorized topic.

Payload:

device identity context;
event time;
sequence;
temperature;
quality;
firmware version;
schema version.

QoS policy determines delivery behavior.

If QoS 1 is used, the ingestion path must tolerate duplicates.

## 5. Broker routes, it does not understand temperature

The MQTT broker matches topic subscriptions.

It can enforce topic authorization, retain messages, preserve sessions, and route publications.

It does not inherently know that 31.4 Celsius is high.

That semantic interpretation belongs to consumers.

## 6. Ingestion validates the contract

A telemetry service validates:

device identity/topic consistency;
schema version;
field types;
event time plausibility;
sequence;
quality flags.

It stores both event time and ingest time.

Invalid data can be rejected or quarantined without poisoning the primary time series.

## 7. Data enters storage

Recent samples can go to a time-series or analytical store.

Current device state can go to a device-state database.

Raw messages may also be retained for a limited period depending on privacy/cost policy.

These are different storage roles.

One database is not automatically ideal for every query.

## 8. Fleet metrics aggregate population behavior

The fleet system updates aggregate signals:

online devices;
temperature distribution;
publish latency;
firmware cohorts;
reconnect rate.

The individual device record keeps last-seen state.

Metrics answer fleet questions.

Per-device history answers diagnosis questions.

## 9. Operator creates intent

The operator opens a dashboard and sets fan target to high.

The web API authenticates the operator and authorizes control over this device.

The server creates a command with:

command_id;
device_id;
operation;
parameters;
issued_at;
expires_at.

It records the desired state before publishing.

## 10. The command is published

The command service publishes to a topic the device is authorized to subscribe to.

The broker routes it.

If the device is offline, policy decides whether the command is queued, retained as desired state, or allowed to expire.

A command should not become immortal merely because the device was disconnected.

## 11. Device receives intent, then validates again

The MQTT client receives the command.

Firmware verifies:

command format;
target identity;
expiry;
command_id duplication;
current operating mode;
local safety conditions.

Cloud authorization does not remove the need for local safety rules.

The device can reject the command.

## 12. Application state reaches hardware

The control task sets the fan target.

A PWM peripheral updates duty cycle.

GPIO drives a motor-control interface.

The physical fan accelerates.

The business effect has now occurred.

Broker acknowledgement happened much earlier.

## 13. Reported state closes the loop

The device publishes:

command_id;
result = completed;
reported fan mode;
event time;
device sequence.

The cloud updates reported state.

Now desired and reported match.

If they do not, the dashboard can show pending, failed, stale, or overridden rather than pretending success.

## 14. Offline behavior changes the path

If the device loses network after measuring temperature, it buffers telemetry locally.

If it loses network before receiving the command, the command may expire.

When connectivity returns:

old telemetry can upload;
stale commands must not execute;
state is reconciled;
backlog drains with rate control.

Offline is a normal alternate path.

## 15. OTA changes the software in the loop

Later, firmware 2.5 is offered to a canary cohort.

The device downloads the inactive image, verifies it, boots it, runs health checks, and confirms it.

Fleet observability compares reset and connectivity rates against firmware 2.4.

If health regresses, rollout pauses and affected devices can roll back according to policy.

OTA is part of operations, not a separate feature.

## Evidence map

For one end-to-end loop, evidence can exist at:

sensor raw data;
driver status;
device sample sequence;
Wi-Fi/IP events;
TLS/MQTT connection log;
broker acknowledgement;
ingestion log;
database record;
dashboard request;
command database row;
broker command publication;
device command result;
PWM register/output;
reported state.

When a user says “the fan command did not work,” this map replaces guessing.

## Failure drill

In a test system, break one layer at a time:

bad calibration;
Wi-Fi unavailable;
DNS failure;
certificate rejection;
MQTT authorization denied;
duplicate telemetry;
storage unavailable;
expired command;
local safety rejection;
actuator driver fault.

Record exactly which evidence appears and which does not.

The visible symptom can be similar while the failure boundary changes completely.

## What Module 13 added

IoT and Device Communication connected:

measurement;
device identity;
provisioning;
Wi-Fi and TLS;
MQTT;
telemetry contracts;
command/state reconciliation;
offline-first behavior;
OTA;
fleet observability.

An IoT product is therefore not “a sensor connected to the cloud.”

It is a distributed system with physical endpoints.

## The module to carry forward

Module 14 moves into Telephony and Real-Time Media: SIP identities, registration, call setup, SDP, RTP, codecs, NAT traversal, PBX/proxy roles, call state, and one complete call trace.
