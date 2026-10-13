---
title: "Recovery: Rollback, Restore, Failover, and Fault Injection"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-159-recovery-rollback-restore-failover-and-fault-injection.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 13
excerpt: "Recovery is a feature that must be designed and exercised. Rollback, restore, failover, graceful degradation, and controlled fault injection turn theoretical resilience into measured capability."
eyebrow: "Open Systems Course · Lesson 159 of 180"
---

A backup is not a recovery.

A rollback script is not a rollback until it has been used successfully.

A replica is not failover until promotion and traffic movement are tested.

Resilience exists only when recovery paths work.

## Rollback reverses code or configuration

A deployment rollback returns to a known previous artifact or configuration.

It is easiest when:

artifacts are immutable;
old versions remain available;
database/schema changes are backward compatible;
feature flags isolate new behavior.

If a new version performed irreversible data migration, binary rollback may not restore service.

Deployment and schema strategy must align.

## Restore reconstructs state

Backup restore answers:

can we recreate usable data after loss or corruption?

Test restore into an isolated environment.

Verify:

schema;
row counts;
application queries;
permissions;
encryption keys;
object-store references;
point-in-time target.

A backup file existing in storage is not enough.

## Failover changes authority

Failover promotes or redirects to a redundant component.

Examples:

database replica promotion;
secondary region;
alternate SIP trunk;
secondary DNS provider;
backup broker.

Failover needs fencing so the old authority cannot return and create split brain.

It also needs client reconnection behavior.

## Graceful degradation preserves core function

If recommendation service fails, checkout may still work.

If cloud is unavailable, an IoT controller may continue local control.

If media recording fails, policy may allow call completion or may require call rejection depending on compliance.

Define which dependencies are hard and which are optional.

Degradation should be intentional.

## Feature flags can be recovery controls

A feature flag can disable a failing code path without full rollback.

That makes flags part of the control plane.

They need:

authorization;
audit;
safe defaults;
dependency awareness;
cleanup after use.

A forgotten emergency flag can become permanent hidden architecture.

## Fault injection validates assumptions

Controlled experiments can stop a dependency, add latency, kill a process, or simulate packet loss in a test/staging environment.

The goal is not chaos for entertainment.

It is to test a hypothesis:

if Redis is unavailable, requests should fall back to database within 200 ms;
if one replica dies, writes should continue;
if MQTT is unreachable, device should buffer locally.

The expected outcome must be written before the fault.

## Game days test humans too

A recovery drill reveals:

missing permissions;
stale runbooks;
unknown owners;
DNS TTL surprises;
expired credentials;
backup restore time;
monitoring gaps.

Those are system properties even though they involve people.

## Practical exercise

Choose one service.

Define three recovery paths:

bad deployment;
database corruption;
dependency outage.

For each, document:

trigger;
decision owner;
commands/actions;
expected duration;
validation;
abort condition.

Then rehearse one path in a safe environment.

Measure actual recovery time.

## The lesson to carry forward

Recovery is an engineered path, not a hopeful plan.

The final lesson of this module combines all evidence types to diagnose one multi-layer failure.
