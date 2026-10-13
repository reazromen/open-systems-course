---
title: "Sensors, Measurements, Calibration, and Trust"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-121-sensors-measurements-calibration-and-trust.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 11
excerpt: "A sensor does not deliver truth; it delivers a measurement produced by physics, electronics, calibration, sampling, and firmware. IoT begins by understanding that chain."
eyebrow: "Open Systems Course · Lesson 121 of 180"
---

An IoT system often starts with a sentence such as: “the sensor says 31.2 degrees.”

That number looks precise. Precision is not the same as truth.

A sensor reading is produced by a chain:

physical quantity → sensing element → analog front end → ADC or digital sensor logic → calibration → driver → application units → timestamp.

Every stage can introduce error, delay, saturation, drift, quantization, or interpretation mistakes.

## A measurement needs units and context

The value 31.2 is meaningless without units and conditions.

A useful sample includes at least:

- quantity being measured;
- unit;
- timestamp;
- sensor identity;
- calibration/version context where relevant;
- validity or quality state.

For environmental measurements, location and exposure can matter as much as the sensor itself. A temperature sensor beside a voltage regulator measures a different thermal environment from one exposed to ambient air.

## Resolution is not accuracy

A 16-bit ADC can produce many numerical levels. That does not make the complete measurement accurate to 16 bits.

Accuracy depends on reference voltage, linearity, sensor error, noise, temperature drift, PCB layout, calibration, and other factors.

Likewise, a digital sensor that reports two decimal places is not promising that the physical quantity is known to two decimal places.

Datasheets separate concepts such as resolution, accuracy, repeatability, offset, and drift for a reason.

## Calibration maps raw output to a physical estimate

Calibration compares the sensor system against known references and derives correction parameters.

A simple model can be:

corrected = gain × raw + offset.

Real sensors can need nonlinear calibration, temperature compensation, per-device coefficients, or multi-point curves.

Calibration data is itself state. It needs:

- identity;
- version;
- storage;
- update policy;
- traceability.

If calibration coefficients are lost during a firmware update, the device can remain online while its measurements become wrong.

## Sampling rate is part of the signal model

Sampling too slowly can miss events.

Sampling rapidly does not automatically improve information if the sensor bandwidth is limited or noise dominates.

The Nyquist-Shannon sampling theorem gives a mathematical relationship between sample rate and band-limited signals, but real sensors also need anti-alias filtering and practical margin.

For slowly changing temperature, thousands of samples per second may only create redundant data and power cost.

For vibration or audio, sampling strategy is central.

## Time belongs to every measurement

In distributed IoT systems, a sample without trustworthy time is much less useful.

There are at least two timestamps worth distinguishing:

- when the physical sample was captured;
- when the server received it.

If a device is offline for an hour and uploads buffered samples later, receive time and measurement time differ dramatically.

Do not overwrite one with the other.

## Missing data is a state, not zero

Suppose a humidity sensor stops responding.

Publishing humidity=0 creates a false measurement.

Better states can be:

- value present and valid;
- missing;
- stale;
- sensor fault;
- out of range;
- calibration invalid.

A database schema and telemetry format should preserve that distinction.

Zero is data. Missing is metadata about absence.

## Filtering changes the meaning

A moving average, median filter, low-pass filter, or Kalman-style estimator can make noisy measurements easier to use.

The filtered value is no longer the raw observation.

Store or label it accordingly.

If an alert threshold is evaluated on a five-minute average, that is a different system from an alert evaluated on instantaneous samples.

Filtering introduces latency and can hide short events.

## Sensor failure can look plausible

The most dangerous sensor failures are not always obvious.

A disconnected analog input can float.

A stuck digital sensor can keep returning the last value.

A corrupted calibration constant can shift every reading by a believable amount.

Plausibility checks help:

- physical range;
- maximum rate of change;
- agreement with neighboring sensors;
- internal diagnostic flags;
- sample freshness.

These are detection mechanisms, not substitutes for calibration.

## Practical experiment

Use one sensor on a board you own.

Record raw output and converted physical units for several minutes.

Then change one condition at a time: warm the sensor gently with your hand, move it closer to a heat source without exceeding its rated environment, or compare it with another reference instrument.

Plot raw and converted values.

Label the experiment as a local observation, not a universal accuracy benchmark.

The goal is to discover where the number comes from.

## The lesson to carry forward

IoT begins with measurement, and measurement is a chain of assumptions.

The next lesson gives the measuring device a durable identity and asks how a new device becomes a trusted member of a fleet.
