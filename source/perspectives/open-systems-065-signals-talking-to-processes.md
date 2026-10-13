---
title: "Signals: Talking to Processes"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-065-signals-talking-to-processes.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 11
excerpt: "Unix signals are asynchronous notifications delivered to processes or threads. They can request termination, reload, stop, continue, or report faults—but semantics depend on the signal and handler."
eyebrow: "Open Systems Course · Lesson 65 of 180"
---

Run:

    kill 1234

Despite the command name, the default operation is not "forcefully destroy process."

The kill interface sends a signal.

Signals are a Unix mechanism for asynchronous notifications to processes or threads.

## A signal is a small control event

Common signals include:

    SIGTERM
    SIGINT
    SIGHUP
    SIGKILL
    SIGSTOP
    SIGCHLD

The signal identity tells the recipient what event occurred.

Traditional signals are not general application message queues carrying arbitrary structured payload.

They are control notifications.

## Processes can handle many signals

A long-running service can install a handler.

Possible policy for SIGTERM:

- stop accepting new work;
- finish current operations;
- flush state;
- exit.

Possible policy for SIGHUP:

- reload configuration.

The kernel delivers the signal.

The process defines much of the response.

Therefore SIGTERM is generally a request for orderly termination, not proof of immediate exit.

## SIGKILL is different

SIGKILL cannot be caught, blocked, or ignored by an ordinary user-space handler.

The kernel terminates the target.

This is why operations commonly tries graceful termination before SIGKILL.

Graceful shutdown gives software a chance to release or persist state.

Forced termination prioritizes stopping.

## SIGSTOP is also special

SIGSTOP stops execution and cannot be caught or ignored.

SIGCONT resumes a stopped process.

Some signal semantics are therefore kernel-enforced, not application policy.

## Ctrl+C often becomes SIGINT

In a terminal, Ctrl+C commonly causes terminal/job-control machinery to send SIGINT to the foreground process group.

The keyboard did not directly terminate the program.

The path is more like:

    key press
      -> terminal input handling
      -> foreground job
      -> SIGINT
      -> process signal disposition

One keystroke crosses several layers.

## Signals interrupt normal control flow

A signal can arrive while a program is doing unrelated work.

Low-level signal handlers therefore face restrictions on which operations are safe.

Many library functions are not async-signal-safe.

Robust programs often keep handlers minimal and defer complex work to normal execution context.

Asynchronous events require design.

## Threads complicate delivery

Signals may be process-directed or thread-directed.

Threads can block selected signals.

Multi-threaded programs need a deliberate signal model.

One common design blocks signals in worker threads and handles them synchronously in a dedicated control thread.

The exact pattern depends on runtime and application needs.

## Signal permissions exist

One process cannot arbitrarily signal every other process.

Kernel checks use credentials and privilege rules.

Signals are controlled IPC.

They are not a universal remote-control channel.

## Exercise: graceful stop

Start a harmless long-lived process you own.

Find its PID.

Send:

    kill PID

Observe whether it exits.

If you write your own service, add a SIGTERM handler that logs shutdown and exits cleanly.

Do not experiment on critical services.

## The lesson to carry forward

Signals are asynchronous process-control events.

Their meaning depends on:

- signal type;
- installed handler;
- thread masks;
- kernel-enforced semantics.

When a Linux service will not stop, ask which signal was sent and what the process did with it.
