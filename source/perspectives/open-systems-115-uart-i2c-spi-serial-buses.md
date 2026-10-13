---
title: "UART, I2C, and SPI: Three Ways Chips Talk"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-115-uart-i2c-spi-serial-buses.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "UART, I2C, and SPI all move bits serially, but they solve different wiring and coordination problems. Their clocks, addressing, framing, electrical behavior, and failure modes are not interchangeable."
eyebrow: "Open Systems Course · Lesson 115 of 180"
---

An MCU rarely works alone.

It talks to sensors, displays, flash chips, radios, codecs, motor controllers, GPS receivers, and debugging tools.

Three common local interfaces are UART, I2C, and SPI.

They all move bits serially, but their system contracts are very different.

## UART: both sides agree on timing

A basic UART link usually uses a transmit line and receive line.

There is no shared clock signal in ordinary asynchronous UART.

Both sides configure compatible baud rate, data bits, parity, and stop-bit behavior.

The receiver detects framing from the line transitions and its own clock.

This makes UART simple and excellent for consoles, GPS modules, modems, debug logs, and device-to-device links.

But timing mismatch, wrong voltage level, swapped TX/RX, or incompatible framing can turn valid bytes into garbage.

## UART has no built-in device addressing

A raw UART link usually connects one transmitter/receiver pair or a topology defined by extra hardware.

The UART frame does not inherently say device address 0x42.

If several logical devices share the connection, a higher-level protocol must define addressing and framing.

This is why UART is a byte transport, not a complete application protocol.

## I2C shares two open-drain lines

I2C uses a clock line and data line, commonly called SCL and SDA.

Devices use open-drain behavior with pull-up resistors so multiple participants can share the lines safely.

A controller addresses a target and transfers bytes under bus rules.

That makes I2C convenient for many low-to-moderate-speed peripherals on the same short board-level bus.

Pull-up values, bus capacitance, device voltage compatibility, and clock speed all affect signal quality.

An I2C bug can therefore be firmware, addressing, pull-up, wiring, timing, or a stuck device.

## I2C acknowledgements are protocol-level feedback

After address or data phases, receivers acknowledge according to the protocol.

A NACK is evidence, but not a full diagnosis.

It can mean no device at that address, a device not ready, unsupported operation, bus issue, or application-specific behavior.

Inspect the actual waveform when software logs are ambiguous.

## SPI is synchronous and explicit

SPI commonly uses clock, controller-out data, controller-in data, and one or more chip-select signals.

The controller provides the clock.

Transfers can be full duplex.

SPI often reaches higher throughput than I2C and maps well to displays, ADCs, flash chips, and other high-speed peripherals.

The cost is more wires and chip-select management.

## SPI mode must match

Clock polarity and phase define when data changes and is sampled.

These combinations are often described as SPI modes.

If the controller and peripheral use incompatible mode settings, the waveform can look active while decoded data is wrong.

Bit order, word length, maximum clock rate, setup time, and hold time also matter.

Always read the peripheral datasheet.

## Chip select defines transaction context

Many SPI peripherals interpret command bytes only while their chip-select signal is active.

Toggling chip select at the wrong boundary can split what the peripheral expected to be one command.

A logic analyzer that decodes SPI can make this failure obvious.

## DMA separates byte movement from CPU work

High-rate UART and SPI transfers can use DMA.

Instead of the CPU handling every byte, DMA moves blocks between peripheral and memory.

The CPU configures the transfer and handles completion/error events.

This reduces CPU load but introduces buffer ownership, alignment, memory-region, and cache-coherency constraints on some MCUs.

DMA is a new execution agent touching memory.

## Drivers add buffering and state

SDK drivers often add ring buffers, queues, mutexes, interrupts, and background tasks around the hardware peripheral.

So an application write call may return before every bit leaves the pin.

Likewise, receive data can exist in hardware FIFO, DMA buffer, driver ring buffer, or application queue.

Always ask which buffer the byte is currently in.

## Practical experiment

Use a board and peripheral you already own.

For UART, transmit a known repeating string and capture it.

For I2C, scan only your own development bus and then perform one documented register read.

For SPI, read a known identification register if the peripheral provides one.

If a logic analyzer is available, decode the transaction and compare wire-level fields with driver configuration.

Do not probe or drive unknown external equipment without knowing voltage levels and ownership.

## The lesson to carry forward

UART, I2C, and SPI are different timing and electrical contracts for moving data between components.

The next lesson looks inward again: flash, SRAM, stack, heap, DMA-capable memory, and memory-mapped peripherals.
