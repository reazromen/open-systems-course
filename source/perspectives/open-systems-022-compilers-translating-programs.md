---
title: "Compilers: Translating Programs into Machine Code"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-022-compilers-translating-programs.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 13
excerpt: "A compiler does far more than replace words with opcodes. It parses meaning, checks constraints, transforms representations, optimizes under language rules, and generates target-specific code."
eyebrow: "Open Systems Course · Lesson 22 of 180"
---

A compiler is sometimes described as a translator from a programming language to machine language.

That is directionally correct and mechanically incomplete.

A modern compiler is closer to a pipeline of analyses and transformations.

It must understand the source language well enough to preserve its defined behaviour while producing a representation suitable for another stage or target machine.

## Start with structure, not instructions

Consider:

    result = a + b * c

The compiler does not treat this as an arbitrary string.

The language grammar gives multiplication and addition structure and precedence.

A front end typically performs work such as:

- lexical analysis;
- parsing;
- semantic analysis;
- type checking where applicable.

The result becomes an internal representation of the program's meaning.

Only later does target-specific code generation become central.

## Intermediate representations create separation

Compilers often use one or more intermediate representations, or IRs.

Why not translate source directly to target instructions in one giant step?

Because an IR separates concerns.

A language front end can lower source constructs into a common form.

Optimization passes can transform that form.

A back end can translate toward a specific target architecture.

Conceptually:

    source language
       -> front end
       -> IR
       -> optimization
       -> target-specific lowering
       -> machine code

Real compiler architectures vary, but the separation allows one compiler infrastructure to support multiple languages or targets more effectively.

## Optimization must preserve allowed behaviour

Suppose source contains:

    x = 2 + 3

A compiler can often replace this with the constant 5 before execution.

That is constant folding.

Suppose it calculates a value that is never used and has no required observable effect.

The compiler may remove the work.

Suppose a loop performs the same invariant calculation repeatedly.

The compiler may move it.

These transformations are not random.

They are constrained by language semantics, aliasing rules, memory model, side effects, target architecture, and optimization level.

The compiler is allowed to change how a result is produced only when the observable behaviour remains valid under the language rules.

## Undefined behaviour changes the contract

Languages such as C define some operations as undefined behaviour.

That does not mean "the compiler will kindly throw an error."

It means the language standard imposes no requirements for that case.

Optimizers can make transformations based on the assumption that defined programs do not invoke undefined behaviour.

This is why low-level language bugs can produce surprising optimized results.

The compiler did not necessarily "break your code."

The source may have left the language contract.

## Target architecture matters

Compile the same C function for x86-64 and AArch64.

The machine instructions differ because the ISAs differ.

Register sets differ.

Calling conventions differ.

Available vector instructions differ.

The source algorithm may be the same.

Code generation adapts the implementation to the target.

Cross-compilation simply makes this explicit: the compiler runs on one machine while producing code intended for another target platform.

This is normal in embedded development.

## Compilation is not always the whole toolchain

GCC documents up to four conventional stages:

    preprocessing
    compilation proper
    assembly
    linking

The compiler proper can produce assembly.

An assembler encodes instructions and data into an object file.

A linker combines object files and libraries, resolves symbols, and builds an executable or shared object.

People often use the word compiler for the entire toolchain.

That is fine conversationally.

When debugging a build, the distinction becomes useful.

A compilation error and a linker error are different failure stages.

## Debug information creates another mapping

Optimized machine code can look very different from source.

Debug formats record information that helps tools map machine addresses and variables back toward source files, lines, functions, and types.

Optimization complicates that mapping.

A variable may live in a register briefly, move, be optimized away, or never exist as one stable storage location.

This is why debugging highly optimized code can feel strange.

The source abstraction and execution representation have diverged.

## Compiler warnings are static evidence

A compiler can identify suspicious constructs without executing the program.

Examples include:

- type mismatches;
- unreachable code;
- uninitialized values in some analyzable cases;
- suspicious conversions;
- format-string mismatches.

Warnings are not proof that the program is correct when none appear.

They are one source of static evidence.

A good engineering workflow combines compiler diagnostics, tests, static analysis, runtime observability, and review.

No single layer proves the whole system.

## Exercise: stop GCC at every stage

For a tiny C program, inspect:

    gcc -E
    gcc -S
    gcc -c
    gcc

The exact filenames and options are documented by GCC.

Ask what each output contains.

Preprocessed source.

Assembly text.

Relocatable object.

Linked executable.

Do not memorize commands as ritual.

Use them to see the pipeline.

## The lesson to carry forward

A compiler is a semantic transformer.

It reads a source language, builds internal representations, checks rules, performs valid transformations, and generates code for a target.

The processor executes the target instructions.

The compiler is the bridge that lets us write at a higher abstraction without abandoning the hardware contract below.

Next we compare that pipeline with interpreters and virtual machines, where translation and execution can happen differently.
