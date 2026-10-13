---
title: "Final Project: Design One Complete Intelligent Communication System"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-180-final-project-design-one-complete-intelligent-communication-system.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 18
excerpt: "The final project connects hardware, firmware, networking, web, data, telephony, distributed systems, observability, security, and AI into one inspectable architecture. Every arrow must have a protocol, state contract, trust boundary, and failure story."
eyebrow: "Open Systems Course · Lesson 180 of 180"
---

The course began with information and state.

We moved through CPU, processes, Linux, networks, the Internet, web systems, data systems, embedded firmware, IoT, telephony, distributed systems, observability, security, and AI.

Now design one system that forces all of those layers to meet.

## The project

Build the architecture for an intelligent emergency communication device.

The device contains:

microcontroller;
sensor;
button;
microphone/speaker;
Wi-Fi;
local firmware.

It can:

send telemetry;
receive OTA updates;
place a SIP call;
stream RTP audio;
receive cloud commands;
use an AI service to summarize non-emergency diagnostic events;
expose a web dashboard;
continue essential local behavior when cloud connectivity is lost.

This is a constructed educational system, not a safety-certified product.

Do not use it as an emergency or life-safety design without appropriate professional engineering and regulatory work.

## 1. Start from physical state

Define:

which sensor is measured;
sample rate;
units;
calibration;
validity;
physical actuator/output;
safe state during reset.

Draw the path:

physics → sensor → bus/ADC → firmware → application state.

If the physical assumptions are wrong, every cloud layer inherits bad data.

## 2. Define firmware architecture

Specify:

bootloader;
A/B OTA partitions;
secure boot policy;
task structure;
interrupts;
watchdog;
persistent configuration;
offline telemetry buffer;
crash evidence.

For each task, state:

priority;
stack;
inputs;
outputs;
blocking operations.

Embedded behavior should be inspectable before networking is added.

## 3. Provision identity

Each device receives a unique identity and per-device credential.

Define:

manufacturing trust root;
enrollment;
credential storage;
rotation;
revocation;
factory reset;
ownership transfer.

Do not use one fleet-wide password.

## 4. Build connectivity as a state machine

States include:

unprovisioned;
Wi-Fi connecting;
IP acquired;
DNS ready;
TLS connected;
MQTT authenticated;
SIP registered;
offline-buffering.

Expose these states in local logs and fleet telemetry.

One Boolean called online is not enough.

## 5. Define telemetry contract

Each sample carries:

device_id;
boot_id;
sequence;
event_time;
uptime;
sensor values;
quality;
firmware version;
schema version.

The cloud stores event time and ingest time separately.

Duplicates are tolerated.

Late uploads remain historically ordered.

## 6. Define command contract

Commands carry:

command_id;
operation;
parameters;
issued_at;
expires_at;
desired version.

Device validates:

identity;
expiry;
duplicate;
local safety;
firmware capability.

Reported state includes result and freshness.

Cloud intent and physical effect are separate states.

## 7. Add MQTT infrastructure

Broker policy permits the device only:

publish its telemetry/status;
subscribe to its command namespace.

Use TLS.

Define QoS per message type.

Telemetry can tolerate some loss.

Control operations require explicit idempotency and result reporting.

## 8. Add telephony

Device registers SIP identity through the telephony edge.

Call path:

device → SBC/proxy → PBX/B2BUA → SIP trunk.

Media path:

device RTP → media relay/SBC → carrier or destination.

Record:

Call-ID mapping;
SDP;
codec;
RTP quality;
DTMF;
teardown reason.

Signaling and media have separate observability.

## 9. Add the web control plane

Operators authenticate through OIDC.

The dashboard shows:

device inventory;
connectivity state;
telemetry freshness;
firmware;
call status;
reset history.

Authorization is tenant/object specific.

A user who can view a device does not automatically get permission to issue commands or OTA.

## 10. Add data systems

Use separate storage roles:

