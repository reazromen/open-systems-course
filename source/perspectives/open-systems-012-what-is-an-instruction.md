---
title: "What Is an Instruction?"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-012-what-is-an-instruction.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "A machine instruction is an encoded operation defined by an instruction-set architecture. Source code eventually becomes these operations, but one source statement rarely maps to one universal instruction."
eyebrow: "Open Systems Course · Lesson 12 of 180"
---

Write this in a high-level language:

    total = price + tax

To a human, it is one idea.

To a processor, there is no universal instruction called "calculate the final price."

The source language, compiler or runtime, data types, target architecture, optimization choices, and current program state determine which machine instructions are ultimately executed.

A machine instruction is an encoded operation defined by an instruction-set architecture, or ISA.

## The ISA is a contract

An ISA defines the programmer-visible behaviour of a processor family.

It may specify:

- available instructions;
- registers;
- data types;
- addressing modes;
- memory behaviour;
- exceptions;
- privilege mechanisms.

Intel publishes volumes of instruction references for Intel 64 and IA-32. RISC-V publishes an open ISA specification organized into base instructions and extensions.

Their instruction encodings and registers differ.

Yet both serve the same architectural purpose: software and hardware need an agreed contract for what encoded instructions mean.

## An instruction has structure

An imaginary fixed-format instruction might contain fields such as:

    operation | destination | source A | source B

For example:

    ADD | R1 | R2 | R3

The processor's decoder interprets those fields according to the ISA.

Real instruction encodings can be much more complicated. Some architectures use mostly fixed-width instructions; others support variable-length encodings. Extensions add vector, cryptographic, floating-point, or specialized operations.

The byte pattern has meaning only because the architecture specification defines it.

This is another example of representation requiring context.

## Instructions are not source-language statements

Consider:

    x = a + b

Depending on language and types, executing this idea may require instructions to:

- load values;
- perform arithmetic;
- store a result;
- check types;
- allocate objects;
- detect overflow;
- call runtime helpers.

An optimizing compiler might eliminate the calculation entirely if the result is unused.

A dynamic-language runtime may decide what operation to perform only after observing runtime types.

So the mapping:

    one source line = one CPU instruction

is usually wrong.

The layers are related, not identical.

## Operands need locations

An instruction must know where its inputs come from and where results go.

Operands might be:

- registers;
- immediate constants encoded in the instruction;
- memory locations;
- addresses computed from registers and offsets.

An instruction such as:

    ADD R1, R2, 5

might conceptually mean:

    R1 = R2 + 5

The constant 5 is immediate data.

Another operation may load from a memory address derived from a base register plus an offset.

Addressing modes are part of the ISA because they define how instructions locate data.

## Control-flow instructions change the future

Arithmetic changes values.

Branches change which instruction executes next.

Imagine:

    compare R1 with 0
    if equal, jump to address X

That is enough to build conditions and loops.

A function call also changes control flow while preserving information needed to return.

Operating systems eventually rely on privileged control transfers for system calls and exception handling.

The architecture therefore provides not just computation but controlled movement through a program.

## Instructions can fail or trap

A processor may encounter conditions that prevent ordinary execution.

Examples include:

- invalid instruction encoding;
- divide error;
- protection violation;
- page fault.

The architecture defines how such events transfer control.

Some events are not "bugs" in the simple sense. A page fault, for example, can be part of normal virtual-memory operation: the operating system may handle it and resume execution.

This is why instruction execution connects directly to operating-system design.

## Microarchitecture is not the ISA

Two processors can implement the same ISA while using very different internal designs.

One may have a deeper pipeline.

Another may have larger caches.

One may execute more operations in parallel.

Another may consume less power.

Software sees the architectural contract.

Performance emerges from the implementation plus the workload.

This separation is one of the most powerful abstractions in computer architecture.

## Some instructions do surprisingly large things

A simple teaching CPU may have operations closely resembling arithmetic and load/store primitives.

Modern ISAs may include vector instructions operating on many data elements, cryptographic primitives, atomic operations, virtualization support, and specialized state management.

But complex instructions do not eliminate the systems questions.

Where are operands?

What state changes?

What exceptions can occur?

What ordering guarantees apply?

What does software assume?

The same method scales.

## Exercise: invent an ISA

Create a tiny processor with four registers and only six operations:

    LOAD
    STORE
    ADD
    SUB
    JUMP
    JUMP_IF_ZERO

Now write a program that adds the numbers 1 through 5.

You will quickly need decisions:

How are constants loaded?

How are memory addresses represented?

How does the machine know when to stop?

What width are values?

What happens on overflow?

These are ISA-design questions.

A tiny instruction set exposes why architecture specifications need precision.

## The lesson to carry forward

A machine instruction is not an English command and not a source-code line.

It is an encoded operation whose meaning comes from an instruction-set architecture.

The CPU repeatedly interprets these operations to transform state.

Compilers, runtimes, operating systems, and applications build much richer abstractions above them.

When someone says "the processor executes code," ask one level deeper:

**Which instructions, operating on which state, under which architecture?**
