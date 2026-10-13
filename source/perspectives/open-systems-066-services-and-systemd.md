---
title: "Services and systemd"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-066-services-and-systemd.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "A service is a long-lived responsibility; systemd is one common Linux manager for starting, supervising, stopping, and ordering services through declarative units."
eyebrow: "Open Systems Course · Lesson 66 of 180"
---

A web server should start after boot.

A database should restart after failure.

A network service may need configuration, environment, permissions, resource limits, and dependencies.

You could launch everything from shell scripts.

Large systems quickly need stronger lifecycle management.

On many Linux distributions, systemd is PID 1 and manages services and other units.

## Service is a responsibility, not a process type

A service may use:

- one process;
- many worker processes;
- threads;
- helper processes.

The word service describes what the system provides.

A systemd service unit describes how that responsibility is managed.

Do not equate one service with exactly one process.

## Unit files are declarative contracts

A service unit can specify things such as:

- executable command;
- user identity;
- environment;
- restart policy;
- dependencies;
- startup ordering;
- resource controls.

This makes lifecycle configuration versionable and inspectable.

The manager handles orchestration.

The application handles application logic.

## Start order and dependency are different ideas

A service may need network configuration before starting.

Another may only need a socket.

systemd distinguishes requirement relationships from ordering relationships.

This matters because:

    "start after X"

does not always mean:

    "X is required for me to exist"

Dependency graphs are more precise than one long startup script.

## Supervision changes failure handling

Suppose a process exits unexpectedly.

A service manager can:

- record exit status;
- restart according to policy;
- apply backoff;
- mark unit failed.

Restart is useful.

It can also hide a crash loop.

If a service restarts every second, "active sometimes" is not healthy.

Inspect state and logs.

## Environment must be explicit

A common failure:

Program works in interactive shell.

Fails as service.

Why?

Different:

- working directory;
- PATH;
- user;
- environment variables;
- permissions;
- network timing.

A service should declare what it needs instead of inheriting assumptions from one operator's shell.

## systemctl talks to the manager

Commands such as:

    systemctl status name.service
    systemctl start name.service
    systemctl stop name.service

request operations from systemd.

They do not directly invoke arbitrary kill commands as their entire meaning.

The manager applies unit semantics and tracks state.

This is another control-plane abstraction.

## Active is not the same as useful

systemd may report a service process active.

The application may still be unable to serve requests because:

- database unavailable;
- wrong credentials;
- port conflict;
- internal deadlock;
- dependency unhealthy.

Process supervision proves lifecycle state.

End-to-end health needs deeper evidence.

Never confuse manager status with product health.

## Resource controls make service boundaries stronger

systemd integrates with kernel mechanisms such as cgroups.

A service can have CPU, memory, device, and other resource controls depending on configuration.

This makes the service unit more than a startup script.

It can be an operational boundary.

## Exercise: inspect, do not edit

On a systemd machine you own:

    systemctl status ssh.service

or another harmless known service.

Then:

    systemctl cat service-name

Look for:

- ExecStart;
- User;
- Restart;
- dependencies.

Do not change critical services for the exercise.

The goal is to see lifecycle as configuration.

## The lesson to carry forward

Long-running programs need lifecycle management.

systemd provides one widely used Linux implementation through units, dependencies, supervision, and resource controls.

When a service fails, separate:

- manager state;
- process state;
- application state;
- dependency state.

That separation prevents shallow diagnosis.
