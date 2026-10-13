---
title: "Build a Small Program from a System Diagram"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-040-build-small-program-from-system-diagram.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 13
excerpt: "Instead of starting with syntax, start with a sensor system diagram, identify state and interfaces, then let variables, conditions, loops, functions, modules, and failure paths emerge from the design."
eyebrow: "Open Systems Course · Lesson 40 of 180"
---

Now use the method this course is built around.

Do not begin with Python.

Begin with a system.

Requirement:

> Read a temperature value every five seconds. If a valid reading stays above a warning threshold for three consecutive samples, record an alert.

No paid service.

No framework.

No architecture astronautics.

Just a small system.

## Draw the path first

    sensor source
       ↓
    reading
       ↓
    validation
       ↓
    threshold decision
       ↓
    consecutive-count state
       ↓
    alert record

Already we can ask better questions than "which loop syntax?"

What is a valid reading?

What unit?

Where does threshold come from?

What does alert record mean?

What happens if the sensor is unavailable?

## Define the data

A reading needs:

    value
    unit
    timestamp
    valid

We could model it as a dictionary, record, class, or struct.

The language mechanism is secondary.

The system model says one naked number is not enough.

## Identify changing state

We need at least:

    consecutive_high_count

Initial:

    0

Valid reading above threshold:

    +1

Valid reading not above threshold:

    reset to 0

Invalid reading:

Decision required.

Should it reset?

Pause?

Raise separate sensor-health alert?

The requirement did not specify.

Good engineering exposes ambiguity before code silently chooses.

For this exercise, choose:

invalid reading resets the count and is logged.

Document that as a constructed policy.

## The condition emerges

The decision is now:

    reading valid
    AND
    reading value > threshold

Then update count.

A second condition asks:

    consecutive_high_count >= 3

Then record alert.

We did not teach if statements first.

The domain created two predicates.

Syntax now has a reason.

## The loop emerges

Requirement says every five seconds.

We need repetition.

Conceptually:

    forever:
        get reading
        process reading
        wait five seconds

But timing deserves care.

If reading and processing take two seconds, sleeping five more creates a seven-second interval.

If exact cadence matters, schedule against a clock rather than blindly sleeping after work.

For a teaching example, approximate intervals may be acceptable.

The requirement decides.

## Functions emerge from responsibility

Potential functions:

    read_temperature()
    validate_reading()
    update_warning_state()
    record_alert()

Why split them?

Each has a different responsibility.

Sensor acquisition can change without rewriting alert policy.

Alert storage can change without rewriting sensor validation.

Tests can feed synthetic readings into policy logic.

Functions become boundaries because the system has boundaries.

## Modules emerge later

For this tiny program, one file may be enough.

Do not create twelve modules because architecture diagrams exist.

When the system grows, likely boundaries appear:

    sensor.py
    policy.py
    storage.py

Complexity should justify structure.

The course rejects both extremes:

one 20,000-line file

and

one file per trivial function.

## Failure path

What if reading fails?

Our rule:

    log failure
    reset consecutive count
    continue

What if alert recording fails?

That is more serious.

If we silently continue, the program detected danger but lost the result.

Possible policy:

    retry durable alert write
    expose health failure
    do not claim alert recorded

Now failure semantics become part of the program.

## A Python implementation

One possible learning implementation:

    import time

    THRESHOLD_C = 35.0
    REQUIRED_HIGH_SAMPLES = 3

    consecutive_high = 0

    while True:
        reading = read_temperature()

        if not reading.valid:
            consecutive_high = 0
            log_invalid(reading)
        elif reading.value_c > THRESHOLD_C:
            consecutive_high += 1
        else:
            consecutive_high = 0

        if consecutive_high >= REQUIRED_HIGH_SAMPLES:
            record_alert(reading)
            consecutive_high = 0

        time.sleep(5)

This code is incomplete by design.

The I/O functions are not defined because they depend on our environment.

The timing is approximate.

There is no deduplication across restart.

Alert durability is not implemented.

Those are not hidden flaws.

They are the next engineering questions.

## Test the policy without hardware

Create synthetic readings:

    34
    36
    37
    38

Expected:

alert on the fourth input after three consecutive highs.

Now:

    36
    invalid
    37
    38
    39

Under our chosen policy, invalid resets count.

Expected alert at the last reading.

This is why separating policy from sensor I/O matters.

We can test logic with zero hardware cost.

## Break it deliberately

Restart process after two high readings.

Count returns to zero.

If requirement says state must survive restart, our design fails.

Now persistence becomes necessary.

Run two copies of program.

Both may create alerts.

If only one worker is allowed, we need ownership or coordination.

Move threshold into configuration.

Now configuration validation matters.

Every new requirement reveals another systems concept.

That is how the rest of the course will work.

## The lesson to carry forward

We started with a system diagram.

Then concepts appeared because problems required them:

State -> variable.

Decision -> condition.

Repetition -> loop.

Responsibility boundary -> function.

Growing responsibility -> module.

Unexpected outcomes -> failure paths.

History-dependent behaviour -> state machine.

This is the core teaching philosophy of the course.

Programming syntax is important.

But syntax should arrive attached to a reason.

Module 5 now asks a different question:

When data and workload grow, how should information be organized so operations remain efficient?
