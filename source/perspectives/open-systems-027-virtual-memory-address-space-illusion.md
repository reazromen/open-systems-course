---
title: "Virtual Memory: The Address Space Illusion"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-027-virtual-memory-address-space-illusion.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 13
excerpt: "Virtual memory lets each process operate in its own address-space abstraction while hardware and the kernel translate, protect, map, share, and sometimes page the underlying memory."
eyebrow: "Open Systems Course · Lesson 27 of 180"
---

A process reads address:

    0x7f...

Another process can use the same numerical virtual address.

They do not necessarily refer to the same physical RAM.

That is virtual memory.

The operating system and processor memory-management hardware create an address-space abstraction for each process.

OSTEP treats this as one of the central operating-system virtualizations.

## Why virtualize addresses?

Without memory protection, one buggy program could overwrite another program or the kernel.

Without relocation, programs would need fixed physical locations.

Without mapping abstractions, sharing libraries, memory-mapped files, copy-on-write, and controlled shared memory would be far harder.

Virtual memory provides:

- isolation;
- flexible placement;
- protection;
- sharing;
- sparse address spaces;
- demand paging.

One mechanism supports many system properties.

## Virtual address first

When a normal process loads from an address, that address belongs to its virtual address space.

The processor's memory-management unit consults translation structures configured by the operating system.

Conceptually:

    virtual address
       -> page-table mapping
       -> physical location

Real translation is more detailed.

Addresses are divided into page offset and page-number structures.

Page tables can be hierarchical.

Translation caches such as TLBs accelerate repeated mappings.

The architectural idea is enough for now.

## Pages are the unit of mapping

Virtual memory is commonly managed in fixed-size pages, with support for larger page sizes on many architectures.

A page-table entry can describe:

- physical frame;
- presence;
- read/write permission;
- execution permission;
- user/kernel accessibility;
- other architecture-specific state.

This means two neighbouring virtual pages do not need to be neighbouring physical pages.

The process sees a continuous address-space abstraction.

Physical memory can be arranged differently.

## A page fault is not automatically a crash

Suppose a process accesses a virtual page that is not currently mapped for immediate use.

The processor raises a page-fault exception.

The kernel examines why.

Possibilities include:

- valid page that needs to be loaded;
- copy-on-write operation;
- demand allocation;
- invalid address;
- permission violation.

Some faults are normal mechanisms.

Others cause the process to receive an error or signal.

"Page fault" describes an event requiring kernel handling, not one universal failure outcome.

## Copy-on-write makes process creation cheaper

After fork, parent and child conceptually have separate memory spaces.

Copying every physical page immediately would be expensive.

Linux can use copy-on-write mappings: parent and child initially reference the same physical pages read-only.

When one side writes, the kernel creates a private copy as needed.

The abstraction says:

separate process memories.

The implementation avoids copying until necessary.

This is abstraction plus optimization.

## Memory-mapped files connect storage and memory

An application can map file contents into its virtual address space.

Then reading memory can cause the operating system to fetch corresponding file-backed pages.

This unifies file data and memory access through the virtual-memory subsystem.

Databases use memory mapping in some designs.

Shared libraries are mapped.

Executable segments are mapped.

The address-space abstraction is doing much more than allocating anonymous RAM.

## Swap is not the definition of virtual memory

A common explanation says:

virtual memory = using disk as extra RAM.

That is incomplete.

Paging to storage is one possible capability.

Virtual memory fundamentally provides address translation and protection.

A system can use virtual memory even if no swap exists.

Do not define the abstraction by one policy built on top of it.

## TLB misses are another hidden cost

Walking page tables for every memory access would be expensive.

Processors cache recent address translations in Translation Lookaside Buffers.

If a translation is present:

TLB hit.

If not:

additional translation work is required.

Large working sets can stress both data caches and translation caches.

Memory performance therefore depends on more than raw RAM bandwidth.

## Security lives in page permissions

Virtual-memory mappings help enforce:

- writable versus read-only;
- executable versus non-executable;
- user-accessible versus privileged.

These controls support process isolation and exploit mitigations.

A process cannot normally make an arbitrary pointer into kernel memory and read it successfully.

The CPU and operating system enforce access rules at the mapping boundary.

Software isolation ultimately depends on hardware mechanisms.

## Exercise: inspect a process map

On Linux:

    cat /proc/self/maps

or inspect /proc/PID/maps for a process you own.

You may see mappings for:

- executable;
- shared libraries;
- heap;
- stack;
- anonymous memory.

Do not worry about every address.

Notice that a process address space is divided into regions with different permissions and backing sources.

The map makes the abstraction visible.

## The lesson to carry forward

Virtual memory gives each process a protected, flexible address-space illusion.

The kernel and hardware translate virtual addresses, enforce permissions, map files, share pages, and handle faults.

Once you understand this, pointers stop meaning "physical RAM location."

They are addresses interpreted inside an execution context.

That distinction is essential for processes, security, debugging, and performance.
