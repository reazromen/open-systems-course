---
title: "Follow One Sensor-to-Output Path"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-120-follow-one-sensor-to-output-path.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 15
excerpt: "One embedded event can cross voltage thresholds, GPIO or ADC hardware, interrupts, DMA, RTOS queues, application state, timers, PWM, and a power driver before the physical world changes again."
eyebrow: "Open Systems Course · Lesson 120 of 180"
---

We have studied the pieces separately.

Now follow one physical event through an embedded system.

Constructed example: a temperature sensor reports that a device is too hot, and firmware increases fan speed using PWM.

No real product is being described.

## 1. The physical world changes first

The temperature rises.

The sensor converts a physical property into an electrical or digital representation.

Depending on the device, that can be:

- analog voltage;
- resistance converted by a measurement circuit;
- I2C register data;
- SPI frame;
- pulse frequency;
- one-bit threshold output.

Firmware begins after physics has already shaped the signal.

## 2. The electrical interface must be valid

Before software reads anything, voltage levels, pull resistors, reference voltage, grounding, bus wiring, and signal integrity must be correct.

A corrupted I2C waveform can produce a software timeout.

An overloaded ADC input can produce a plausible but wrong number.

The first debugging boundary is therefore always physical compatibility.

## 3. A peripheral captures the signal

Assume the sensor uses I2C.

The MCU's I2C controller generates clock and address phases and receives bytes.

The CPU does not need to bit-bang every edge.

Hardware peripheral state machines perform the bus timing.

The driver configures and supervises that hardware.

## 4. Interrupt or DMA reports progress

The peripheral can generate interrupts when bytes arrive, buffers complete, or errors occur.

For larger transfers, DMA can move data into memory.

Now the same sample exists at several possible locations over time:

sensor register → bus shift register → peripheral FIFO → DMA buffer → driver buffer → application structure.

When debugging stale or corrupted data, ask which copy you are looking at.

## 5. The ISR defers work

The interrupt handler acknowledges the peripheral event and signals a task.

It does not parse configuration files, update a display, and compute control laws inside the ISR.

The short ISR protects latency for other interrupts.

The task does the expensive work later.

## 6. An RTOS task interprets the sample

The sensor task wakes and receives the new bytes.

It checks transport status, validates the sensor response, converts raw units to engineering units, and timestamps the sample.

That transformation creates another state boundary:

raw measurement → validated application sample.

If calibration constants are wrong, the bus can be perfect while the temperature value is wrong.

## 7. The control algorithm decides what should happen

The application compares temperature with a threshold or control curve.

A robust design often adds hysteresis so the fan does not rapidly toggle around one exact threshold.

For example, turn high speed on above one threshold and return to low speed only after temperature falls below a lower threshold.

That is software state introduced to stabilize physical behavior.

## 8. A timer peripheral generates PWM

The control task updates a PWM duty setting.

A hardware timer then produces the repeated waveform.

The CPU does not wake for every PWM edge.

Timer hardware turns one register value into deterministic timing.

This is exactly why embedded peripherals exist.

## 9. GPIO drives a power stage, not the motor directly

The PWM pin controls a transistor, MOSFET, motor driver, or fan-control input.

The GPIO provides a logic signal.

The power stage supplies the actual load current.

Power integrity, flyback behavior for inductive loads, grounding, and driver ratings remain outside the software abstraction.

Correct duty-cycle code cannot compensate for an undersized transistor.

## 10. The physical system responds slowly

The fan accelerates.

Airflow changes.

Temperature falls later.

That delay means the firmware is part of a feedback loop with physical inertia.

Sampling too fast does not make the fan respond instantly.

Control-system stability depends on the dynamics of the plant, sensor, actuator, and algorithm.

## 11. Faults need independent paths

What if the sensor disconnects?

What if temperature exceeds a hard safety limit?

What if the control task deadlocks?

A production system may need:

- plausibility limits;
- sensor timeout;
- watchdog;
- fail-safe output state;
- independent thermal cutoff;
- error logging.

Safety-critical systems require much stronger engineering than this course example. Do not rely on one software loop for hazardous protection.

## 12. Timing can be traced end to end

For one sample, useful timestamps are:

- sensor-ready event;
- peripheral completion;
- ISR entry;
- task wake;
- sample validation complete;
- control decision;
- PWM register update;
- physical output edge.

These let you distinguish:

sensor latency, bus latency, interrupt latency, scheduler latency, algorithm time, and actuator timing.

One number called response time hides all of them.

## 13. Memory ownership is part of the path

If DMA writes into a buffer, the application must not reuse that buffer before transfer completion.

If a queue passes a pointer, the producer must not free the object before the consumer finishes.

If a task stack holds the only copy, returning from the function can invalidate it.

Many embedded bugs are really lifetime bugs.

## 14. Reset must leave hardware safe

Suppose the MCU resets while the fan PWM was high.

What happens to the output pin during reset and boot?

Pins can enter input or default states before firmware reconfigures them.

The hardware design should choose pull resistors and driver behavior so reset transitions are safe.

Boot behavior is part of the actuator contract.

## Build an evidence map

For one device you own, draw:

physical input → electrical interface → MCU peripheral → ISR/DMA → task → application state → output peripheral → driver → physical output.

At each arrow, write what evidence is available: logic analyzer, register, driver log, queue count, timestamp, GPIO probe, or measurement.

That diagram is far more useful than a generic flowchart because every arrow corresponds to a real failure boundary.

## What this module added

Embedded Systems introduced:

- microcontroller architecture;
- GPIO and electrical logic;
- interrupts;
- clocks and timers;
- UART, I2C, and SPI;
- memory regions and DMA;
- bootloaders and partitions;
- RTOS tasks and synchronization;
- watchdogs and power;
- end-to-end sensor/actuator tracing.

Firmware is not merely software running on a smaller computer.

It is software embedded inside a timing, electrical, and physical system.

## The module to carry forward

A systems engineer should now be able to ask:

What physical signal exists?

Which peripheral captures it?

Which execution context handles the event?

Who owns the buffer?

What timing guarantee matters?

What happens during reset?

What happens during low voltage?

What evidence proves each boundary?

Module 13 moves outward from one embedded device into IoT and Device Communication: sensors, provisioning, Wi-Fi, MQTT, telemetry, command state, OTA, fleet management, and one complete device-to-cloud-to-device path.
