---
title: "What Happens During Boot?"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-060-what-happens-during-boot.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 13
excerpt: "Boot is a chain of trust and handoffs: platform firmware initializes enough hardware to select a boot path, a loader starts the kernel, early userspace prepares the root system, and PID 1 starts services."
eyebrow: "Open Systems Course · Lesson 60 of 180"
---

Press the power button.

Seconds later you have a login screen.

What executed first?

Not your desktop.

Not systemd.

Not the Linux kernel.

Boot is a chain of handoffs from minimal machine state toward a fully initialized operating system.

Exact steps vary by platform.

This lesson gives a Linux-PC mental model and marks the boundaries that can differ.

## Power creates initial hardware state

Processors begin execution from architecture-defined reset state.

Platform firmware runs.

On modern PCs this is commonly UEFI firmware.

Firmware initializes enough hardware to continue boot, discovers devices, applies platform configuration, and selects a boot target according to its rules.

At this stage, Linux is not yet managing the machine.

## Firmware starts a bootloader or kernel image

A boot manager or bootloader locates an operating-system image.

On Linux systems, common paths include GRUB, systemd-boot, direct UEFI kernel loading, or platform-specific mechanisms.

The loader places the kernel and related data into memory and transfers control.

The bootloader's job is not to run your normal services.

It gets the kernel started with the information it needs.

## The kernel initializes core subsystems

Linux begins setting up:

- memory management;
- scheduler;
- interrupts;
- device discovery;
- drivers;
- filesystems;
- networking foundations.

Kernel command-line parameters influence behaviour.

At first, the final root filesystem may not yet be available.

The machine needs an early userspace environment.

## initramfs solves early dependencies

Linux commonly uses an initial RAM filesystem, or initramfs, containing early userspace programs and drivers needed before the real root filesystem can be mounted.

Examples:

- storage driver setup;
- RAID assembly;
- encrypted disk unlock;
- LVM activation;
- network root preparation.

The early environment finds and prepares the real root.

Then the system switches into it.

Older documentation may discuss initrd; current Linux systems commonly use initramfs designs.

## PID 1 begins userspace orchestration

After the kernel has a root filesystem, it starts the initial userspace process.

On many mainstream Linux distributions, PID 1 is systemd.

Other init systems exist.

PID 1 is special because it begins the user-space service hierarchy and has process-management responsibilities.

A typical systemd machine then activates targets, mounts, sockets, services, timers, and other units according to dependencies.

## Services start through dependency graphs

Networking may need devices.

A web service may need networking.

An application may need a database.

Mounts may need storage.

Service startup is therefore not simply:

    run script 1
    run script 2
    run script 3

Modern init systems model dependencies and can start independent units concurrently.

Boot becomes a graph scheduling problem.

## Login is only another stage

A graphical login screen requires:

- kernel;
- display hardware;
- user-space graphics stack;
- display manager;
- input;
- services.

A console login requires less.

An embedded server may never start graphics at all.

"Boot complete" depends on the intended machine role.

A headless server can be fully operational with no GUI.

## Failure location changes debugging

Black screen before firmware logo?

Very early platform or display problem.

Bootloader prompt?

Firmware reached bootloader.

Kernel panic?

Bootloader successfully started kernel.

Emergency shell in initramfs?

Kernel and early userspace ran, but root preparation failed.

systemd service failed after login?

Much later userspace issue.

The boot chain narrows the investigation.

## Secure Boot adds a trust chain

UEFI Secure Boot can verify signatures in the early boot path according to enrolled trust policy.

The goal is to prevent unauthorized boot software from executing before the OS security model is established.

This does not guarantee the entire system is secure.

It protects a defined part of boot integrity.

Trust chains always have boundaries.

## Exercise: inspect one Linux boot

On a system you own:

    dmesg
    journalctl -b

The first focuses largely on kernel messages.

The second can show journal entries for the current boot on systemd systems.

Look for stages:

- kernel start;
- storage;
- network;
- mounts;
- services.

Do not change anything.

Build a timeline.

## The lesson to carry forward

Boot is not one program starting.

It is a sequence:

    reset
      -> firmware
      -> bootloader
      -> kernel
      -> early userspace
      -> root filesystem
      -> PID 1
      -> services
      -> login/application

Each handoff has its own state, logs, configuration, and failure modes.

Module 7 now stays inside a running Linux system and learns to inspect those mechanisms directly.
