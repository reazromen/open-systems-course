---
title: "Following One Instruction Through the Machine"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-020-following-one-instruction-through-machine.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 14
excerpt: "One addition instruction connects program counters, instruction caches, decoding, registers, execution units, retirement, memory hierarchy, and operating-system context."
eyebrow: "Open Systems Course · Lesson 20 of 180"
---

We have opened the CPU, instruction set, registers, pipeline, cache, RAM, storage, and interconnects.

Now follow one tiny operation end to end.

Use an imaginary instruction:

    ADD R1, R2, R3

Its architectural meaning is:

    R1 = R2 + R3

That looks almost too simple to deserve an article.

The point is not the arithmetic.

The point is how many layers cooperate to make the architectural state change happen.

## Before the instruction: a process is already running

Some operating-system thread has been scheduled onto a processor core.

The processor has execution context associated with that thread.

Among the relevant architectural state are:

- instruction pointer;
- general registers;
- privilege state;
- memory mappings.

The instruction does not appear from nowhere.

A whole operating-system scheduling and memory system made this moment possible.

We will study that later.

## Step 1: the processor needs the instruction bytes

The instruction pointer identifies the next architectural instruction address.

The processor's front end attempts to fetch the corresponding instruction bytes.

Best case: they are already available in a nearby instruction cache.

If not, lower cache levels may be accessed.

If the data is absent there too, main memory can become involved.

The logical program says:

"execute the instruction at address X."

The physical machine says:

"first I need to obtain the bytes representing that instruction."

This is why cache can affect execution even when the instruction semantics are trivial.

## Step 2: the address itself needs translation

A user-space program normally operates in a virtual address space.

The instruction address is virtual.

Hardware and operating-system-managed page tables cooperate to translate virtual addresses toward physical memory locations.

Processors cache recent address translations in structures such as Translation Lookaside Buffers.

If a required mapping is not currently usable, address-translation work or a page fault may occur.

So even "fetch address X" hides another mapping layer.

The source program never asked for this machinery.

The process abstraction depends on it.

## Step 3: decode the bits

The instruction decoder interprets the fetched bytes according to the instruction-set architecture.

It determines:

    operation = addition
    sources   = R2, R3
    destination = R1

A complex processor may translate the architectural instruction into internal micro-operations.

A simpler processor may control execution more directly.

Different implementations.

Same architectural obligation.

## Step 4: obtain operands

The machine needs the current architectural values corresponding to R2 and R3.

Modern processors may use internal register-renaming mechanisms so architectural register names map to a larger physical register pool.

That helps remove false dependencies and supports out-of-order execution.

But from the program's viewpoint, the semantics remain:

read R2, read R3.

Suppose:

    R2 = 20
    R3 = 22

Now the execution unit has operands.

## Step 5: schedule execution

The addition may wait until:

- operands are ready;
- an appropriate execution unit is available;
- dependencies permit execution.

In an out-of-order processor, younger independent instructions may execute while an older instruction waits.

This is the point where the simple fetch–decode–execute story becomes a scheduling system.

Yet correctness still depends on preserving program-visible rules.

## Step 6: arithmetic happens

An arithmetic unit performs the addition:

    20 + 22 = 42

At a digital-logic level, networks of gates and state elements implement arithmetic.

At a transistor level, physical electrical behaviour implements those gates.

We could keep descending.

For this investigation, the addition unit is a useful abstraction boundary.

Its output is the value 42 plus any relevant status information defined by the architecture.

## Step 7: result becomes architecturally visible

High-performance processors distinguish internal execution from retirement or commitment.

The addition may finish internally before the processor can make it part of the precise architectural state.

Older instructions may need to retire first.

If earlier speculative assumptions were wrong, some internal work could be discarded.

Eventually the architecture must behave as though:

    R1 = 42

occurred in the valid program order.

That is the contract software relies on.

## What if an operand came from memory?

Change the instruction sequence:

    LOAD R2, [address]
    ADD  R1, R2, R3

Now performance depends on where the loaded data lives.

L1 hit?

Lower cache?

RAM?

Page not resident?

Each possibility changes latency.

The ADD did not become more complicated.

Its dependency chain did.

This is why performance tools examine stalls, cache misses, branches, and memory behaviour rather than counting arithmetic operations alone.

## What if an interrupt arrives?

The processor may need to transfer control to an interrupt handler according to architecture and operating-system rules.

The system preserves enough state to later continue the interrupted execution correctly.

The instruction stream belongs to one thread, but the hardware and OS can temporarily execute other work.

Again, the application source code does not show this.

The platform makes multitasking possible underneath it.

## What if the process is descheduled?

The operating system can stop the thread.

Its execution context, including architectural register state, is preserved.

Another thread runs.

Later the original thread resumes.

From the program's logical perspective, the next instruction continues.

From wall-clock time, perhaps milliseconds passed.

This is another reason program execution is not identical to continuous CPU occupation.

## Draw the whole path

A compact diagram:

    process scheduled
        ↓
    instruction pointer
        ↓
    virtual address translation
        ↓
    instruction cache / memory hierarchy
        ↓
    decode
        ↓
    operand readiness
        ↓
    execution unit
        ↓
    speculative/internal result
        ↓
    retirement
        ↓
    architectural register state

Now surround the diagram with:

- interrupts;
- scheduling;
- cache hierarchy;
- memory;
- power and clocks.

One ADD instruction now touches nearly every concept from Module 2.

## Exercise: add one failure at each layer

Take the diagram and imagine one problem:

Instruction fetch: required page not resident.

Decode: invalid instruction.

Operands: dependency not ready.

Execution: divide instruction instead of add, divisor zero.

Retirement: earlier branch prediction was wrong.

Scheduling: thread is preempted.

Hardware: machine check or power loss.

Some are normal handled events.

Some are program errors.

Some are hardware failures.

The exercise teaches you not to use one generic word such as "CPU error."

Different mechanisms produce different evidence.

## The lesson to carry forward

One machine instruction is small enough to understand and large enough to reveal the whole machine.

It depends on process context, address translation, instruction fetch, caches, registers, scheduling, execution units, retirement, and the operating system's ability to interrupt and resume execution.

The source line sits far above this path.

That is not a problem.

Abstraction lets us write useful software without tracing every instruction.

Systems knowledge gives us the option to descend when correctness or performance demands it.

Module 3 now moves upward again:

How does human-written source code become a running process that can execute instructions like this one?
