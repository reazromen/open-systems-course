---
title: "Why Operating Systems Exist"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-051-why-operating-systems-exist.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "An operating system turns shared hardware into controlled abstractions: processes, address spaces, files, sockets, devices, identities, and time."
eyebrow: "Open Systems Course · Lesson 51 of 180"
---

Imagine giving every application direct control of the CPU, RAM, storage controller, network card, keyboard, and display.

Two applications want the CPU at once.

Both choose the same memory address.

One writes to the disk while another assumes the data is unchanged.

A browser reads a password manager's memory because nothing stops it.

A text editor reprograms the network interface by mistake.

This is not a usable general-purpose system.

An operating system exists partly to turn shared physical resources into controlled abstractions.

## The OS is a resource manager

Hardware is finite.

CPU time must be shared.

RAM must be allocated.

Devices must be coordinated.

Storage needs names and permissions.

Network interfaces need multiplexing.

The operating system manages these resources and decides who may use them.

OSTEP describes operating systems through three broad themes: virtualization, concurrency, and persistence.

That framing is powerful because it explains what the OS gives programs rather than treating the OS as a desktop skin.

## The OS virtualizes the CPU

One machine may have eight CPU cores while hundreds of processes exist.

The OS scheduler switches runnable work across available CPUs.

Each process can behave as if it has an execution context of its own.

It does not literally own a CPU continuously.

The abstraction is:

    process -> appears to execute

The mechanism includes:

    scheduling
    context switching
    timers
    interrupts
    processor privilege

The illusion is useful enough that most application code can ignore the exact schedule.

## The OS virtualizes memory

A process sees a virtual address space.

Another process sees another.

Both may use the same numerical addresses while the kernel and hardware map them differently.

This creates isolation and flexible placement.

The application writes pointers.

It usually does not select physical DRAM rows.

The abstraction is an address space.

The mechanism includes page tables, permissions, translation caches, faults, and physical page management.

## The OS gives storage names

An SSD exposes persistent blocks through a device interface.

Applications generally want:

    /home/user/report.txt

not:

    block 98122, offset 4096

A filesystem turns storage into names, directories, metadata, permissions, and file operations.

The kernel can then expose a common file interface even when underlying filesystems differ.

The name is an abstraction over storage layout.

## The OS mediates devices

A camera, network adapter, GPU, disk, keyboard, and USB device have different hardware protocols.

Device drivers translate between OS interfaces and hardware-specific operations.

Applications can use higher-level interfaces instead of reimplementing every controller protocol.

This creates a valuable separation:

    application
      -> OS interface
      -> driver
      -> hardware

When a device fails, the investigation can move through those layers.

## The OS is a protection boundary

The kernel runs with privileges ordinary applications do not have.

Applications run in user space with restricted authority.

System calls let programs request protected operations.

The kernel checks identity, permissions, arguments, and resource state.

This does not make software automatically secure.

It creates an enforcement point.

Without protection boundaries, one ordinary application bug could compromise the whole machine far more easily.

## The OS provides common mechanisms, not every policy

A kernel can provide process scheduling.

A service manager can decide which services start.

A desktop environment decides how windows look.

A package manager installs software.

A shell interprets commands.

People casually call all of these "the operating system."

That can be fine in ordinary conversation.

For engineering, separate the layers.

Linux is a kernel.

A Linux distribution combines that kernel with user-space software, libraries, tools, package management, init/service management, and often a desktop.

That distinction will matter in Module 7.

## The OS is not always large

A microcontroller firmware can run without a general-purpose operating system.

One main loop may control everything.

A real-time operating system may provide tasks, queues, timers, and synchronization with much smaller scope.

An embedded Linux system may run a full kernel and user space.

"Needs an OS" is therefore a system-design question.

If one program controls one simple device, direct firmware may be enough.

If many isolated applications share hardware, operating-system abstractions become increasingly valuable.

## Exercise: remove the OS mentally

Take a browser.

Without an OS, what would the browser need to implement itself?

- storage drivers;
- network drivers;
- memory allocation over physical RAM;
- keyboard input;
- graphics output;
- scheduling with other programs;
- permissions;
- timers.

The list becomes absurd quickly.

That is the value of the operating-system boundary.

## The lesson to carry forward

An operating system is not mainly icons, settings panels, or a boot logo.

It is the software layer that manages shared hardware and exposes protected abstractions such as:

- processes;
- threads;
- virtual memory;
- files;
- sockets;
- devices;
- identities;
- clocks.

The rest of this module opens those mechanisms one by one.
