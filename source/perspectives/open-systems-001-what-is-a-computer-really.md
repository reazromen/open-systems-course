---
title: "What Is a Computer, Really?"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-001-what-is-a-computer-really.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 11
excerpt: "Before learning a programming language, build a mental model of the machine: information enters, state changes, instructions execute, and observable output emerges through layers of hardware and software."
eyebrow: "Open Systems Course · Lesson 1 of 180"
---

A computer is easy to recognize and surprisingly hard to define well. A laptop is a computer. A phone is a computer. A server in a data center is a computer. An ESP32 is a computer. A washing-machine controller may also contain one. They differ enormously in size, power, interfaces, operating systems, and purpose, so the useful question is not what a computer looks like. The useful question is: **what kind of system is it?**

For this course, we will use a practical engineering model. A computer is a physical system that represents information, changes internal state according to rules, and produces observable effects. Those rules may be fixed in hardware, supplied as software, or divided between the two. This is not meant to replace the formal definitions used in theoretical computer science. It is a mental model for understanding real machines.

That model immediately gives us four things to look for:

1. **representation** — how information is encoded;
2. **state** — what the system currently remembers;
3. **transformation** — what operations change that state;
4. **interfaces** — how the system interacts with other systems.

If you can locate those four things, an unfamiliar device becomes less mysterious.

## Start with an event, not a programming language

Imagine pressing the volume-up button on a laptop.

You experience one event: the sound becomes louder. The machine experiences a chain of events. A physical switch changes an electrical condition. Hardware reports an input event. Software receives that event. Some component changes a stored volume value. The audio system applies the new setting. The next audio samples sent toward the speaker are processed differently.

The exact implementation varies by platform, but the important idea does not: what looks like one action to a person is usually a path through several layers.

This is why learning only syntax can leave a beginner with a strange gap. They may know how to write:

```python
volume = volume + 1
```

without knowing where a real volume value lives, which process owns it, how an input event reaches that process, or what happens after the value changes.

The code is not wrong. The mental model is incomplete.

MIT's Computation Structures course is useful because it treats digital systems as a hierarchy of building blocks. Its published course description moves from low-level digital elements through instructions, procedures, processes, and complete systems. The important lesson for us is not that every learner must begin by designing transistors. It is that higher-level behaviour is implemented by lower-level mechanisms.

## A computer is made of layers that hide detail

Suppose you save a text file.

At the level you care about, you might think:

```text
my idea → file
```

That abstraction is useful. If every application developer had to manually control flash cells or magnetic domains, software development would be nearly impossible.

Under that simple action, however, are additional layers:

```text
application
    ↓
runtime or libraries
    ↓
operating-system interface
    ↓
filesystem
    ↓
storage driver
    ↓
storage controller
    ↓
physical storage medium
```

This diagram is conceptual, not a universal implementation. Some systems omit layers, combine them, or add more. But it exposes one of the central ideas in computing: **abstraction lets one layer use a simpler model of the layer below it.**

The filesystem lets software work with names such as `notes.txt` instead of storage-cell addresses. A network socket lets an application exchange bytes without directly controlling a radio waveform or Ethernet signaling. A programming language lets us express logic without manually encoding every processor instruction.

Abstraction is not deception. It is controlled ignorance.

You ignore details until those details become relevant.

That final sentence is important because every abstraction leaks eventually. A slow disk can become an application problem. Packet loss can become a voice-quality problem. Memory pressure can become a database problem. A production engineer learns when to stay at the current layer and when to descend.

## Where do CPU, memory, and storage fit?

A general-purpose computer usually has some mechanism that executes instructions, some working storage for active computation, longer-lived storage, and interfaces to other devices. In familiar machines we call these things CPU, RAM, storage, and I/O, although real architectures are more complicated than those four labels.

A processor does not understand "open Spotify" or "render this website" as human intentions. At a lower level it executes instructions defined by its architecture. Those instructions manipulate data, move values, perform arithmetic or logical operations, and control which instruction comes next.

Memory gives active computation a place to keep instructions and data. Storage preserves data across power cycles. Devices create boundaries with the physical world: keyboards, displays, network adapters, microphones, sensors, radios, storage controllers, and many others.

