---
title: "Source Code Is Not What the CPU Executes"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-021-source-code-is-not-what-cpu-executes.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "Source code is a human-oriented representation. Compilers, assemblers, runtimes, interpreters, and loaders transform or mediate it before processor instructions actually execute."
eyebrow: "Open Systems Course · Lesson 21 of 180"
---

Open a Python, C, Rust, or JavaScript file.

You see names, functions, loops, types, comments, and formatting chosen for humans and language tools.

The CPU does not directly execute that text.

That statement sounds obvious until a beginner is told that programming means "telling the computer what to do." The phrase compresses several translation layers into one.

This lesson opens them.

## Source code is a representation for a language

A programming language defines syntax and semantics.

The source file is one representation of a program under those rules.

For C, a toolchain can preprocess, compile, assemble, and link source into executable machine code. GCC documents those stages explicitly.

For CPython, Python source is compiled to bytecode that the interpreter executes; Python's documentation warns that CPython bytecode is an implementation detail and can change between releases.

For JavaScript in a modern engine, parsing, interpretation, bytecode, optimization, and just-in-time compilation may all participate.

The path depends on the language implementation.

The universal idea is:

    source representation
        -> language implementation
        -> executable behaviour

## Why humans do not normally write machine code

Machine instructions are exact but low-level.

A high-level language lets you express:

    sort(records)

instead of manually controlling registers, loops, address calculations, branches, and calling conventions.

That is abstraction again.

The compiler or runtime takes responsibility for many lower-level details.

This separation makes programs more portable and maintainable.

The same source can sometimes target multiple processor architectures because the language toolchain emits different machine instructions for each target.

The source remains conceptually similar.

The executable representation changes.

## One source statement can become many operations

Consider:

    names.sort()

That operation may invoke a library implementation containing loops, comparisons, memory accesses, function calls, and allocation.

One line of source can trigger thousands or millions of machine instructions depending on the data.

The reverse can also happen.

A compiler may remove source operations whose results cannot affect observable behaviour.

So there is no stable formula:

    one line = N instructions

The relationship depends on semantics, optimization, runtime behaviour, and workload.

## Compilation can happen before or during execution

Ahead-of-time compilation translates program representations before the program runs.

Just-in-time compilation translates selected code during execution.

Interpretation can execute an intermediate representation step by step.

Many systems combine techniques.

For example, a runtime may begin by interpreting bytecode, observe which paths become hot, then compile optimized machine code for those paths.

The categories are useful but real implementations are hybrids.

Do not turn "compiled language versus interpreted language" into a rigid binary.

## Libraries add code you did not write

Suppose your source calls a function provided by a library.

The final execution may include machine code from:

- your program;
- language runtime;
- standard library;
- third-party library;
- operating-system library;
- kernel.

The source repository is not the entire executing system.

This matters for debugging, licensing, security, performance, and reproducibility.

A vulnerability in a dependency can affect your program even if your own source never contains the vulnerable implementation.

## Generated code still needs an environment

An executable file alone is not enough.

The operating system must load it.

Dynamic dependencies may need resolution.

Memory mappings must be created.

The program receives arguments and environment.

The process interacts with the kernel through system calls.

"Compiled successfully" proves only one stage.

It does not prove the program can run correctly in the target environment.

## The CPU finally sees architectural instructions

Eventually, native machine instructions execute on a processor, whether they came from:

- ahead-of-time compilation;
- a JIT compiler;
- an interpreter implemented in native code;
- runtime libraries.

Even an interpreter must itself execute as machine code.

When CPython executes Python bytecode, the processor is actually executing the CPython interpreter's native instructions while that interpreter processes Python's intermediate operations.

This distinction is subtle and important.

The CPU does not suddenly understand Python bytecode as its ISA.

The interpreter does.

## Exercise: inspect two representations

For C, GCC can stop at intermediate stages. Its documented options allow preprocessing-only output, assembly output, object files, and linked executables.

For Python, the dis module can display CPython bytecode for a function.

Take:

    def add(a, b):
        return a + b

Inspect the Python bytecode.

Then write an equivalent small C function and compile it to assembly.

Do not compare instruction counts as a language benchmark.

Instead ask:

What representation does each tool expose?

Who interprets that representation next?

That question is the lesson.

## The lesson to carry forward

Source code is one layer.

It exists to let humans and tools describe behaviour using a language abstraction.

Processors execute architecture-defined machine instructions.

Between those layers, compilers, assemblers, linkers, runtimes, interpreters, loaders, and libraries translate or mediate the program.

Programming becomes clearer when you stop imagining source code falling directly into the CPU.
