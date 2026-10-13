---
title: "Commands, Desired State, and Reported State"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-126-commands-desired-state-and-reported-state.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "Sending a command is not the same as changing a device. IoT control needs explicit command identity, acknowledgements, desired state, reported state, conflicts, expiry, and safe retry behavior."
eyebrow: "Open Systems Course · Lesson 126 of 180"
---

A dashboard button says:

Turn relay on.

The server publishes a message.

Has the relay turned on?

Not yet.

The system has only expressed intent.

Distributed control needs separate states for what the cloud wants and what the device actually reports.

## Command delivery is not command execution

A command can pass through:

dashboard;
API;
database;
broker;
network;
device client;
application task;
driver;
physical output.

Acknowledgement from the broker proves one thing.

Acknowledgement from the device proves another.

Physical feedback can prove something stronger still.

Name the acknowledgement level.

## Desired and reported state solve different questions

Desired state says:

what should the device become?

Reported state says:

what does the device say it currently is?

Example:

desired fan_mode = high;
reported fan_mode = low.

That disagreement is useful.

It can mean the command has not arrived, the device is offline, the action failed, safety logic overrode it, or the state report is stale.

Do not overwrite desired state with reported state and lose the difference.

## Commands should have identity

A command should carry a unique identifier.

For example:

command_id;
issued_at;
expires_at;
operation;
parameters;
issuer/policy context.

The device can record the last completed command IDs.

If the same message arrives twice because of QoS 1 redelivery, it can recognize a duplicate.

Idempotency belongs at the physical effect boundary.

## Expiry prevents stale control

Imagine a door-unlock command issued at 10:00 while the device is offline.

The device reconnects at 18:00.

Should it execute the old command?

Usually not.

Commands that are time-sensitive need an expiry or validity window.

Telemetry can be delayed safely in many cases.

Control intent can become dangerous when delayed.

Store-and-forward rules should therefore differ for telemetry and commands.

## Reported state needs freshness

A dashboard showing relay=on from yesterday can mislead the operator if the device has been offline since then.

Reported state should carry:

- value;
- device event time;
- server receive time;
- freshness status;
- firmware/device identity.

UI should distinguish:

on and recently confirmed;
on but stale;
unknown/offline.

Truthful uncertainty is better than a green icon based on old data.

## Commands can be rejected legitimately

The device may refuse a command because:

- local safety interlock;
- invalid parameter;
- incompatible firmware;
- insufficient power;
- hardware fault;
- expired command;
- unauthorized state transition.

The command result should include a reason code and human-readable detail.

Cloud intent is not absolute authority over physics.

## Local control and cloud control can conflict

A thermostat can be changed locally while the cloud has a different desired value.

The product needs a conflict policy.

Options include:

last writer wins;
cloud authoritative;
local authoritative;
time-bounded cloud override;
merge by field;
explicit mode.

There is no universal answer.

The important point is that the rule must exist before two controllers disagree.

## State topics and event topics are different

A state publication can be retained:

device/123/state/fan = high.

An event should usually represent occurrence:

device/123/events/button_pressed.

If events are modeled as retained state, new subscribers may interpret an old event as current.

If state is modeled only as transient events, a new subscriber must replay history to reconstruct the current value.

Choose the representation that matches the meaning.

## Practical experiment

Using a local MQTT setup, implement one virtual relay.

Publish commands with command_id and expiry.

Make the device publish:

accepted;
completed;
rejected.

Then force duplicate delivery by publishing the same command twice.

Verify that the physical/logical effect occurs once.

Finally disconnect the client, issue an expiring command, wait until it expires, reconnect, and verify that it is rejected rather than executed late.

## The lesson to carry forward

IoT control is a distributed state machine.

The next lesson assumes the network disappears and asks how the device continues operating, buffers work, reconnects safely, and reconciles state.
