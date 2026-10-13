---
title: "Buses, Interconnects, and Moving Data"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-018-buses-interconnects-moving-data.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "A computer is not useful if its components cannot exchange data. Buses and interconnects provide the paths and protocols that connect processors, memory, storage, and devices."
eyebrow: "Open Systems Course · Lesson 18 of 180"
---

Draw a CPU.

Draw RAM.

Draw an SSD.

Draw a network card.

Now ask the question diagrams often skip:

**How does information move between them?**

A computer is not only components.

It is connections plus rules for using those connections.

"Buses" is the traditional word for many shared communication structures inside computers, but modern systems also use point-to-point links, switched fabrics, rings, meshes, and proprietary interconnects.

The general concept is interconnection.

## A path needs more than wires

Suppose a processor wants data from memory.

The system needs to communicate:

- which address;
- whether the operation is a read or write;
- what data is transferred;
- when the transfer is valid;
- whether an error occurred.

Physical wires or high-speed serial lanes carry signals.

Protocols give those signals meaning.

This is exactly the same representation problem we have already seen in files and networks.

## Address, data, and control

Classic bus diagrams often separate:

    address
    data
    control

That is a useful conceptual model.

The requester identifies a location or target.

Data travels.

Control information describes the operation and timing.

Real modern interconnects may encode these ideas into packets rather than dedicating one physical wire to each conceptual signal.

The representation changes.

The logical responsibilities remain.

## Shared buses create contention

Imagine CPU, storage controller, network interface, and another device all sharing one communication path.

If two participants try to use it at the same time, the system needs arbitration.

Who gets access first?

How long can one participant hold the resource?

What prevents starvation?

A shared bus therefore creates a scheduling problem.

This is a recurring systems idea:

A shared resource needs a policy for contention.

CPU schedulers, network links, database locks, and buses are different technologies facing a similar structural question.

## Point-to-point links change the topology

Modern high-performance systems often avoid one giant shared parallel bus.

PCI Express, for example, uses high-speed serial point-to-point links organized through a switched topology.

Memory channels connect processors to memory controllers and DIMMs.

Inside multicore processors, cores, cache slices, memory controllers, and accelerators may communicate over sophisticated on-chip fabrics.

The old motherboard diagram with one "system bus" is useful historically and pedagogically but can misrepresent current architecture.

Always distinguish the teaching model from the actual platform.

## Bandwidth and latency are different

An interconnect can transfer a large amount of data per second and still have nontrivial latency for one request.

Bandwidth asks:

How much data can move over time?

Latency asks:

How long does one operation take?

A large sequential transfer can benefit from high bandwidth.

A chain of dependent tiny memory reads can be dominated by latency.

This distinction appears everywhere:

- RAM;
- SSD;
- network;
- radio;
- APIs.

Do not collapse them into the vague word fast.

## DMA lets devices move data efficiently

If every byte from a network card had to be copied manually by CPU instructions from device registers, high-throughput I/O would waste enormous processor time.

Direct Memory Access allows capable devices or controllers to transfer data to or from memory with limited CPU involvement once the operation is configured.

The device can place received network data into memory buffers.

Then it signals completion, often using interrupts.

This creates a path:

    device
      -> DMA
      -> memory
      -> interrupt or completion
      -> software

Now CPU, memory, device, and interconnect cooperate.

## Coherency complicates shared memory

If a device writes memory using DMA while CPU caches hold copies of related data, the system needs coherent rules or explicit cache-management operations depending on architecture.

Otherwise software could read stale data.

This is why hardware manuals and operating-system drivers care about DMA coherency.

A simple arrow labeled "device writes RAM" hides consistency semantics.

The pattern will later feel familiar when we study distributed systems.

Multiple observers of shared state need defined visibility rules.

## Interrupts complete the conversation

After a device finishes work, software needs to learn about it.

Polling is one option: repeatedly ask.

Interrupts provide another: notify the processor when attention is needed.

High-performance devices may also use batching or polling techniques under heavy load because too many interrupts can become expensive.

There is no universal best mechanism.

The architecture depends on event rate, latency requirement, CPU cost, and workload.

## Embedded buses make the idea visible

Microcontrollers expose simpler communication buses that are excellent teaching examples.

I2C lets multiple addressed peripherals share clock and data lines.

SPI uses clocked serial transfers and separate selection mechanisms.

UART sends asynchronous serial data.

These are not equivalents of PCIe or DDR memory interfaces.

But they make the core concept concrete:

Devices need an electrical signaling method plus a protocol for interpreting transfers.

We will return to them in the embedded module.

## Exercise: draw the path of a network packet

A packet arrives at a network interface.

Sketch:

    wire or radio
      -> network controller
      -> bus/interconnect
      -> DMA buffer in RAM
      -> interrupt/completion
      -> OS network stack
      -> application

Now ask:

Where can contention occur?

Where can a queue form?

Where can data be copied?

Where might latency appear?

The network packet becomes a computer-architecture problem before the application sees it.

## The lesson to carry forward

A computer is a communication system inside a box.

Processors, memory, storage, accelerators, and I/O devices need paths for requests, data, and control.

Those paths have topology, bandwidth, latency, arbitration, ordering, and coherency rules.

Whenever a block diagram contains arrows, remember:

**the arrows are systems too.**
