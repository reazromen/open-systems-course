---
title: "What Is a Process?"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-025-what-is-a-process.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 13
excerpt: "A process is a running program plus managed execution state: address space, open resources, identity, scheduling context, and kernel bookkeeping. The executable file is only the starting artifact."
eyebrow: "Open Systems Course · Lesson 25 of 180"
---

A program is installed on disk.

Nothing is running.

Now launch it.

The operating system creates or arranges an execution context.

Memory exists.

Open files appear.

A process ID exists.

CPU time is scheduled.

The program has become a process.

That distinction is one of the foundations of operating systems.

## Program is passive; process is active state

An executable file contains code and data suitable for loading.

A process contains changing runtime state.

Conceptually:

    program file
       +
    address space
       +
    registers
       +
    open resources
       +
    credentials
       +
    scheduling state
       =
    process

This is not a formal equation.

It is a checklist for thinking.

If you copy an executable file, you copy persistent bytes.

If you fork a process, Linux creates another process context with defined relationships to the parent.

Different operation.

## A process gets an identity

Operating systems assign identifiers to processes.

On Linux, a PID identifies a process within the relevant PID namespace.

Processes also have relationships:

- parent;
- process group;
- session.

They execute under user and group credentials.

These identifiers let the kernel and tools refer to execution state.

When you run ps, top, kill, or inspect /proc, you are interacting with process abstractions.

## A process owns or references resources

A running process can hold:

- virtual memory mappings;
- open file descriptors;
- sockets;
- current working directory;
- environment;
- signal dispositions;
- credentials.

Some resources are copied, shared, inherited, or transformed across process creation and execution according to operating-system rules.

This explains why child processes can inherit open descriptors and environment from parents.

Process creation is not just "start code."

It establishes relationships among resources.

## Virtual memory isolates address spaces

Two processes may both use a virtual address such as:

    0x400000

without referring to the same physical memory.

Virtual memory gives each process an address-space abstraction.

The kernel and memory-management hardware control translations and permissions.

This prevents one ordinary process from casually overwriting another process's memory.

Isolation is a system property built from hardware and operating-system mechanisms.

We will open virtual memory in Lesson 27.

## The process is scheduled, not continuously running

A process can be:

- running;
- runnable;
- sleeping or waiting;
- stopped;
- terminated.

Terminology differs by operating system.

The key point is that "process exists" does not mean "CPU is executing it right now."

A process waiting for network input can consume almost no CPU while remaining alive.

A process with many runnable threads can compete heavily for CPU.

The scheduler decides which runnable execution contexts receive processor time.

## fork and exec reveal two different ideas

Linux makes a useful distinction visible.

fork creates a child process based on the parent.

execve replaces the current process's program image with a new program; the manual explicitly warns that describing execve as creating a new process is misleading because the PID and many process attributes remain.

So:

    create process
    execute program

are conceptually distinct operations.

That separation helps explain shells.

A shell can create a child, arrange redirection, then execute a requested program in the child.

## Exit does not instantly erase every trace

When a process terminates, the kernel preserves enough information for the parent to collect its exit status.

On Unix-like systems, an exited child that has not yet been reaped can remain as a zombie process entry.

The program is no longer running.

The process table still contains termination information.

Again, state has lifecycle.

"Stopped executing" and "all metadata gone" are different events.

## Daemons and services are still processes

A web server running in the background may be managed by systemd.

A database may fork workers.

A container may contain several processes.

The word service describes a responsibility.

Process describes an execution abstraction.

One service can use many processes.

One process can provide several logical capabilities.

Do not equate architecture layers based on names.

## Process boundaries matter for failure isolation

If one process crashes, another process with isolated memory can often continue.

That is one reason browsers, servers, and service architectures sometimes use multiple processes.

The boundary has costs:

- inter-process communication;
- duplicated state;
- context switching;
- coordination.

Architecture trades isolation against communication overhead and complexity.

There is no universal rule that more processes are better.

## Exercise: watch a process lifecycle

On Linux:

1. run a command such as sleep 30 in one terminal;
2. find its PID with ps;
3. inspect /proc/PID;
4. observe open descriptors under /proc/PID/fd if permissions allow;
5. let it exit;
6. inspect again.

The directory disappears after the process is fully gone.

You have watched an operating-system abstraction exist and then cease.

The executable file remains.

That difference is the lesson.

## The lesson to carry forward

A process is not a file and not merely "an app."

It is a managed execution context containing program state, memory, resources, identity, and scheduling information.

The operating system creates the illusion that many such contexts can execute safely on shared hardware.

Next we open a process and discover that it can contain multiple execution flows: threads.
