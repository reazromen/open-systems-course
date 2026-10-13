---
title: "Why Conditions Exist"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-033-why-conditions-exist.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 10
excerpt: "Conditions let current state select future behaviour. A useful conditional comes from a decision rule and its consequences, not from memorizing if/else syntax."
eyebrow: "Open Systems Course · Lesson 33 of 180"
---

A sensor reports 74 °C.

Should a fan turn on?

The program needs a decision.

That problem creates the need for a condition.

    if temperature_c > 70:
        fan_on()

The syntax is easy.

The engineering is hidden in the threshold.

## Conditions turn state into control flow

Before the decision, the program has state:

    temperature_c = 74

The condition evaluates a proposition:

    temperature_c > 70

That produces a logical result.

The program then chooses which path to execute.

Conceptually:

    state
      -> predicate
      -> branch
      -> different future state

This connects high-level programming directly to the branch instructions introduced in CPU architecture.

## The threshold needs a requirement

Why 70?

If you cannot answer, the code is arbitrary.

Maybe hardware documentation specifies a safe operating range.

Maybe a control policy defines hysteresis.

Maybe the threshold came from measurement.

Maybe it is only a temporary test value.

A number in an if statement is not self-justifying.

Conditions encode policy.

Policy needs evidence or requirements.

## Real decisions often need more than one variable

Suppose:

    if temperature > 70 and fan_available:
        fan_on()

Now state from two components participates.

Add:

    device_mode
    sensor_valid
    emergency_override
    minimum_run_time

The condition becomes system logic.

This is why complex Boolean expressions can become hard to review.

Sometimes the right answer is to create named predicates:

    sensor_is_trustworthy
    cooling_is_required
    cooling_is_available

The names describe decisions rather than raw syntax.

## Hysteresis prevents rapid switching

Suppose the fan turns on above 70 and off below 70.

The measurement oscillates:

    69.9
    70.1
    69.8
    70.2

The fan repeatedly switches.

A better control rule might turn on above 72 and turn off below 68.

The gap is hysteresis.

Now the decision depends on current measurement plus previous state.

A simple condition became a state machine.

This pattern appears in thermostats, alarms, radio thresholds, autoscaling, and monitoring.

## Missing data is a condition too

What if no valid temperature exists?

Bad code might treat missing as zero.

Now:

    0 < 70

and the system concludes everything is cool.

That is a false statement about the world created by a representation shortcut.

A robust design distinguishes:

    valid reading
    stale reading
    missing reading
    sensor error

Control flow depends on data quality, not just value.

## Ordering conditions changes behaviour

Consider:

    if user_is_admin:
        allow()
    elif resource_is_public:
        allow()
    else:
        deny()

Now compare a different order with side effects or more complex rules.

Conditions are not isolated formulas.

They form a decision tree.

Review the whole tree for:

- unreachable branches;
- missing cases;
- accidental privilege;
- contradictory rules.

## Exercise: design an alarm without code

Requirement:

Alert when river level exceeds a warning threshold, but only if the measurement is less than ten minutes old.

Write the decision in plain language first.

Then pseudocode:

    if reading_is_recent and level > warning_threshold:
        alert()

Now add:

What if timestamp is missing?

What if unit is wrong?

What if alert was already sent?

What if level oscillates around threshold?

You have discovered that programming begins before syntax.

## The lesson to carry forward

Conditions exist because systems need decisions based on state.

The if statement is the surface.

The real work is defining:

- predicate;
- evidence;
- boundary values;
- missing cases;
- consequences;
- interaction with previous state.

A good conditional encodes a defensible decision rule.
