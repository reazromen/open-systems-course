---
title: "Interrupts, Exceptions, and Syscalls"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-058-interrupts-exceptions-and-syscalls.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "Interrupts, exceptions, and system calls all transfer control into privileged handling paths, but they begin for different reasons: external events, execution conditions, or explicit application requests."
eyebrow: "Open Systems Course · Lesson 58 of 180"
---

A network packet arrives.

A program divides by zero.

An application asks to open a file.

All three events can cause execution to enter kernel or privileged handling paths.

They are not the same thing.

Distinguishing interrupts, exceptions, and system calls makes operating-system behaviour far easier to understand.

## Interrupt: something external needs attention

A device completes work.

A timer fires.

A network interface receives traffic.

Hardware can signal an interrupt.

The event is asynchronous relative to the currently executing user instruction stream.

The processor temporarily transfers control to an interrupt-handling path.

The kernel records or services the event and eventually returns to interrupted work or schedules something else.

The application did not explicitly ask for this event at that instant.

## Exception: current execution caused a condition

A processor instruction encounters:

- page fault;
- invalid opcode;
- divide error;
- protection violation.

The current execution directly triggered the condition.

The CPU transfers control according to architecture-defined exception mechanisms.

The OS decides what happens next.

Some exceptions are normal mechanisms.

A page fault can cause the kernel to map data and resume.

Others terminate the process.

"Exception" at CPU architecture level is not identical to a high-level language exception, although language runtimes may build on lower mechanisms.

## Syscall: software asks for privileged work

A user process wants:

    open file
    create socket
    map memory

It intentionally invokes a system-call interface.

The transition is synchronous with that instruction path.

The kernel receives a syscall number and arguments under the platform's ABI.

It validates and performs the operation.

This is the cooperative route into kernel services.

## The three paths can interact

Application calls read on a socket.

No data is available.

Kernel blocks the thread.

Later a network interrupt arrives.

Kernel processes received packets.

The waiting socket becomes readable.

Scheduler wakes the thread.

read returns.

One source-level call crossed:

    syscall
    scheduling
    interrupt
    network stack
    wakeup
    return

That is why system performance cannot always be inferred from source code.

## Interrupt handlers must be controlled

Hardware events can arrive rapidly.

If the kernel performed unlimited expensive work immediately in interrupt context, ordinary execution could be starved.

Operating systems therefore structure device handling into immediate and deferred work according to subsystem design.

Linux networking uses mechanisms such as NAPI to balance interrupt-driven notification with polling under load.

The exact mechanisms evolve.

The general problem is constant:

How much work should happen immediately versus later?

## Exceptions preserve precise state

When an exception occurs, the system needs enough execution state to understand where it happened and whether execution can resume.

The architecture defines saved instruction position and status according to event type.

The OS may:

- fix condition;
- signal process;
- terminate process;
- panic if kernel cannot recover.

Precise machine state makes recovery and debugging possible.

## System calls are an API and a security boundary

A syscall accepts untrusted arguments from user space.

Pointers may be invalid.

Lengths may be malicious.

Permissions may be insufficient.

Kernel code must validate them carefully.

A vulnerability in syscall handling can cross the user/kernel isolation boundary.

This is why kernel interfaces receive extensive security scrutiny.

## Exercise: classify the path

Classify:

1. User program calls write.
2. Timer expires while browser runs.
3. Process accesses unmapped memory.
4. Keyboard reports a key press.
5. Program requests mmap.
6. CPU encounters invalid instruction.

Answers:

syscall, interrupt, exception, interrupt, syscall, exception.

Then ask what kernel subsystem handles each.

Now the machine feels less like one opaque loop.

## The lesson to carry forward

Interrupts, exceptions, and syscalls all create controlled changes in execution flow.

But their causes differ:

    interrupt -> external event
    exception -> current execution condition
    syscall   -> explicit software request

That distinction helps explain I/O, scheduling, memory faults, devices, security, and process behaviour.

## Interactive companion exercise

Use the [system-call timeline](../prototypes/interactive-system-design.html#os-timeline-title) to see a user/kernel privilege transition. It does not model hardware interrupt latency or exception dispatch.