Do not turn this into a rigid diagram too early. Modern processors have caches, multiple cores, memory-management hardware, accelerators, buses, controllers, and layers of firmware. The first goal is simply to understand the responsibilities.

## Information needs a physical representation

A file, an image, and a program can all be represented using bits, but a bit is not a tiny physical object floating inside a computer. NIST defines a bit as a binary digit with value 0 or 1. The physical system needs some distinguishable states that can represent those values.

Different technologies can realize those distinctions differently. Voltage ranges may represent logic values in a circuit. Charge states may represent stored data in flash memory. Magnetic states can represent data in some storage media. Optical systems use other physical mechanisms.

That means "everything is zeros and ones" is useful only if we remember the missing half of the sentence:

> zeros and ones are **representations implemented by physical systems**.

Later we will study why digital abstraction is so powerful, and why real electronics still has analog behaviour underneath it.

## Programs are not magic instructions written directly to the machine

When you write a Python program or a C program, you are operating at a high level of abstraction.

Consider:

```python
print("hello")
```

The word `print` is meaningful because a programming environment defines what it does. The processor does not have a universal `print` instruction that knows what a terminal is.

Several mechanisms may be involved between that source line and visible pixels: language runtime behaviour, operating-system calls, terminal handling, font rendering, graphics processing, and a display subsystem. The exact path depends on the environment.

This is one reason the course will not treat programming languages as the beginning of computing. A language is one layer in a larger system.

But we also will not postpone programming for months. As soon as code helps us test a model, we will use it. Code is an instrument for investigation.

## A useful boundary: mechanism versus intention

People describe computers using intentional language:

- "the browser wants to connect";
- "the server knows my session";
- "the router decides where to send the packet";
- "the AI understands the question."

Sometimes this is convenient shorthand. It becomes dangerous when the language replaces the mechanism.

If a server "knows" that you are logged in, what state represents that fact? A cookie? A session record? A signed token? Which component verifies it? When does it expire?

If a router "decides," what table or algorithm determines the forwarding action?

If a device is "connected," which protocol state says so, and what does that state fail to prove?

Engineering starts when vague verbs become inspectable mechanisms.

## The first systems habit: follow one thing end to end

You do not need expensive hardware for the first exercise.

Pick one familiar action:

- press a key;
- open a web page;
- save a file;
- play an audio track;
- connect to Wi-Fi.

Now write the path as boxes and arrows. Do not search for perfect terminology yet.

For a web page, you might begin with:

```text
keyboard
  ↓
browser
  ↓
operating system
  ↓
network
  ↓
remote service
  ↓
network
  ↓
browser
  ↓
display
```

Then mark every box you cannot explain.

Those unknown boxes are not evidence that you are bad at computing. They are your syllabus.

As the course progresses, we will repeatedly return to this technique. We will follow a byte, a packet, a process, an interrupt, a database write, an audio frame, a SIP message, and a sensor reading across system boundaries.

## What this lesson does not claim

This article does not define every formal model of computation. It does not claim that all computers share one hardware organization. It does not reduce computing to CPU, RAM, and storage. It also does not claim that high-level abstractions are unimportant.

The opposite is true. We need abstractions because real systems contain too much detail to reason about all at once.

The skill is learning to move between levels deliberately.

At one moment you may be discussing what a user needs. A minute later you may be looking at an HTTP request. Then a TCP connection. Then a packet capture. Then a driver or an interrupt. The system has not changed. Your viewpoint has.

That ability—to change viewpoint without losing the relationships between layers—is one of the central skills this course is designed to build.

## Try it yourself

Without writing code, draw the path for this event:

> You press the letter **A** and it appears in a text editor.

Include at least five boxes.

Then answer three questions:

1. Where is state likely to change?
2. Which box directly observes the physical key press?
3. Which box ultimately causes pixels to change?

Your diagram will be incomplete. That is expected.

Save it.

Near the end of this course, draw the same diagram again. The difference between those two drawings will be a better measure of learning than memorizing the syntax of a programming language.