relational database for device/config/authorization state;
time-series or analytical store for telemetry;
object storage for firmware artifacts;
cache for rebuildable hot data;
event log/queue for asynchronous jobs.

For each store, define authority, durability, backup, retention, and restore.

## 11. Add OTA

Firmware artifacts are signed.

Rollout:

internal;
canary;
small cohort;
larger cohorts.

Device writes inactive slot, verifies, boots candidate, health-checks, confirms or rolls back.

Fleet metrics automatically pause rollout when reset/connectivity regressions exceed policy.

## 12. Add distributed-system controls

Every network write gets:

deadline;
bounded retry;
idempotency where needed.

Critical database-plus-event writes use an outbox.

Service discovery and load balancing support multiple instances.

Consensus-backed stores are used only where strong shared coordination is actually required.

## 13. Add observability

Logs:
structured events and stable IDs.

Metrics:
request rate/error/duration;
MQTT connections;
telemetry freshness;
SIP call success;
RTP loss/jitter;
OTA health;
device reset cohorts.

Traces:
web/API and cloud service calls.

Packets:
targeted network diagnosis.

Device evidence:
reset reason, crash context, firmware, boot ID.

Every user-visible symptom has a path to evidence.

## 14. Add security

Threat model assets:

device control;
user accounts;
firmware signing key;
telephony identity;
customer telemetry.

Trust boundaries:

device↔cloud;
browser↔API;
service↔service;
PBX↔trunk;
CI↔signing;
operator↔admin plane.

Use least privilege.

Signing keys never live in ordinary web services.

Production admin access is short-lived and audited.

## 15. Add AI carefully

The AI service can summarize diagnostics and suggest likely troubleshooting steps.

It cannot directly:

flash firmware;
reboot fleet;
change authorization;
place external calls

without deterministic policy and explicit approval.

It receives only required telemetry/log context.

Retrieval is tenant-filtered.

Its output is advice unless a separately authorized tool workflow is invoked.

## 16. Define failure behavior

Test:

sensor disconnected;
Wi-Fi unavailable;
DNS broken;
MQTT down;
SIP trunk down;
one-way RTP;
database primary failover;
cache loss;
queue backlog;
OTA bad image;
expired certificate;
AI endpoint timeout.

For every case, answer:

what still works?
what state is authoritative?
what does user see?
what retries?
what does not retry?
what evidence is preserved?
how does recovery happen?

## 17. Define recovery

Recovery plans include:

rollback firmware;
restore database;
rotate device certificate;
fail over SIP trunk;
rebuild cache;
replay event log;
disable AI feature;
revoke compromised operator session.

Run drills.

A recovery path not exercised is not yet trustworthy.

## 18. Draw the final architecture

Your final diagram should show every major arrow.

Each arrow must have four labels:

protocol;
state contract;
trust boundary;
observability.

Example:

device → MQTT broker

protocol: MQTT 5 over TLS;
state: QoS/session/command expiry;
trust: per-device certificate + topic ACL;
observability: connect reason, publish ack, sequence, broker logs.

If an arrow cannot be labeled, the design is still vague.

## 19. Build one vertical slice

Do not build the entire architecture at once.

Build:

sensor sample → device telemetry → broker → ingestion → database → dashboard.

Then:

dashboard command → broker → device → GPIO/PWM → reported state.

Then:

SIP call.

Then:

OTA.

Then:

AI diagnostics.

Each vertical slice should be observable and testable before the next is added.

## 20. The final systems method

Across all 180 lessons, the same questions keep returning:

What is the state?
Who owns it?
How is it represented?
How does it move?
What timing matters?
What can fail independently?
What is authoritative?
What is cached or derived?
What survives a crash?
Who is trusted?
What is allowed?
What evidence exists?
How does recovery work?

Those questions are more durable than any framework or vendor.

They are the beginning of systems engineering.

## Course complete

You now have a path from one bit to a distributed intelligent communication system.

The next step is not another module.

It is to take one real system, draw every boundary, and keep asking why it works.
