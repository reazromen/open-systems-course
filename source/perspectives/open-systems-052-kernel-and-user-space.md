---
title: "Kernel and User Space"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-052-kernel-and-user-space.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 11
excerpt: "Kernel and user space separate privileged resource control from ordinary application execution. The boundary is enforced by hardware privilege and crossed through defined mechanisms such as system calls."
eyebrow: "Open Systems Course · Lesson 52 of 180"
---

A text editor should be able to save a file.

It should not be able to overwrite arbitrary kernel memory.

A browser should be able to create a network socket.

It should not be able to reprogram every device controller directly.

This separation is the practical meaning of kernel space and user space.

## The CPU supports privilege

Modern processor architectures provide execution modes with different authority.

The kernel runs with privilege needed to manage memory mappings, devices, interrupts, and protection.

Ordinary applications run with less privilege.

The exact architecture-specific modes differ.

The principle is stable:

    privileged execution
           |
      protected boundary
           |
    unprivileged execution

Hardware helps enforce the boundary.

Software policy uses it.

## User space is where ordinary applications live

Your shell, browser, editor, database, Python interpreter, and many system services are user-space processes.

They have virtual address spaces and kernel-managed identities.

They cannot simply execute every privileged instruction successfully.

They request services through operating-system interfaces.

This limits blast radius.

A bug in a normal process should not automatically become arbitrary kernel execution.

Isolation is not perfect, but the boundary is foundational.

## The kernel owns protected global state

The kernel tracks things such as:

- processes and threads;
- page tables;
- open file state;
- network stacks;
- routing tables;
- device drivers;
- credentials;
- timers;
- scheduler state.

Many applications depend on these shared resources.

If each application modified them directly, coordination and security would collapse.

Central privileged mediation gives the system one place to enforce invariants.

## System calls cross the boundary

A process wants to read a file.

It calls a library function.

Eventually a system-call mechanism transfers control into the kernel.

The kernel validates the file descriptor and destination buffer, performs or initiates the operation, then returns.

Conceptually:

    user program
       ↓
    syscall entry
       ↓
    kernel
       ↓
    filesystem/driver/etc.
       ↓
    kernel result
       ↓
    user program

This transition is controlled.

The process does not simply call an arbitrary kernel function pointer.

## Exceptions also enter the kernel

Suppose user code accesses an unmapped virtual address.

The CPU detects a page fault.

Control transfers to the kernel's exception handling path.

The kernel decides whether the fault is:

- recoverable demand paging;
- copy-on-write;
- invalid access;
- protection violation.

The application did not request a syscall.

Hardware forced a privileged transition because execution encountered a condition requiring OS handling.

## Interrupts can arrive from outside the current program

A network card receives data.

A timer fires.

A storage controller completes a request.

Hardware can notify the processor through interrupts.

The kernel handles the event and may wake user-space work later.

This shows why application execution is not isolated in time.

The machine is handling many asynchronous events around it.

## Context switching changes address spaces and state

The scheduler stops thread A.

Thread B runs.

The processor must use B's relevant execution and memory context.

Later A resumes.

Protection ensures B does not simply inherit A's private memory mappings.

The kernel coordinates the switch.

Again, process isolation is implemented, not magical.

## Kernel bugs are unusually dangerous

A user-space process crash often kills one process.

A kernel crash can affect the whole machine.

A driver running in kernel context may have broad privileges.

This is why kernel code, drivers, privilege boundaries, and syscall attack surfaces receive intense security scrutiny.

Some systems move more components into user space specifically to reduce privileged code.

Architecture determines blast radius.

## Containers do not create a second kernel

On ordinary Linux containers, processes are isolated using kernel features such as namespaces and cgroups while sharing the host Linux kernel.

That is different from a virtual machine running its own guest kernel.

This distinction matters for security, observability, and compatibility.

A container image may look like a tiny Linux filesystem.

It is not necessarily a tiny virtual machine.

## Exercise: classify operations

For each operation, ask whether ordinary user code can do it directly or must involve the kernel:

- add two integers;
- read a normal file;
- allocate heap memory from an existing user-space allocator pool;
- create a TCP socket;
- program a physical network interface register;
- change another process's page table.

Some operations happen entirely in user space until more resources are needed.

Others require kernel mediation.

The boundary becomes visible.

## The lesson to carry forward

Kernel and user space separate authority.

User programs run with constrained privilege.

The kernel manages global resources and protection.

System calls, exceptions, and interrupts cross into privileged execution under defined rules.

This boundary is one of the reasons many independent programs can share one computer without treating every process as fully trusted.
