---
title: "Logs and the Journal"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-067-logs-and-the-journal.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "Logs are timestamped evidence emitted by components; the systemd journal stores structured records that can be filtered by unit, boot, process, priority, and other fields."
eyebrow: "Open Systems Course · Lesson 67 of 180"
---

A service failed at 03:14.

What happened immediately before?

Without evidence, people guess.

Logs are one source of evidence.

On systemd-based Linux systems, systemd-journald collects journal records, and journalctl queries them.

The important concept is not one command.

It is event history with context.

## A log line is an observation

Suppose:

    connection timeout to database

This tells you an application observed a timeout.

It does not automatically prove:

    database server was down

Possible causes include:

- network failure;
- DNS failure;
- overloaded database;
- firewall;
- wrong address;
- connection pool exhaustion.

A log is evidence from one observation point.

Do not upgrade it into a complete root cause.

## Timestamps create a timeline

Incident investigation needs ordering.

Application log at 03:14:02.

Kernel network change at 03:14:01.

Service restart at 03:14:03.

Database recovery at 03:14:09.

Now a causal hypothesis becomes testable.

Clock synchronization matters because logs from different machines cannot be compared confidently if their clocks drift badly.

Time is part of observability.

## Structured logs carry fields

The journal can store metadata such as:

- unit;
- PID;
- UID;
- priority;
- executable;
- boot identifier.

journalctl can filter records using fields or options such as unit and boot.

This is stronger than grepping one giant unstructured text file.

Structured context lets you narrow the evidence.

## Current boot versus previous boot

A machine crashes and restarts.

Current logs may look healthy.

The failure belongs to the previous boot.

On systemd systems, journalctl can select boot histories when persistent journal storage is available.

A useful investigation question is:

Which boot contains the incident?

Without that boundary, you can read healthy post-restart state and miss the failure entirely.

## Kernel and application logs answer different questions

Kernel messages can show:

- device events;
- filesystem warnings;
- network interface changes;
- memory pressure;
- driver faults.

Application logs show domain-level events.

A service timeout plus kernel link-down message is stronger evidence than either alone.

Cross-layer correlation is the skill.

## More logging is not automatically better

Verbose logs consume:

- disk;
- I/O;
- CPU;
- storage retention;
- operator attention.

Sensitive data can also leak into logs.

Passwords, tokens, personal data, and private payloads should not be logged casually.

Observability needs a data-minimization policy.

## A good log answers useful questions

Useful fields often include:

- timestamp;
- severity;
- component;
- request/correlation ID;
- operation;
- relevant state;
- error reason.

Avoid messages like:

    error happened

They cannot be connected to an investigation.

Also avoid writing a novel for every successful request.

Signal-to-noise matters.

## Log rotation and retention are system design

Logs grow forever unless retained intentionally.

Traditional text logs may use log rotation.

The journal has retention and storage controls.

Centralized systems may ship logs elsewhere.

A production design needs answers:

How long retained?

How much disk budget?

What happens when storage fills?

Can incident evidence survive reboot?

Logs themselves can become an outage source if unmanaged.

## Exercise: investigate one service timeline

On a systemd machine:

    journalctl -u service-name
    journalctl -b
    journalctl -k

Choose a service you own.

Find one start event.

Find its process messages.

Find relevant kernel events around the same timestamp.

Do not just read from top to bottom.

Build a timeline around a question.

## The lesson to carry forward

Logs are evidence, not truth from the universe.

They report what components observed and chose to record.

The journal adds searchable metadata and boot context.

Good debugging combines logs with metrics, traces, packet captures, and direct state inspection.

Later we will formalize that observability model.
