---
title: "Processes in /proc"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-064-processes-in-proc.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 11
excerpt: "Linux procfs exposes kernel and process state as a pseudo-filesystem. /proc/PID turns a running process into inspectable mappings, descriptors, status, limits, and more."
eyebrow: "Open Systems Course · Lesson 64 of 180"
---

Linux gives you a remarkable observability interface:

    /proc

It looks like a directory tree.

It is not ordinary persistent storage.

The Linux manual describes proc as a pseudo-filesystem that provides an interface to kernel data structures.

## Every process gets a directory

A running process with PID 1234 appears under:

    /proc/1234/

When the process exits and is fully gone, that directory disappears.

Inside are views into command line, status, memory maps, file descriptors, limits, mounts, namespaces, and scheduling-related state.

Exact visibility depends on permissions and kernel configuration.

## status gives a compact process view

For your current shell in Bash:

    cat /proc/$$/status

Fields can include process name, state, PID, parent PID, UID/GID, memory statistics, capability masks, and thread count.

These are live kernel-maintained facts exposed as text.

Tools such as ps and top derive process information from kernel interfaces rather than a static process database.

## maps shows the address space

Run:

    cat /proc/$$/maps

You can see regions corresponding to executable mappings, libraries, stack, heap, and anonymous memory.

Each region has addresses and permission flags.

This connects directly to virtual-memory lessons.

The process abstraction becomes visible.

## fd exposes open descriptors

Run:

    ls -l /proc/$$/fd

Linux documents one entry per open descriptor, with links that can identify regular files, pipes, sockets, and other resources.

If a service says "too many open files," this is useful evidence.

If a deleted logfile still consumes disk space, an open descriptor can explain why storage has not yet been reclaimed.

## procfs also exposes system-wide state

Examples include:

    /proc/cpuinfo
    /proc/meminfo
    /proc/interrupts

Some files under /proc/sys expose kernel tunables.

Reading is observation.

Writing can change live system behaviour.

Never treat tunables as harmless text files.

## Containers change the view

PID namespaces alter process visibility.

PID 1 inside a container is not necessarily PID 1 on the host.

A container-mounted procfs can show namespace-scoped process state.

Same path syntax.

Different visible kernel objects.

Namespace context matters.

## Permissions matter

Linux can restrict procfs visibility using options such as hidepid.

Security policy can limit access to process information.

That is reasonable because command lines, descriptors, and environments can contain sensitive information.

Observability itself needs an access-control model.

## Exercise: inspect your shell

Run:

    echo $$
    cat /proc/$$/status
    ls -l /proc/$$/fd
    head /proc/$$/maps

You are looking at one process from several angles:

identity, descriptors, memory.

Now launch a child command and inspect its PID.

The OS abstraction becomes concrete.

## The lesson to carry forward

/proc demonstrates interface design beautifully.

Kernel state is exposed through a pseudo-filesystem so ordinary user-space tools can inspect it.

When diagnosing Linux, ask the kernel what it knows.

Do not rely only on the application's story.
