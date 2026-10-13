---
title: "Embedded Memory: Flash, SRAM, Stack, Heap, and DMA"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-116-memory-flash-stack-heap-and-dma.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "Embedded memory is not one uniform pool. Code, constants, stacks, heaps, DMA buffers, caches, peripheral registers, and external RAM can have different speed, lifetime, alignment, and accessibility constraints."
eyebrow: "Open Systems Course · Lesson 116 of 180"
---

On a desktop, memory often feels like one large address space.

On a microcontroller, memory can be fragmented into regions with different capabilities.

Some memory executes code. Some is retained during sleep. Some can be reached by DMA. Some is external and slower. Some addresses are not RAM at all but peripheral registers.

Understanding those distinctions is part of firmware correctness.

## Flash stores firmware and persistent data

Firmware images commonly live in on-chip or external flash.

Flash is nonvolatile, so it retains contents without power.

But flash writes and erases are slower and more constrained than normal SRAM writes. Erase granularity is usually larger than one byte, and flash has finite endurance.

That is why configuration and logs need deliberate persistence strategies rather than arbitrary byte-by-byte rewriting.

## SRAM is working memory

SRAM usually holds stacks, heaps, buffers, task control structures, driver state, and runtime data.

It is fast and byte-addressable but volatile.

Many MCUs expose several SRAM regions with different properties.

An allocation that works for ordinary CPU access may be unsuitable for DMA, executable code, or retention during low-power modes.

## The stack belongs to an execution context

Function calls use stack space for return state, local variables, saved registers, and compiler-generated data.

In an RTOS, each task commonly has its own stack.

A stack overflow can corrupt neighboring memory and produce failures far from the original cause.

That makes stack sizing an engineering problem rather than a cosmetic configuration.

Measure high-water marks or use RTOS diagnostics when available instead of guessing blindly.

## The heap trades flexibility for uncertainty

Dynamic allocation can simplify variable-sized buffers and object lifetimes.

It also introduces failure modes:

- allocation failure;
- fragmentation;
- unclear ownership;
- leaks;
- unbounded timing in some allocators.

Many embedded systems use dynamic allocation during startup and avoid it in hard real-time paths.

Others use fixed-size pools.

The right policy depends on timing and memory constraints.

## DMA needs compatible buffers

A DMA engine moves data without the CPU copying every byte.

But the DMA controller may only access certain memory regions or require alignment.

On systems with data caches, CPU and DMA can temporarily disagree about memory contents unless the platform provides coherent memory or software performs cache maintenance.

That leads to a critical question:

who last wrote this buffer, and which agent can currently see the update?

The CPU, DMA engine, peripheral, and cache hierarchy can all participate.

## Memory-mapped peripherals look like addresses

Many hardware registers live inside the processor's address map.

Reading a peripheral address can return timer count, interrupt status, or GPIO input rather than RAM.

Writing another address can start a transfer or clear a flag.

These accesses often require volatile semantics and architecture-specific ordering rules because they have side effects.

Ordinary compiler optimization assumptions about memory do not always apply to device registers.

## External RAM changes performance and failure behavior

Some MCUs support external PSRAM or SDRAM.

That can increase capacity dramatically.

It can also add latency, bus contention, cache dependence, and availability restrictions during flash or low-level operations depending on the platform.

Putting a huge buffer in external RAM may be correct for an application task but wrong for an ISR or DMA operation.

Memory placement is part of system architecture.

## Linker scripts map software into hardware memory

The linker decides where code and data sections live.

Embedded linker scripts or memory maps can place vectors, executable code, constants, initialized data, zero-initialized data, retained sections, and special buffers into specific regions.

When firmware no longer fits, the error is often a link-time memory-layout problem rather than a source-code syntax problem.

Reading the linker map file can reveal which sections and symbols consumed the space.

## Persistent configuration needs atomicity too

Suppose firmware stores Wi-Fi credentials in flash.

If power fails halfway through an update, the device can lose both old and new configuration unless the storage layer provides atomic update behavior.

Embedded persistent storage systems therefore use techniques such as journaling, versioned records, checksums, redundant slots, or copy-on-write updates.

The same durability concepts from Module 11 reappear at a smaller scale.

## Practical inspection

Build one firmware image and inspect its linker map or size report.

Identify at least:

- flash/code usage;
- static RAM usage;
- task stack allocations;
- heap available at runtime;
- any external RAM region.

Then allocate one buffer from ordinary memory and, if the platform supports it, one DMA-capable buffer. Compare the documented restrictions.

Do not optimize based only on free-byte totals. Ask which kind of memory is free and what can use it.

## The lesson to carry forward

Embedded memory is a collection of regions and ownership rules, not one anonymous pool.

The next lesson follows firmware before the application starts: reset, boot ROM, bootloader, image layout, partitions, and firmware update boundaries.
