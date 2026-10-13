---
title: "Stack, Heap, and Static Data"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-028-stack-heap-static-data.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "Stack, heap, and static storage describe different lifetime and allocation patterns inside a process address space. They are software conventions built on virtual memory, not separate physical RAM chips."
eyebrow: "Open Systems Course · Lesson 28 of 180"
---

Beginners are sometimes shown a memory diagram:

    code
    static data
    heap
    ...
    stack

Then the diagram becomes mythology.

They imagine the computer contains one physical "stack area" and one physical "heap area."

That is not the right model.

Stack, heap, and static data are process-level organization and allocation concepts built inside a virtual address space.

## Static storage exists for long-lived program state

Compiled programs often contain data with static storage duration:

- global variables;
- static variables;
- constants;
- initialization data.

Some values are initialized from the executable.

Others begin zeroed.

Exact section names and layout depend on object format, linker, compiler, and platform.

The important property is lifetime.

This state exists for the lifetime of the process or relevant program image, rather than being created for one function call.

## The stack follows nested execution

A thread typically has a stack used for call frames and automatic state.

A function call may require storage for:

- return information;
- saved registers;
- local variables;
- arguments that do not remain in registers.

Calling another function adds another frame.

Returning removes it.

This creates last-in, first-out behaviour.

The stack's structure matches nested function calls naturally.

## Stack memory is not always where every local variable lives

An optimizing compiler can keep a local value entirely in a register.

It can eliminate the variable.

It can reorder storage.

Debug builds and optimized builds can differ.

So the source concept:

    local variable

does not guarantee one stable stack slot.

The language's semantics matter more than a simplistic physical diagram.

## The heap supports dynamic lifetime

Suppose you need an object whose size or lifetime is not tied to one function call.

Dynamic allocation obtains memory from a heap allocator or runtime-managed heap.

In C:

    malloc

requests dynamic storage from the allocator.

In managed languages, object allocation may occur on a garbage-collected heap.

The application does not usually ask the kernel for one page on every tiny allocation.

User-space allocators obtain larger regions and manage them efficiently.

This creates another abstraction layer:

    application object
      -> allocator
      -> virtual-memory regions
      -> physical memory as needed

## Allocation and lifetime are different problems

Creating memory is easy.

Knowing when it can be reused is harder.

C gives programmers explicit mechanisms such as free.

Failure to release unreachable allocations creates memory leaks.

Releasing too early creates use-after-free bugs.

Managed runtimes use garbage collection to find or infer unreachable objects and reclaim them automatically.

That reduces some classes of manual memory error but introduces runtime work and its own performance behaviour.

No model removes the need to understand lifetime.

## The stack can overflow

A thread stack is finite.

Deep or unbounded recursion can exhaust it.

Large local allocations can also contribute.

A stack overflow is not the same as "the computer ran out of RAM."

The process hit a limit associated with one execution structure.

Again, broad resource labels hide the actual boundary.

## Heap fragmentation can matter

A program repeatedly allocates and frees blocks of different sizes.

Free memory may become divided into regions.

Allocators use strategies to manage fragmentation, reuse, concurrency, and metadata overhead.

A process can therefore experience allocation difficulties or poor locality even when a naive sum of free bytes looks sufficient.

This is allocator behaviour, not just raw RAM capacity.

## Threads make the diagram richer

Each thread usually has its own stack.

Threads in the process share the heap and global address space.

So:

    process
      ├── static/global state
      ├── heap
      ├── thread A stack
      ├── thread B stack
      └── mapped libraries/files

This is a more useful model than one stack per process.

POSIX thread documentation explicitly notes shared global memory and separate stacks.

## Security bugs often cross these boundaries

Buffer overflows can corrupt adjacent state.

Use-after-free bugs involve heap object lifetime.

Stack corruption can affect control data.

Memory-safety vulnerabilities are partly failures to maintain valid relationships between addresses, object bounds, and lifetimes.

Higher-level languages can enforce more of those rules automatically.

Low-level languages expose more control and more responsibility.

## Exercise: classify lifetimes

Take:

    global configuration
    function counter
    dynamically created user object
    per-thread temporary buffer

Ask:

How long should each live?

Who owns it?

Who releases it?

Can multiple threads access it?

The correct storage strategy follows from lifetime and sharing requirements.

Do not start with "stack or heap?"

Start with:

**What lifetime and ownership does the data need?**

## The lesson to carry forward

Stack, heap, and static data are not mysterious memory species.

They are organization patterns inside a process's virtual address space.

The stack naturally supports nested execution.

Static storage supports process-lifetime state.

The heap supports dynamic allocation with flexible lifetime.

The physical memory underneath may move, page, cache, or even temporarily live outside RAM.

Abstraction separates program lifetime rules from physical placement.
