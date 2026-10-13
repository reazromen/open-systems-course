---
title: "Interfaces: Separating What from How"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-038-interfaces-separating-what-from-how.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 11
excerpt: "An interface is a boundary contract: what operations are available, what inputs and outputs mean, what failures exist, and which implementation details remain hidden."
eyebrow: "Open Systems Course · Lesson 38 of 180"
---

A thermostat needs current temperature.

It should not care whether the value came from:

- local I2C sensor;
- remote MQTT device;
- test simulator;
- database playback.

If each source can satisfy the same relevant contract, the control logic can depend on an interface instead of one implementation.

That is the problem interfaces solve.

## Interface is more than a function name

A useful interface defines:

- available operations;
- input meanings;
- output meanings;
- failure behaviour;
- ordering or timing assumptions;
- ownership of state.

Suppose:

    read_temperature() -> number

Too vague.

Celsius?

Freshness?

Can no reading exist?

Can it block for five seconds?

A syntactically clean API can still have a terrible contract.

## Implementation can vary behind the boundary

The caller may see:

    TemperatureSource.read()

One implementation reads hardware.

Another makes an HTTP request.

Another returns synthetic test data.

This separation allows replacement.

But replacement works only if implementations preserve the properties callers actually rely on.

If one returns instantly and another blocks for thirty seconds, the nominal interface matches while operational behaviour changes.

Nonfunctional properties belong in architecture too.

## Interfaces reduce knowledge

Without a boundary, control logic might know:

- I2C address;
- register layout;
- calibration formula;
- retry timing;
- sensor model.

With a good sensor interface, those details can remain inside a driver.

The higher layer works with temperature readings.

That is abstraction creating smaller reasoning surfaces.

## An interface can be local or remote

A function call is an interface.

A system call is an interface.

An HTTP API is an interface.

A network protocol is an interface.

A hardware bus protocol is an interface.

The mechanisms differ.

The recurring idea is:

Participants agree how to interact across a boundary.

Once the boundary crosses a network, failure and latency become much more visible.

A remote call is not just a slower local function call.

## Versioning exposes hidden assumptions

Change a field name in an API.

Old clients break.

Change a function signature.

Callers fail to compile.

Change a binary layout.

ABI compatibility breaks.

Interfaces create dependencies, so changes need lifecycle rules.

Compatibility is not accidental kindness.

It is part of maintaining a contract over time.

## Mocking reveals the abstraction quality

If business logic depends on a small interface, tests can substitute a controlled implementation.

For example:

    Clock.now()
    MessageSender.send()
    TemperatureSource.read()

A test can inject deterministic versions.

If testing one decision requires booting a whole network stack and database, boundaries may be too tangled.

Testability is not the only reason to design interfaces.

It is often evidence of good separation.

## Interface segregation avoids giant contracts

Suppose one Device interface contains 70 operations:

- firmware update;
- audio;
- sensors;
- billing;
- debug;
- user profile.

A component that only needs battery level now depends conceptually on everything.

Smaller role-specific interfaces can reduce coupling.

Do not split mechanically.

Split where responsibilities and consumers differ.

## Exercise: design a message sender

Define an interface:

    send(message)

Now make the contract precise.

Does return mean:

- queued locally;
- accepted by provider;
- delivered remotely;
- displayed to user?

Can it return duplicate?

Can timeout occur after remote success?

What identifier supports later status checks?

The questions are more important than the syntax.

## The lesson to carry forward

Interfaces separate what a component promises from how it delivers that promise.

They let systems evolve, test, substitute, and reason in smaller pieces.

A good interface does not merely hide implementation.

It makes semantics explicit.

Whenever two components meet, ask:

**What exactly are they promising each other?**
