---
title: "How an SSD Remembers Without Power"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-017-how-an-ssd-remembers-without-power.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 13
excerpt: "An SSD turns persistent bits into a managed flash-storage system with pages, erase blocks, controllers, mapping tables, error correction, and wear management."
eyebrow: "Open Systems Course · Lesson 17 of 180"
---

RAM forgets ordinary working state when power disappears.

An SSD is expected to remember.

That does not mean it contains tiny permanent zeros and ones.

It uses non-volatile flash-memory technology plus a controller that hides a surprising amount of complexity behind the simple abstraction of addressable storage.

## Persistence is physical

Flash memory stores information using transistor structures whose electrical state can remain distinguishable without continuous system power.

The exact cell technology varies.

Modern NAND can store more than one bit per physical cell by distinguishing multiple charge-related states.

That increases density but tightens the margins between states and increases the importance of error management.

The useful beginner lesson is:

Persistent digital storage is still a physical measurement problem.

The controller must program states, later distinguish them, and correct for imperfections.

## SSDs do not behave like giant RAM

Software often addresses storage in logical blocks.

Flash hardware has different constraints.

NAND flash is commonly programmed in pages but erased in larger erase blocks.

You cannot simply overwrite arbitrary bytes in place the way a RAM abstraction suggests.

The SSD controller therefore translates between the logical block addresses the host sees and physical flash locations.

This translation is a major reason the host can use an SSD without understanding raw NAND management.

## The Flash Translation Layer hides movement

Imagine the operating system writes logical block 100.

The controller may place that data into one physical flash page.

Later the host overwrites logical block 100.

The controller may write the new version somewhere else and mark the old physical version invalid.

A mapping table records where the current logical block actually lives.

Over time, invalid pages accumulate.

The controller performs garbage collection: valid data may be moved so whole erase blocks can be reclaimed.

From outside:

    write block 100

Inside:

    choose physical location
    program page
    update mapping
    later move data
    erase larger block
    maintain metadata

The abstraction is doing enormous work.

## Wear matters

Flash cells tolerate a finite number of program/erase cycles.

If the same physical block received every frequently updated logical write, it could wear much faster than the rest of the device.

Controllers therefore perform wear leveling to spread erase activity.

This is another case where the logical address is not a permanent physical location.

The device moves state to protect the medium.

## Error correction is normal engineering

As flash density increases and cells age, raw bit errors become an expected phenomenon that the controller must manage.

SSDs use error-correcting codes and other integrity mechanisms to recover data within supported error limits.

That does not mean SSDs are unreliable by definition.

It means the storage system is designed around imperfect physical media.

This is a theme across computing:

Reliable abstractions are often built on components that are individually imperfect.

## What does "write completed" mean?

This question is more subtle than it looks.

An application may call a write function.

The operating system may cache the data.

The filesystem may update metadata.

A storage stack may queue commands.

The SSD may acknowledge data after receiving it into internal buffers.

Power-loss behaviour depends on the complete chain and the device's guarantees.

This is why databases and filesystems use explicit durability mechanisms such as flushes, barriers, journals, or transaction logs according to their design.

A successful application-level write is not automatically proof that every relevant bit is on stable media.

We need the documented contract.

## TRIM tells the SSD what no longer matters

A filesystem may delete a file, but from the block device's perspective the old blocks could still appear allocated unless the storage stack communicates that their contents no longer need preservation.

Commands such as TRIM or discard allow the operating system to inform an SSD that certain logical blocks are no longer in use.

This can help the controller manage free space and garbage collection more effectively.

Deletion at one abstraction layer becomes information for optimization at a lower layer.

## SSD speed is workload-dependent

A product box may advertise a large sequential throughput number.

Your workload may be small random writes.

Or database sync operations.

Or mixed reads and writes.

Or a nearly full drive under sustained write pressure.

Latency and throughput can differ greatly.

Storage performance depends on:

- access pattern;
- queue depth;
- request size;
- free space;
- controller;
- flash type;
- thermal limits;
- interface;
- durability requirements.

One headline bandwidth number does not describe the device.

## An SSD is a computer-like subsystem

A modern SSD contains:

- controller logic;
- firmware;
- memory buffers;
- flash channels;
- mapping metadata;
- error correction;
- background management.

Thinking of it as a passive box of bits hides important failure and performance modes.

Firmware bugs can matter.

Power-loss behaviour can matter.

Temperature can matter.

Controller saturation can matter.

Internal garbage collection can affect latency.

The storage device is an active subsystem.

## Exercise: separate the layers of save

Write a document and press Save.

Draw:

    application
      -> filesystem call
      -> OS cache
      -> filesystem
      -> block layer
      -> SSD controller
      -> flash media

Now mark which layers may acknowledge completion before the next layer has finished durable work.

You do not need the exact answer for your device.

The exercise teaches you to ask for durability semantics rather than assuming them.

## The lesson to carry forward

An SSD remembers without power because non-volatile flash stores physical state and a controller builds a logical storage abstraction on top of it.

Pages, erase blocks, mapping, garbage collection, wear leveling, and error correction disappear behind simple block addresses.

That abstraction is excellent for ordinary software.

When performance, durability, or recovery matters, open the box.
