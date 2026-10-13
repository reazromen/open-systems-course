---
title: "Packages, Libraries, and Dependencies"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-068-packages-libraries-dependencies.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "A Linux application depends on more than its executable. Packages, shared libraries, runtime loaders, repository metadata, versions, and transitive dependencies form a supply chain."
eyebrow: "Open Systems Course · Lesson 68 of 180"
---

You copy one executable to another machine.

It says:

    error while loading shared libraries

The program file exists.

The execution environment is incomplete.

This is the dependency problem.

## Libraries separate reusable implementation

Applications depend on common functions:

- cryptography;
- compression;
- graphics;
- networking;
- parsing.

Instead of embedding every implementation independently, software can use libraries.

A dynamically linked Linux executable can rely on shared objects loaded at runtime.

The dynamic linker finds and loads required shared libraries before the program can run.

## Package managers operate at another layer

A distribution package may include:

- executable files;
- libraries;
- configuration;
- service units;
- metadata;
- dependency declarations;
- scripts.

Package managers resolve distribution-level dependencies and track installed files.

Examples include apt/dpkg, dnf/rpm, pacman, and apk.

The commands differ.

The system problem is the same:

install a coherent set of software artifacts and track their lifecycle.

## Dependency graphs are recursive

Application depends on library A.

A depends on B and C.

C depends on D.

Now your application indirectly depends on D.

That is a transitive dependency.

Security and compatibility therefore extend beyond packages you imported intentionally.

A vulnerability deep in the graph can still affect you.

## Version constraints are contracts

Library A version 1 may expose one ABI.

Version 2 changes it.

Old executable may fail to load or behave incorrectly.

Package ecosystems encode constraints so compatible versions are selected.

Semantic versioning can communicate intent in some ecosystems.

It does not mathematically guarantee compatibility.

The actual interface contract matters.

## Dynamic loader has search rules

Linux dynamic linking follows configured search rules involving executable metadata, environment, cache/configuration, and default locations depending on platform and security mode.

This is why setting random library paths can "fix" one command and break another.

The loader is resolving a graph under rules.

Understand the rules before manipulating them.

## Static linking changes deployment trade-offs

Static linking can place more dependency code inside one executable.

That may simplify deployment in some contexts.

It can increase binary size and require rebuilding to update embedded dependencies.

Dynamic linking centralizes shared libraries but adds runtime compatibility.

Neither is universally superior.

Choose for deployment, security, and lifecycle requirements.

## Language package managers add another graph

Python pip, npm, Cargo, Go modules, Maven, and others manage language ecosystems.

Now a Linux application can have:

    OS packages
       +
    language packages
       +
    container base image
       +
    external services

Dependency management becomes architecture.

Reproducible builds need controlled versions across these layers.

## Supply chain security starts here

Where did the package come from?

Was it signed or verified?

Who publishes it?

Which source produced the binary?

What transitive code executes?

Keeping dependencies patched is necessary.

Blindly updating without testing can also break compatibility.

A mature system needs inventory, provenance, policy, and rollback.

## Exercise: inspect one binary

On Linux:

    file /bin/ls
    ldd /bin/ls

On a dynamically linked system, ldd can show shared-library dependencies.

Do not run ldd on untrusted executables; its historical and platform-specific behaviour can involve code execution concerns.

Use trusted system binaries for the exercise.

Then ask:

Which package installed each library?

Your application is already a dependency graph.

## The lesson to carry forward

An executable rarely stands alone.

Libraries, packages, loaders, repositories, versions, and transitive dependencies form the environment that makes it runnable.

When deployment fails, ask:

What artifact is missing?

Which version?

Who was expected to provide it?

Which layer owns dependency resolution?
