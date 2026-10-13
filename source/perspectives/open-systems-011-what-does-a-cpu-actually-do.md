---
title: "What Does a CPU Actually Do?"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-011-what-does-a-cpu-actually-do.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "A CPU repeatedly fetches, interprets, and executes instructions while moving data through registers, caches, memory, and devices. The useful model is a state machine, not a mysterious brain."
eyebrow: "Open Systems Course · Lesson 11 of 180"
---

A CPU is often called the brain of a computer. The metaphor is memorable and usually unhelpful.

A processor does not sit inside the machine deciding what the user meant. It implements an instruction-set architecture and repeatedly changes machine state according to instructions and events.

NIST describes a CPU as the central processing component of a computer, while processor architecture manuals define the actual registers, instructions, memory model, interrupts, and execution environment programmers and operating systems depend on.

A better first question is:

What state can the processor see, and what operations can change that state?

## The smallest useful model

Imagine a simplified processor with:

- a program counter;
- a few registers;
- an arithmetic and logic unit;
- an instruction decoder;
- a connection to memory.

Its loop can be described conceptually as:

    locate next instruction
    fetch instruction
    interpret instruction
    obtain required operands
    perform operation
    store result
    choose next instruction

Real processors are far more complicated. They pipeline work, predict branches, execute operations out of order, rename registers, use multiple cache levels, execute vector instructions, and contain many specialized units.

But those techniques accelerate an architectural contract. They do not remove it.

## Instructions change state

Suppose an imaginary instruction says:

    ADD R1, R2, R3

We define it to mean:

    R1 = R2 + R3

Before:

    R2 = 5
    R3 = 7

After:

    R1 = 12

The important event is a state transition.

Another instruction may load data from memory.

Another may store data.

Another may compare two values.

Another may change the address of the next instruction, creating a branch.

A running program is therefore a long controlled sequence of state transitions.

## Why registers are close to the center

Processors need working values immediately available to execution units.

Registers provide named architectural storage directly associated with the CPU execution model.

Intel's architecture manuals, for example, describe general-purpose registers, instruction pointers, flags, vector registers, control registers, and other register classes for Intel 64 and IA-32 processors.

Other architectures use different register sets.

Do not memorize one vendor's register names as if they were universal.

The general concept is what matters:

Registers are a processor's smallest, most directly accessible architectural working state.

## A CPU does not work alone

An instruction that needs data may find it in a register.

If not, the data may be in cache.

If it is not in the required cache level, the processor may need to fetch it from another cache level or main memory.

That latency difference matters enormously.

The CPU can execute arithmetic much faster than main memory can satisfy many accesses. This gap is one reason memory hierarchies exist.

The processor therefore spends much of its engineering complexity trying to keep useful data close.

We will open cache and RAM in later lessons.

## The CPU is also an event handler

Execution is not always a smooth uninterrupted stream.

Hardware interrupts can demand attention.

Exceptions can occur because an instruction encountered a condition such as an invalid operation, page fault, or protection violation.

Operating systems use these mechanisms to regain control, handle devices, manage memory, and isolate processes.

So a processor must support controlled transitions between different execution contexts.

This is where CPU architecture becomes part of operating-system architecture.

## Modern CPUs execute more than one thing

A modern machine may contain multiple physical cores.

Each core may support one or more hardware threads.

Software processes and threads are scheduled across those execution resources by the operating system.

This means the phrase "the CPU is running my program" hides several scheduling questions:

Which core?

For how long?

Was the thread interrupted?

Did it migrate?

What else is sharing caches and memory bandwidth?

Concurrency begins in software, but it meets real hardware resources.

## Clock speed is not a complete performance measure

A 4 GHz processor has a clock whose frequency is four billion cycles per second.

That does not mean it completes exactly four billion useful program instructions per second.

Instructions differ in cost. Multiple instructions may overlap. Some operations can be issued in parallel. Cache misses can stall progress. Branch prediction can waste speculative work. Vector instructions may process many data elements at once.

Comparing CPUs by clock frequency alone is therefore unsafe.

Performance depends on workload and the complete microarchitecture.

This principle will return throughout the course: a single metric rarely describes a whole system.

## A CPU is not the computer

Remove memory and the processor has nowhere practical to keep a large working program.

Remove storage and persistent state disappears.

Remove I/O and the system cannot interact meaningfully with its environment.

Remove power and clocks and nothing executes.

The CPU is central to general-purpose computation, but the computer is a system.

This matters when debugging performance. High CPU usage can be the problem, but a slow application may instead be waiting on disk, network, locks, another service, or user input.

"Computer slow" is not equivalent to "CPU slow."

## Exercise: act like a tiny processor

Use four paper boxes labeled R0, R1, R2, R3.

Set:

    R1 = 3
    R2 = 4

Now execute:

    ADD R0, R1, R2
    ADD R0, R0, R1

After the first instruction, R0 becomes 7.

After the second, R0 becomes 10.

You just simulated architectural state transitions.

Now add a program counter and number each instruction.

Add a branch:

    IF R0 > 8, jump to instruction 6

The moment you add the branch, the next instruction depends on current state.

That is the beginning of programmable control flow.

## The lesson to carry forward

A CPU is best understood as a machine that executes an architectural contract.

It maintains processor state, interprets instructions, performs operations, accesses memory, responds to events, and coordinates with the rest of the system.

Modern processors use extraordinary internal machinery to make that contract fast.

But the mental model starts small:

    instruction + current state -> new state

The next lesson opens the object driving those transitions: the instruction itself.
