---
title: "Bootloaders, Firmware Images, and Partitions"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-117-bootloaders-firmware-images-and-partitions.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 11
excerpt: "Embedded software starts before main(). Reset logic, ROM code, bootloaders, image metadata, partition tables, verification, and fallback policy determine which firmware actually runs."
eyebrow: "Open Systems Course · Lesson 117 of 180"
---

A firmware project can compile successfully and still never reach main().

Why?

Because application code is only one stage in the boot path.

A typical embedded startup can include reset logic, ROM code, boot strap selection, a bootloader, image verification, memory setup, runtime initialization, and only then the application.

## Reset chooses an initial execution path

After power-on or reset, the processor begins from architecture-defined state.

Boot ROM code can inspect straps, fuses, reset reason, flash configuration, or download-mode pins.

The device may boot normal firmware, enter a programming mode, or halt because security or image validation failed.

Reset reason is valuable evidence. Watchdog reset, brownout reset, software reset, and power-on reset imply different failure histories.

## Boot ROM is not your application

Many MCUs contain immutable manufacturer ROM code.

It can provide first-stage boot, cryptographic helpers, download protocols, or low-level routines.

Because it is masked into silicon, firmware cannot replace it in the same way as flash-resident code.

That makes ROM behavior part of the hardware platform contract.

## A bootloader selects and validates an image

A flash-resident bootloader can read partition metadata, locate firmware images, verify headers, check integrity or signatures, choose a slot, and prepare the system to execute.

It may also implement rollback logic.

If the image metadata is corrupt, the application never starts.

Debugging must therefore distinguish bootloader output from application output.

## Partitions divide flash into roles

A partition table can divide flash into areas for:

- bootloader;
- application images;
- persistent configuration;
- calibration data;
- filesystems;
- crash data;
- update slots.

The exact layout is a design decision constrained by flash size and platform boot rules.

A device with two application slots can support safer updates by keeping one known-good image while writing another.

## Image verification changes the trust boundary

Checksums can detect accidental corruption.

Cryptographic signatures can authenticate that an image was produced by an authorized signer when secure boot is correctly configured.

Encryption can protect firmware confidentiality at rest on flash.

These solve different problems.

Integrity is not confidentiality, and encryption without authenticated boot does not by itself prove who produced the firmware.

Security configuration often involves irreversible eFuse or key decisions, so it must be tested carefully on development hardware before production.

## Update safety depends on power-loss behavior

Suppose firmware overwrites the only application image in place.

Power fails halfway through.

The device may no longer have any bootable image.

Safer update systems usually write a separate slot, verify it, mark it bootable, then switch boot selection.

After the new image proves healthy, it can be marked valid.

That is a transaction-like state machine applied to firmware images.

## Boot compatibility includes persistent data

A new firmware image can boot successfully and still fail because it cannot understand old configuration data.

That means upgrade compatibility must cover:

- firmware binary;
- partition layout;
- persistent schema;
- calibration data;
- bootloader version;
- security policy.

Firmware migration is a data migration too.

## Startup code initializes language runtime state

Before application logic, startup code may copy initialized data from flash to RAM, zero BSS, initialize constructors, configure stack pointers, set vector tables, and prepare the runtime.

Crashes here can appear as immediate reset loops.

Early boot logging, reset-reason registers, and debugger access are often the only evidence.

## Practical inspection

On a development board you control, inspect the partition table and boot log.

Identify:

- bootloader version;
- application slot;
- reset reason;
- flash size;
- image address;
- persistent-data partitions.

Then compare those addresses with the build output.

Do not change secure-boot fuses or irreversible security settings merely for this exercise.

## The lesson to carry forward

Firmware execution begins before the application and depends on image-selection, integrity, memory, and partition state.

The next lesson introduces the scheduler that many embedded applications use after boot: an RTOS with tasks, queues, semaphores, and timing rules.
