---
title: "Fleet State, Observability, and Remote Diagnosis"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-129-fleet-state-observability-and-remote-diagnosis.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 13
excerpt: "A fleet is not a collection of identical devices; it is a distribution of hardware revisions, firmware versions, networks, uptime histories, battery states, and failures. Fleet observability turns that variation into manageable evidence."
eyebrow: "Open Systems Course · Lesson 129 of 180"
---

Ten devices can be debugged by opening ten serial consoles.

Ten thousand devices cannot.

Fleet engineering changes the unit of thinking from one device to a population.

The central question becomes:

what fraction of devices are in which state, and how does that state correlate with version, hardware, geography, network, and time?

## Inventory is the starting point

Every device record should identify non-secret operational facts such as:

device ID;
hardware revision;
manufacturing batch;
firmware version;
bootloader/security version;
tenant/owner;
provisioning state;
last seen time.

Without inventory, a firmware bug affecting hardware revision B looks random.

## Last seen is not health

A device can publish one heartbeat every minute while its sensor task is dead.

Connectivity is only one dimension.

Health can include:

- uptime;
- reset reason;
- free heap;
- task watchdog events;
- battery voltage;
- Wi-Fi RSSI;
- MQTT reconnect count;
- sensor validity;
- queue backlog;
- OTA state.

Do not collect every metric forever.

Collect the evidence needed to operate the product.

## Cardinality can explode

Metrics systems become expensive when labels contain unbounded identifiers.

Putting device_id on every Prometheus time series can create enormous cardinality.

Fleet systems often separate:

aggregate metrics for population health;
per-device event/log state for diagnosis.

Use metrics for distributions and trends.

Use device records or logs for individual history.

## Histograms show populations

Average RSSI can hide a tail of failing devices.

A distribution can show:

median;
p95;
p99;
cohorts below a threshold.

Likewise for boot time, publish latency, battery voltage, and reconnect rate.

IoT is a population problem.

Percentiles and histograms are often more useful than one global mean.

## Cohorts make regressions visible

Group devices by dimensions such as:

firmware version;
hardware revision;
region;
ISP/network type;
manufacturing batch;
OTA cohort.

Then compare failure rates.

If watchdog resets jump only on firmware 2.4, the version is a strong clue.

If only one PCB revision shows brownouts during Wi-Fi transmit, hardware becomes suspect.

Correlation does not prove causation, but it narrows hypotheses.

## Logs need rate limits

A broken device can produce thousands of identical errors per second.

Uploading every line wastes bandwidth and battery and can overwhelm ingestion.

Device logging should support:

severity;
structured event codes;
deduplication;
rate limiting;
ring-buffer retention;
upload-on-demand for detailed traces.

The fleet should remain operable when a bug makes devices noisy.

## Crash evidence is precious

When a device resets, preserve:

reset reason;
firmware build;
program counter/backtrace where available;
last important state;
uptime;
free memory;
watchdog context.

Upload after reboot when connectivity returns.

A crash that erases its own evidence becomes a recurring mystery.

## Remote commands need access control and audit

Diagnostic operations such as reboot, dump logs, change sampling rate, or start OTA are privileged actions.

Record:

who requested;
which device/cohort;
what operation;
when;
result.

Do not create a hidden remote shell simply because debugging is convenient.

Production support interfaces need narrow capabilities and strong authentication.

## Desired fleet state should be declarative

Instead of issuing thousands of imperative commands, fleet management can express policy:

cohort A should run firmware 2.5;
sampling interval should be 60 seconds;
feature flag X should be enabled.

Devices report actual state.

The control plane reconciles differences.

This desired/reported model scales better than remembering which one-off command was sent to each device.

## Practical exercise

Design a fleet dashboard for 10,000 imaginary devices.

Limit yourself to 10 top-level panels.

Choose signals that answer:

Are devices online?
Are they rebooting?
Which firmware versions exist?
Is OTA succeeding?
Are sensors valid?
Are networks unstable?
Is battery health degrading?
Which cohort changed today?

Then define the drill-down path from an aggregate anomaly to one device's evidence.

## The lesson to carry forward

Fleet management is distributed operations applied to physical devices.

The final lesson of this module follows one measurement from sensor to cloud and one command back to the actuator, connecting identity, connectivity, MQTT, telemetry, offline behavior, OTA, and observability.
