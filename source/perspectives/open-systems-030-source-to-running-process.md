---
title: "From Source File to Running Process"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-030-source-to-running-process.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 14
excerpt: "A complete path connects source code, compilation or interpretation, object files, linking, executable formats, loading, virtual memory, processes, runtimes, system calls, and CPU instructions."
eyebrow: "Open Systems Course · Lesson 30 of 180"
---

Module 3 began with a claim:

The CPU does not execute your source file.

Now rebuild the complete path.

We will use a small compiled C program because its stages are easy to expose. Then we will compare a Python program to show which layers change and which remain.

## Stage 1: source

Write:

    #include <stdio.h>

    int main(void) {
        printf("hello\n");
        return 0;
    }

This is C source.

It has language semantics.

It is not yet the final executable representation the CPU will run.

## Stage 2: preprocessing

The C preprocessor handles directives such as includes and macros.

GCC can stop after preprocessing with its documented -E option.

Conceptually:

    main.c
      -> preprocessor
      -> expanded source

The included header does not literally paste a complete libc implementation into your program.

Headers generally provide declarations and definitions needed at compile time.

Library implementation arrives through other build/link/runtime mechanisms.

## Stage 3: compilation

The compiler parses the program, checks rules, builds internal representations, performs transformations, and emits target-specific output.

GCC can emit assembly text.

Now you can see instructions and labels for a target architecture.

But symbolic references and final addresses may still be unresolved.

## Stage 4: assembly

The assembler converts assembly into a relocatable object file.

Now we have binary machine code fragments plus metadata.

The object file can define symbols and reference symbols supplied elsewhere.

ELF is a common object format on Linux systems.

The program is closer to execution but still not necessarily complete.

## Stage 5: linking

The linker combines object files and libraries.

It resolves symbols, performs relocation, and produces an executable or shared object.

If printf cannot be resolved according to the link configuration, the build can fail here.

A linker error therefore tells you something precise:

source translation progressed farther than parsing, but binary pieces could not be connected as required.

## Stage 6: persistent executable

Now an executable file exists on storage.

It contains machine code and metadata used for loading.

Nothing is executing yet.

This is still a program artifact, not a process.

## Stage 7: process launch

A shell or launcher requests execution.

On Unix-like systems, process creation and program replacement may involve operations conceptually represented by fork/exec patterns, although exact launch paths vary.

The kernel validates permissions and prepares a process execution context.

## Stage 8: memory mapping and loading

Executable segments are mapped into the process virtual address space.

The dynamic loader may map shared libraries and resolve dynamic dependencies.

Stack and other runtime memory are prepared.

Arguments and environment are made available.

Control eventually reaches program startup code and then main.

The ELF specification explicitly includes program-loading and dynamic-linking information for this purpose.

## Stage 9: runtime and libraries execute

printf is not a CPU instruction.

The C library implements formatted output logic.

That implementation may buffer data and eventually invoke operating-system services.

The program may call write through a library wrapper.

A system call crosses into the kernel.

The kernel ultimately sends bytes toward the terminal or output stream.

## Stage 10: CPU instructions keep executing underneath

Throughout startup, dynamic linking, libc, your main function, and kernel transitions, processor instructions are executing.

The source-level call:

    printf("hello\n")

corresponds to a large path of native instructions across several components.

The CPU never needed to understand the word printf.

Software layers did.

## Now compare Python

Write:

    print("hello")

The outer operating-system path is familiar:

    executable Python interpreter
      -> process
      -> virtual memory
      -> libraries
      -> syscalls
      -> CPU instructions

Inside the interpreter process another layer appears:

    Python source
      -> compiled code object / bytecode
      -> Python interpreter execution
      -> runtime operation
      -> output library
      -> OS

CPython's dis documentation lets you inspect the bytecode representation while warning that it is implementation-specific.

Different language path.

Same operating-system and hardware foundations.

## Every arrow creates a diagnostic boundary

Suppose the program fails.

Syntax error?

Compiler stage.

Undefined reference?

Link stage.

Permission denied launching?

Execution boundary.

Missing shared library?

Loader/dynamic-link stage.

Segmentation fault?

Runtime memory-access failure.

Write returns broken pipe?

I/O path.

The phrase "program doesn't work" hides all these categories.

Systems knowledge makes failure narrower.

## Exercise: draw both paths

Draw two vertical diagrams.

C:

    source
    preprocess
    compile
    assemble
    link
    executable
    loader
    process
    syscalls
    CPU

Python:

    source
    Python runtime
    bytecode/interpreter
    process
    syscalls
    CPU

Now add:

    libraries
    virtual memory
    files
    terminal

You will see that language choice changes important upper layers but does not replace the operating system or hardware beneath.

## The lesson to carry forward

A running program is the result of a chain.

Source code becomes or feeds executable representations.

Object files and linkers assemble binary artifacts.

The operating system creates a process and address space.

Runtimes and libraries initialize.

System calls request kernel services.

Processor instructions execute underneath everything.

This is why syntax alone is not programming education.

The syntax sits on top of a machine.

Module 4 now uses this system context to introduce programming concepts from the problems that create them.
