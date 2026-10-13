---
title: "Clocks, Timers, PWM, and Deadlines"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-114-clocks-timers-pwm-and-deadlines.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 11
excerpt: "Embedded timing begins with clocks and counters. Timers generate events, capture external timing, and produce PWM, but their real resolution and accuracy depend on clock sources, dividers, and scheduling latency."
eyebrow: "Open Systems Course · Lesson 114 of 180"
---

Firmware often asks for time in friendly units: wait 10 milliseconds, sample at 1 kHz, generate a 20 kHz PWM signal.

Hardware does not start with milliseconds.

It starts with oscillators, clocks, dividers, counters, compare registers, and capture events.

## A timer counts clock events

A timer typically receives a clock source, optionally divides it, and increments or decrements a counter.

If the timer clock is 1 MHz, each count represents one microsecond.

A compare value of 1000 can therefore generate an event after 1000 counts under the configured mode.

Change the source clock or divider and the same register value means a different amount of time.

## Resolution and range trade against each other

A 16-bit timer can represent 65,536 counter states.

At a very fast tick rate, it has fine resolution but wraps quickly.

At a slower tick rate, it spans a longer interval but resolves time more coarsely.

Timer configuration is therefore a trade-off between range, resolution, and interrupt frequency.

## Periodic interrupts are not perfectly periodic execution

A hardware timer can assert an interrupt at precise intervals.

The ISR or task handling that event can still start late because of interrupt masking, higher-priority work, scheduler state, or critical sections.

The timer event and software execution time are different timestamps.

For precise measurement, capture the hardware event or toggle a diagnostic pin and measure the waveform.

## Capture records external timing

Capture peripherals can latch the timer count when an input edge occurs.

This is useful for measuring pulse widths, periods, frequency, encoder signals, or event timing.

Hardware capture can be more accurate than timestamping inside an ISR because it records the edge before software latency is added.

## Compare schedules future events

Compare units trigger when the counter reaches a programmed value.

They can generate interrupts or directly affect output signals.

This lets hardware create deterministic timing without asking the CPU to toggle a pin on every edge.

That distinction is central to robust embedded design: use peripherals to handle regular timing when hardware already knows how.

## PWM is timed switching

Pulse-width modulation repeats a digital waveform with a chosen period and duty cycle.

If the period is 1 ms and the output is high for 0.25 ms, duty cycle is 25 percent.

PWM can control LED brightness, motor drivers, heaters, audio-like waveforms, and many power circuits when paired with appropriate hardware.

The GPIO itself is still digital. The average physical effect arises from switching over time.

## Clock accuracy sets timing accuracy

Internal RC oscillators are convenient but can drift with temperature, voltage, and manufacturing variation.

Crystal oscillators are usually more accurate.

Some systems calibrate clocks against another reference.

If UART baud rate, radio timing, sampling rate, or long-term clock accuracy matters, oscillator tolerance belongs in the design.

## Tick-based RTOS time is another abstraction

An RTOS scheduler can expose ticks and delay APIs.

Those are built above a timer source.

A task delay such as 10 ms does not guarantee the task executes exactly 10.000 ms later. It means the task becomes eligible according to scheduler timing rules.

Hardware timer deadlines and task scheduling deadlines are different tools.

## Practical experiment

Configure a hardware timer to toggle or trigger work once per second.

Measure the period with a logic analyzer or oscilloscope if available.

Then move the actual toggle into a scheduled task notified by the timer ISR.

Compare the hardware event timing with task execution timing.

You will see the difference between precise peripheral time and software scheduling delay.

## The lesson to carry forward

Embedded time is built from clocks, counters, compare events, and capture events.

The next lesson connects the MCU to other chips and modules through UART, I2C, and SPI.
