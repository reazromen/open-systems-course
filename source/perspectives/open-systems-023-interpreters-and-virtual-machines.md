---
title: "Interpreters and Virtual Machines"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-023-interpreters-and-virtual-machines.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 13
excerpt: "An interpreter executes a language representation through another program; a virtual machine defines an execution environment above hardware. Real runtimes often combine interpretation, bytecode, native code, and JIT compilation."
eyebrow: "Open Systems Course · Lesson 23 of 180"
---

When you run a Python script, the CPU does not suddenly become a Python processor.

Something else is executing.

In CPython, source is compiled into Python bytecode, and interpreter machinery executes that bytecode.

But the interpreter itself is ordinary native software running as a process on the operating system.

This creates layers:

    Python source
      -> CPython bytecode
      -> interpreter logic
      -> native machine instructions
      -> CPU

The distinction explains what an interpreter actually is.

## Interpretation means another program mediates execution

Imagine a tiny language:

    PUSH 5
    PUSH 7
    ADD
    PRINT

An interpreter can maintain its own virtual stack.

Read PUSH 5.

Push 5.

Read PUSH 7.

Push 7.

Read ADD.

Pop two values, add them, push result.

Read PRINT.

Output 12.

The host CPU is not executing the tiny language's ADD instruction directly.

It is executing the native code of the interpreter that implements the ADD behaviour.

This is software implementing an abstract machine.

## Bytecode is an intermediate instruction set

High-level source syntax can be complicated to parse repeatedly.

A runtime may compile source into a simpler intermediate instruction format.

CPython bytecode is one example, and the Python documentation explicitly cautions that it is a CPython implementation detail that can change between versions.

That warning matters.

Do not design portable Python software around exact bytecode opcodes.

The source-language semantics are the stable abstraction.

The interpreter's internal instruction format is an implementation choice.

## Virtual machine can mean several things

The phrase virtual machine is overloaded.

A language virtual machine such as the JVM defines an abstract execution environment for program bytecode.

A system virtual machine such as a hardware virtualized guest presents a virtual computer on which an operating system can run.

A process virtual machine can provide a runtime abstraction for one program.

These are related by the idea of virtualized execution but differ enormously in scope.

Always ask:

What exactly is being virtualized?

Instruction set?

Operating environment?

Whole hardware platform?

## JIT compilation blurs the category

An interpreter can observe code while it runs.

Some paths execute rarely.

Others run millions of times.

A just-in-time compiler can translate frequently executed code into native machine code during execution.

Then the path becomes:

    source
      -> intermediate representation
      -> profiling
      -> optimized native code
      -> CPU

Later, assumptions may become invalid and the runtime may deoptimize.

Modern language runtimes can therefore contain interpreters and compilers at the same time.

The beginner slogan "compiled versus interpreted" is too coarse.

## Why use an intermediate virtual machine?

A virtual instruction set can create portability.

A compiler targets the virtual machine.

The VM implementation handles differences among host operating systems and processors.

That is one trade-off.

Another is runtime information.

A VM can know object types, call frequencies, class hierarchies, and live execution behaviour unavailable to a purely ahead-of-time compiler.

It can optimize using evidence gathered during execution.

The cost is runtime complexity, startup behaviour, memory overhead, and implementation machinery.

## Runtime services become part of the system

Managed runtimes may provide:

- garbage collection;
- threading abstractions;
- dynamic loading;
- reflection;
- exceptions;
- security checks;
- profiling;
- JIT compilation.

Your program uses these services even if the source never explicitly says "run garbage collector now."

That is why runtime behaviour can produce performance events such as pauses, code compilation, or memory reclamation.

Application debugging sometimes needs runtime observability.

## Python makes the layers inspectable

Python's execution-model documentation distinguishes host machine, process, runtime, interpreter state, thread, and Python thread state as conceptual layers.

The dis module lets you inspect CPython bytecode.

That makes Python a useful teaching tool.

You can write:

    def f(x):
        return x + 1

Then disassemble it.

You will see interpreter operations, not x86 or ARM machine instructions.

The CPU still executes native code underneath.

This is a perfect example of stacked abstractions.

## Virtual machines are not inherently slow

It is tempting to say:

native compiled = fast
virtual machine = slow

That is not a reliable rule.

A JIT can specialize hot code using runtime information.

A native program can be inefficient.

A VM can introduce overhead in one area while enabling optimization in another.

Performance must be measured on the actual workload and implementation.

Architecture gives you hypotheses.

Benchmarks provide evidence.

## Exercise: build a four-operation interpreter

In any language you already know, represent a program as a list:

    PUSH 2
    PUSH 3
    ADD
    PRINT

Write an interpreter loop with:

- instruction pointer;
- stack;
- switch or match on opcode.

Now you have created:

- an instruction set;
- machine state;
- an execution loop;
- an abstract machine.

The project is tiny.

The concept is the same foundation used by much larger runtimes.

## The lesson to carry forward

Interpreters and virtual machines demonstrate that "instruction" depends on the layer.

A Python bytecode instruction is an instruction to CPython's abstract execution machinery.

A machine instruction is an instruction under the hardware ISA.

The host processor ultimately executes native machine instructions, even when those instructions implement another machine in software.

Once you see this layering, runtimes stop looking magical.
