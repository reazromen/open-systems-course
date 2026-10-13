---
title: "Watchdogs, Resets, Brownouts, and Power"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-119-watchdogs-resets-brownouts-and-power.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "Embedded reliability depends on recovering from stalled software and unstable power. Watchdogs, reset reasons, brownout detection, sleep states, and current peaks make power behavior part of firmware architecture."
eyebrow: "Open Systems Course · Lesson 119 of 180"
---

A device can fail without crashing in the usual software sense.

It can deadlock, disable interrupts too long, starve a critical task, wait forever for a peripheral, or run at a voltage where logic is no longer reliable.

Embedded systems need mechanisms for detecting and recovering from these states.

## A watchdog asks whether progress is still happening

A watchdog timer resets the system if software fails to service it within a configured interval.

The useful contract is not simply:

CPU is alive.

It should mean something closer to:

the part of the system we care about is still making expected progress.

If one background task feeds the watchdog forever while the control loop is deadlocked, the watchdog proves very little.

## Feeding the watchdog should follow health

A robust design feeds the watchdog only after critical work has completed or when monitored tasks have reported progress.

Some platforms provide multiple watchdog mechanisms for different failure classes, such as interrupt watchdogs and task watchdogs.

Do not increase the timeout until resets disappear without first understanding why deadlines were missed.

That can turn a detectable bug into an undetected hang.

## Reset reason is incident evidence

After reboot, firmware should inspect and preserve the reset cause when the platform exposes it.

Possible categories include:

- power-on;
- software reset;
- watchdog;
- brownout;
- external reset;
- deep-sleep wake.

If every boot log only says booting, valuable evidence is lost.

Persisting a compact crash/reset record can turn intermittent field failures into diagnosable events.

## Brownout is an electrical failure mode

A brownout occurs when supply voltage falls below the range needed for reliable operation.

The CPU may execute incorrectly, flash operations can become unsafe, radios can fail, and peripherals can behave unpredictably.

Brownout detectors reset or hold the system when voltage is too low.

This is not a firmware exception. It is power integrity crossing into digital correctness.

## Current peaks matter more than average current

A radio-enabled MCU may draw short current bursts during Wi-Fi or Bluetooth transmit.

A power supply that handles the average current but cannot supply transient peaks can cause resets.

Capacitance, regulator response, PCB layout, battery internal resistance, cable resistance, and connector quality all matter.

Random reset during radio activity can therefore be a power problem rather than a networking bug.

## Sleep changes which hardware remains alive

Low-power modes can stop CPU clocks, power down memory regions, disable peripherals, or leave selected wake sources active.

The deeper the sleep, the more state may need to be reconstructed on wake.

Firmware should know:

- what memory is retained;
- which clocks stop;
- which peripherals survive;
- what can wake the device;
- whether wake behaves like reset.

Power management is a state-machine design.

## Dynamic frequency changes timing assumptions

Some platforms change CPU or peripheral clock frequency to save power.

Drivers must either use stable clock sources or be notified/reconfigured when clocks change.

A timer or UART calculation based on one clock can become wrong if the source changes unexpectedly.

Power optimization can therefore expose hidden timing assumptions.

## Reset is recovery, not a fix

A watchdog reset can restore service.

It can also hide a recurring deadlock forever.

Good systems pair automatic recovery with evidence:

- reset reason;
- crash dump when possible;
- last progress marker;
- uptime;
- firmware version;
- critical counters.

Recovery keeps the device useful. Evidence makes the bug removable.

## Practical experiment

On a development board, enable the platform watchdog in a test application.

Deliberately block the monitored task long enough to trigger it.

After reboot, print the reset reason.

Then test a sleep mode and record which variables or peripherals retain state.

Do not deliberately undervolt production hardware. If you test power behavior, use appropriate lab equipment and stay inside the device's documented electrical limits.

## The lesson to carry forward

Reliable embedded systems must detect lost progress and unstable power, recover safely, and preserve enough evidence to explain the reset.

The final lesson of this module follows one physical signal from sensor pin through peripheral, interrupt, task, algorithm, timer, and actuator output.
