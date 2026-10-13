---
title: "Executables, Object Files, and Linking"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-024-executables-object-files-linking.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 13
excerpt: "Compiled code is usually built in pieces. Object files carry machine code, data, symbols, and relocation information; the linker connects those pieces into executable or shared objects."
eyebrow: "Open Systems Course · Lesson 24 of 180"
---

A project contains:

    main.c
    audio.c
    network.c

You compile it.

One executable appears.

What happened to the boundaries between those source files?

They did not simply vanish.

The build pipeline created intermediate object files and then linked pieces together.

ELF, the Executable and Linking Format used widely on Unix-like systems, explicitly distinguishes relocatable files, executable files, and shared objects.

That distinction gives us a clean way to understand linking.

## Compilation can produce relocatable object files

A compiler and assembler can turn one source unit into an object file.

That object may contain:

- machine code;
- constant data;
- symbol information;
- relocation information;
- sections and metadata.

Some addresses are not final yet.

Suppose main.c calls:

    send_packet()

but the implementation lives in network.c.

The compiler knows a symbol is referenced.

It may not yet know the final address where the function will live.

That problem belongs to linking.

## Symbols are names that cross compilation boundaries

An object file can define symbols and reference symbols.

Conceptually:

    main.o:
      references send_packet

    network.o:
      defines send_packet

The linker's job includes resolving references to definitions.

If no compatible definition exists, you can get the familiar category:

    undefined reference

That is not a syntax error in the source.

Compilation may have succeeded.

The build failed later because program pieces could not be connected.

Knowing the stage narrows debugging.

## Relocation means addresses can change

Machine code sometimes needs addresses of functions or data.

When object files are built independently, final layout is not yet known.

Relocation records tell the linker or loader which places need adjustment when final addresses become known.

This is why relocatable object files can be combined flexibly.

The code is partly complete but not yet fixed to one final memory layout.

## Static linking copies needed code into the final artifact

With static linking, required library code can be incorporated into the produced executable according to toolchain behaviour.

Advantages can include easier deployment of one self-contained binary in some environments.

Costs can include larger binaries and duplicated library code across programs.

Security updates can also require rebuilding or replacing statically included dependencies.

Do not reduce the choice to "static good" or "dynamic good."

It is a deployment and lifecycle trade-off.

## Dynamic linking defers some work

Shared libraries allow multiple programs to rely on separately stored library objects.

The executable records dependencies.

At program load or runtime, a dynamic linker maps required shared objects and resolves symbols according to platform rules.

The ELF specification describes both linking and program-loading views and the role of shared objects.

This creates powerful reuse.

It also creates a new failure class:

The program exists, but a required compatible shared library does not.

Now "it compiled on my machine" is not enough.

The runtime environment matters.

## ABI is the boundary below the source language

Two pieces of binary code need agreements about more than symbol names.

They may need to agree on:

- calling convention;
- register usage;
- stack layout;
- data-type layout;
- binary object format;
- system interfaces.

These agreements form parts of an Application Binary Interface, or ABI.

An API is typically a source-level interface.

An ABI is a binary-level contract.

You can preserve an API while breaking binary compatibility if the lower-level representation changes.

This distinction matters in operating systems and library distribution.

## Executable does not mean "already in memory"

An executable file is a persistent representation suitable for program loading.

When launched, the operating system loader uses information in the executable to construct a process image.

Segments are mapped.

Permissions are established.

The dynamic loader may map libraries.

The program begins from a defined entry point.

So:

    executable file != running process

This is the same program-versus-process distinction from earlier, now seen through the file format.

## Object formats contain two views of one artifact

ELF documentation presents a linking view organized around sections and an execution view organized around segments.

That is an elegant systems idea.

The same file format supports two different consumers:

The linker cares about pieces used to build programs.

The loader cares about regions used to create a process image.

One artifact, two abstractions.

## Exercise: inspect an executable

On Linux, if tools are available:

    file program
    readelf -h program
    readelf -S program
    readelf -l program
    nm program

Use a tiny program you compiled yourself.

Do not memorize every section.

Ask:

Which tool is showing the file type?

Which shows sections?

Which shows program segments?

Which shows symbols?

The binary stops being a black box.

## The lesson to carry forward

Compiled programs are usually assembled from pieces.

Object files carry code, data, symbols, and relocation information.

Linkers resolve those pieces into executable or shared objects.

Loaders later map executable structures into a process.

The full path is:

    source
      -> object files
      -> link
      -> executable/shared objects
      -> load
      -> running process

Each arrow has its own failure modes.
