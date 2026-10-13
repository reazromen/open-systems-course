---
title: "Telemetry: Schema, Time, Sequence, and Buffering"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-125-telemetry-schema-time-sequence-and-buffering.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "Telemetry is a data contract, not just JSON over MQTT. Useful measurements carry identity, event time, units, sequence, quality, and version information so delayed, duplicated, and out-of-order samples remain interpretable."
eyebrow: "Open Systems Course · Lesson 125 of 180"
---

An IoT device can publish:

{"temperature":31.2}

That is enough for a demo.

It is rarely enough for a durable system.

A telemetry record needs enough context to remain meaningful after it leaves the device.

## Event time and ingest time are different

Suppose a device measures temperature at 10:00, loses Internet access, and reconnects at 10:40.

If the server stores only receive time, the entire offline period appears to have happened at 10:40.

A better model records:

event_time;
ingest_time.

Event time says when the device says the measurement occurred.

Ingest time says when the server received it.

Both are useful.

## Device clocks can be wrong

An event timestamp from a device is not automatically trustworthy.

The RTC may be unset after reset.

NTP can fail.

Clock drift accumulates.

A robust telemetry system can also include:

- boot identifier;
- monotonic uptime;
- sequence number;
- clock-synchronized flag.

Then the server can distinguish wall-clock uncertainty from message ordering.

## Sequence numbers expose loss and duplicates

Suppose samples arrive:

1001, 1002, 1004, 1004, 1005.

The sequence reveals one missing sample and one duplicate.

That does not tell you why.

The missing sample could have been lost before publish, during network delivery, at the broker, or during ingestion.

But without sequence information, the gap can be invisible.

Sequence numbers turn some transport ambiguity into observable data quality.

## Units belong in the contract

Do not make one service assume Celsius while another assumes Fahrenheit.

Use a documented schema.

Options include explicit unit fields, schema-level fixed units, or standardized quantity representations.

Whichever approach is chosen, version it.

Changing the meaning of one numeric field without changing the schema version is a silent data corruption event.

## Quality flags preserve uncertainty

A sample can be:

valid;
out of calibrated range;
stale;
estimated;
sensor fault;
missing;
calibration unknown.

Telemetry should preserve this state instead of converting every failure into a numeric sentinel such as -999.

Sentinel values eventually become real-looking data in charts.

Typed quality metadata is safer.

## Payload size affects fleet cost

One JSON object is tiny.

One million devices sending one object every second are not tiny.

Data volume includes:

payload bytes;
topic/protocol overhead;
TLS and transport overhead;
broker replication;
storage indexes;
retention;
downstream processing.

Reducing frequency, batching samples, binary encodings, compression, and edge aggregation can all change cost.

Do not optimize prematurely, but calculate the scale.

## Batching trades latency for efficiency

A device can buffer 60 one-second samples and upload once per minute.

That reduces connection and protocol overhead.

It also increases latency and loss exposure if local storage fails before upload.

The correct trade depends on the use case.

Fire alarm telemetry and daily soil-moisture summaries do not have the same latency contract.

## Store-and-forward needs persistent local state

If offline buffering must survive reboot, RAM is not enough.

The device needs persistent storage and a queue format.

That introduces flash endurance and crash consistency questions.

A circular log can bound storage.

Each record can include checksum, sequence, and upload status.

Now Module 11's durability ideas are running on a microcontroller.

## Schema evolution must tolerate mixed fleets

An OTA rollout is not instantaneous.

For hours or weeks, different firmware versions can publish different schemas.

Consumers should understand the compatibility policy.

Possible rules:

- additive optional fields are safe;
- field meaning never changes in place;
- schema_version is explicit;
- old versions have a deprecation window.

Fleet protocols must assume mixed versions.

## Practical exercise

Define a telemetry schema for one environmental sensor.

Include:

device_id;
event_time;
uptime_ms;
boot_id;
sequence;
temperature_c;
humidity_percent;
quality;
firmware_version;
schema_version.

Then simulate:

- duplicate message;
- delayed message;
- missing sequence;
- clock reset;
- sensor failure;
- old firmware schema.

Write how the ingestion service should store each case.

## The lesson to carry forward

Telemetry is an evidence format for distributed measurements.

The next lesson flips direction: commands, desired state, reported state, acknowledgements, and how the cloud learns what the device actually did.
