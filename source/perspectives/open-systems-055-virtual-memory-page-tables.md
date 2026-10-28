---
title: "Virtual Memory and Page Tables"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-055-virtual-memory-page-tables.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 13
excerpt: "Page tables are the data structures behind virtual address translation and protection. They let the kernel map sparse process address spaces onto physical memory with per-page permissions."
eyebrow: "Open Systems Course · Lesson 55 of 180"
---

Lesson 27 introduced the virtual address-space illusion.

Now open the mechanism.

A process issues a memory access to a virtual address.

The processor must determine what physical memory, if any, that virtual page corresponds to and whether the access is permitted.

Page tables encode that mapping.

## Split address into page and offset

Suppose a simplified system uses 4 KiB pages.

A virtual address can be thought of as:

    virtual page number | page offset

The offset selects a byte within the page.

The page number selects a mapping.

Translation replaces the virtual page identity with a physical frame identity while preserving the offset.

Conceptually:

    VPN + offset
       ↓ page table
    PFN + offset

Real architectures use more detailed multi-level formats.

## Why multi-level page tables exist

A 64-bit virtual address space is enormous.

Allocating one flat mapping entry for every possible page would waste huge amounts of memory.

Hierarchical page tables allocate intermediate structures only for address-space regions that are actually used.

The processor walks multiple levels using portions of the virtual address.

This trades additional lookup work for sparse representation.

A Translation Lookaside Buffer helps hide that cost.

## The TLB caches translations

Programs reuse addresses.

The processor keeps recent virtual-to-physical translations in a TLB.

TLB hit:

translation is quickly available.

TLB miss:

hardware or software must perform additional page-table lookup depending on architecture.

Large working sets or certain access patterns can create many TLB misses.

Memory performance therefore involves two locality problems:

- data locality;
- address-translation locality.

## Page-table entries contain permissions

A mapping is not only an address.

It can encode permission and state such as:

- present/valid;
- writable;
- executable;
- user accessible;
- accessed;
- dirty.

Architecture-specific bits vary.

The kernel uses these controls to enforce memory protection.

A code page can be executable but not writable.

A guard page can be left inaccessible.

Kernel mappings can be inaccessible to ordinary user mode.

Protection is embedded in translation.

## Page faults are decisions

Access a page with no current usable mapping.

The processor raises a fault.

The kernel examines the cause.

It may:

- allocate a fresh page;
- load a file-backed page;
- perform copy-on-write;
- restore a swapped page;
- reject access.

The same hardware event can lead to very different outcomes.

The kernel's mapping state supplies context.

## Copy-on-write changes mappings lazily

After fork, parent and child can initially share physical pages marked read-only.

When one writes:

    page fault

The kernel allocates a private physical page, copies data, and updates that process's page-table entry.

From each process's viewpoint:

separate memory.

Underneath:

shared until modification.

This is a powerful optimization built entirely around mapping semantics.

## Huge pages change granularity

Larger page sizes reduce the number of mappings needed for large memory regions and can reduce TLB pressure.

They can also waste more memory through internal fragmentation and complicate allocation.

Databases and large-memory workloads sometimes benefit.

There is no rule that huge pages are always faster.

Measure workload and platform behaviour.

## Page tables are process security data

If an attacker can arbitrarily modify page tables, process isolation collapses.

That is why page-table management is privileged.

Kernel vulnerabilities around mapping, permissions, or speculative execution can have severe consequences.

Virtual memory is therefore both a performance system and a security system.

## Exercise: inspect mappings, then imagine translations

On Linux:

    cat /proc/self/maps

Choose one mapped region.

Ask:

Virtual address range?

Permissions?

File-backed or anonymous?

Now imagine the kernel's page tables mapping parts of that range to physical frames.

The proc file does not show every page-table entry.

It shows the higher-level mapping abstraction.

That separation is useful.

## The lesson to carry forward

Page tables implement the virtual-memory contract.

They map pages, enforce permissions, support sparse address spaces, and enable mechanisms such as copy-on-write and demand paging.

The TLB makes repeated translations fast.

When memory bugs or performance issues cross this boundary, "RAM" is too vague.

You need to ask about mappings, faults, permissions, and translation behaviour.

## Interactive companion exercise

Translate a virtual address into page number, offset, frame, and physical address in the [virtual-memory page-table explorer](../prototypes/interactive-system-design.html#vm-title). An absent mapping demonstrates a page fault.
