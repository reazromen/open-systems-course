---
title: "State Machines in Everyday Programs"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-039-state-machines-in-everyday-programs.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "Many messy programs become understandable when hidden modes are made explicit as states and allowed events as transitions."
eyebrow: "Open Systems Course · Lesson 39 of 180"
---

A login form can be:

    idle
    submitting
    authenticated
    rejected
    locked

A phone call can be:

    idle
    dialing
    ringing
    connected
    ending

A firmware updater can be:

    checking
    downloading
    verifying
    installing
    rebooting
    confirmed
    rollback

These are state machines hiding inside ordinary software.

## State plus event produces transition

A state machine can be expressed as:

    current state + event -> next state

Example:

    RINGING + answer -> CONNECTED

But:

    IDLE + answer -> ?

Maybe invalid.

Maybe ignored.

Maybe interpreted differently.

The model forces us to define which events make sense in which states.

That precision is why state machines are useful.

## Boolean flags can hide impossible combinations

Suppose code contains:

    is_connected
    is_ringing
    is_ended

Now what does this mean?

    true, true, true

Probably an impossible state.

Three Booleans create eight combinations whether the domain allows them or not.

One explicit enum:

    IDLE
    RINGING
    CONNECTED
    ENDED

can make invalid combinations unrepresentable.

Data modeling simplifies control flow.

## Transitions can have guards

A firmware update can move from downloaded to installing only if signature verification succeeds.

Conceptually:

    DOWNLOADED
       |
       | signature valid
       v
    VERIFIED
       |
       v
    INSTALLING

If verification fails, transition elsewhere.

The guard is a condition attached to a state transition.

This is often clearer than scattered if statements checking unrelated flags.

## Transitions can produce effects

State machines do not only change labels.

Entering CONNECTED may start media.

Entering RETRY_WAIT may schedule a timer.

Entering FAILED may emit an alert.

Be careful to distinguish:

- state change;
- side effect caused by transition.

If side effects fail, the state machine may need additional states.

Reality is sometimes more detailed than the first diagram.

## Time can be an event

No response for five seconds.

That is a timeout event.

Now:

    CONNECTING + timeout -> RETRY_WAIT

After backoff:

    RETRY_WAIT + timer -> CONNECTING

Distributed systems are full of state machines driven by messages and timers.

Once you see this, protocols become easier to read.

## Persistence makes restart behaviour explicit

Suppose an OTA updater crashes in INSTALLING.

After reboot, what state does it believe?

If state existed only in RAM, the process may forget.

If critical transition progress is persisted, recovery can resume or rollback safely.

State-machine design therefore connects to storage and durability.

## Multiple machines create multiple state machines

In a phone call:

caller has state.

PBX has state.

callee has state.

Media relay has state.

They exchange messages trying to coordinate.

They may temporarily disagree.

That is why distributed protocol debugging requires following state at each participant rather than drawing one global magical state.

## Exercise: model a download

States:

    IDLE
    DOWNLOADING
    VERIFYING
    READY
    FAILED

Events:

    start
    bytes complete
    hash valid
    hash invalid
    timeout
    cancel

Create a transition table.

Then ask:

Which states persist after restart?

Which events are valid twice?

Which transitions have side effects?

You have designed more than control flow.

You have designed behaviour over time.

## The lesson to carry forward

State machines turn hidden modes into explicit models.

They are useful whenever behaviour depends on history.

Instead of asking only:

What line runs next?

ask:

What state are we in?

Which events are valid here?

What transition occurs?

What side effects accompany it?

This model will return in networking, telephony, devices, distributed systems, and security.
