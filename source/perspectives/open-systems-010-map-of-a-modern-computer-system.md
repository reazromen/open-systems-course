---
title: "The Map of a Modern Computer System"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-010-map-of-a-modern-computer-system.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 15
excerpt: "Before going deeper, build one map that connects hardware, operating systems, processes, storage, networks, applications, and users without pretending those layers are independent."
eyebrow: "Open Systems Course · Lesson 10 of 180"
---

We have spent nine lessons opening small doors.

Information. State. Input and output. Abstraction. Digital logic. Binary. Keyboard events. Program launch.

Now we need a map.

Not a diagram that claims every computer is identical. Not a certification-style stack to memorize. A map you can use when a real system fails and you need to decide where to look next.

MIT's Computation Structures course moves from transistors through logic, state machines, processor architecture, memory, operating-system mechanisms, communication, and complete systems. OSTEP approaches operating systems through CPU virtualization, memory virtualization, concurrency, and persistence.

Those are different teaching structures, but both reveal the same fact:

A modern computer system is layered, stateful, concurrent, and connected.

## Start with the physical machine

At the bottom of our practical map is hardware.

A general-purpose computer may contain:

- CPU cores;
- caches;
- RAM;
- storage;
- buses and interconnects;
- network interfaces;
- graphics hardware;
- input controllers;
- timers;
- power-management hardware;
- many specialized controllers.

An embedded device may have a microcontroller with processor, memory, timers, radio, GPIO, and peripherals integrated into one package.

The labels differ. The basic systems questions remain familiar:

What can compute? What can store state? What can communicate? What can observe or affect the outside world?

## Firmware lives between power-on and higher software

When power arrives, application software is not automatically running.

Machines need a startup path.

On a PC that may involve platform firmware and a bootloader before the operating-system kernel begins execution.

On a microcontroller it may involve ROM code, bootloader logic, flash selection, verification, and then application firmware.

Firmware is software, but its position in the boot and hardware-control chain gives it unusual responsibilities.

This is why a machine can fail before the operating system even exists as a running system.

If a device never reaches the kernel, debugging the web application is irrelevant.

## The operating system creates useful abstractions

Once running, an operating system mediates access to hardware and exposes abstractions to software.

Important abstractions include:

- processes and threads;
- virtual memory;
- files and directories;
- sockets;
- device interfaces;
- permissions and identities;
- timers;
- inter-process communication.

OSTEP's framing is useful here: the operating system virtualizes resources, manages concurrency, and provides persistent storage abstractions.

A process can behave as if it has its own address space.

A program can open a file without issuing raw flash commands.

An application can use a socket without directly modulating a radio.

That is abstraction converting complicated mechanisms into interfaces.

## Applications run inside process and runtime environments

An application is not floating above the operating system.

It executes as one or more processes or equivalent managed execution units.

Depending on the software, another layer may exist:

    application
       -> runtime or virtual machine
       -> operating system
       -> hardware

Examples include Python runtimes, Java virtual machines, JavaScript engines, .NET runtimes, and browser engines.

These layers can add:

- memory management;
- type systems;
- scheduling;
- just-in-time compilation;
- garbage collection;
- package loading;
- security boundaries.

When performance or failure crosses these boundaries, understanding the runtime matters.

## Storage is not just "the disk"

Applications persist state through several layers.

A conceptual path might be:

    application object
       -> serialization
       -> database or file interface
       -> filesystem
       -> block I/O
       -> storage driver
       -> controller
       -> physical medium

A database may add its own cache, transaction log, indexes, locking, and recovery mechanisms.

A filesystem may buffer writes.

The operating system may cache pages.

The storage device may have its own internal cache.

So when an application reports "saved," the exact durability claim needs definition.

Did data enter application memory?

Database memory?

Kernel page cache?

A transaction log?

Stable storage?

Replicated storage?

The word saved is an abstraction. Production systems need the semantics behind it.

## Networking extends the machine beyond itself

A modern computer rarely operates alone.

The network stack creates another layered path.

At a simplified level:

    application protocol
       -> transport
       -> network layer
       -> link layer
       -> physical medium

For a web request, higher-level layers may include DNS, TCP or QUIC, TLS, HTTP, proxies, load balancers, application servers, and databases.

For telephony, signaling and media may take different paths.

For IoT, a device may use Wi-Fi, IP, MQTT, a broker, a processing service, storage, and a dashboard.

The computer boundary is no longer the box on your desk.

The system may span countries.

## The user sees an even higher abstraction

A user sees:

    "send message"
    "save photo"
    "call Thomas"
    "open website"
    "turn light on"

Each phrase compresses many technical states.

Consider "call connected."

A real-time communication system may have separate states for:

- signaling session;
- media negotiation;
- network reachability;
- RTP flow;
- decoder activity;
- audio device state.

A user hears one thing: silence or speech.

Architecture exists partly to manage the distance between user-level intention and machine-level mechanisms.

## A useful seven-layer mental map

For this course, use this as a first working map:

    1. Human / physical world
              |
              v
    2. Application behaviour
              |
              v
    3. Runtime / libraries
              |
              v
    4. Operating-system abstractions
              |
              v
    5. Drivers / firmware
              |
              v
    6. Hardware / physical signals
              |
              v
    7. Other systems through I/O and networks

This is not an OSI model.

It is not a formal standard.

It is a debugging and learning map.

Real systems cross the layers in complicated ways. Hardware can perform networking work. User-space drivers exist. Applications may access hardware through specialized frameworks. Hypervisors add layers. Containers add isolation without being virtual machines. Cloud platforms add control planes.

The map is useful because it gives us a place to begin, not because it is universally complete.

## Add a second dimension: state

Layers alone are not enough.

Every layer has state.

Hardware:

- register values;
- queue contents;
- device state.

Operating system:

- process tables;
- memory mappings;
- file descriptors;
- routing tables;
- socket state.

Application:

- sessions;
- caches;
- database records;
- queues;
- configuration.

Distributed system:

- replicas;
- leases;
- offsets;
- acknowledgements;
- membership.

A failure can therefore move vertically across layers or horizontally across stateful components.

This is why real incidents rarely fit one tidy box.

## Add a third dimension: time

Systems change over time.

Packets arrive.

Processes start and stop.

Caches expire.

Certificates expire.

Queues grow.

Memory pressure changes.

Devices reconnect.

Leadership changes.

Humans click twice.

A snapshot tells you what the system looks like now.

A trace or log can tell you how it got there.

Both matter.

When a problem is intermittent, time often becomes the missing dimension.

## Add a fourth dimension: ownership

Who owns each part?

Which team?

Which process?

Which service?

Which device?

Which data source?

Which authority is canonical?

Technical architecture and operational ownership interact.

If three services can write the same state and no one knows which source is authoritative, that is not merely an organizational problem. It is a consistency problem waiting to happen.

## One browser request on the map

Suppose you type a URL and press Enter.

A simplified end-to-end path could include:

    keyboard
      -> OS input
      -> browser
      -> DNS
      -> network stack
      -> router
      -> ISP
      -> remote network
      -> TLS endpoint
      -> web server
      -> application
      -> database
      -> response
      -> browser parser
      -> layout and rendering
      -> graphics stack
      -> display

Every arrow is a potential observation point.

That does not mean you inspect all of them every time.

You choose based on evidence.

DNS failure? Start around name resolution.

HTTP 500? Move higher toward application processing.

Connection timeout? Inspect reachability and transport.

Page loads but button does nothing? Stay near browser/application state first.

Architecture narrows investigation.

## One ESP32 sensor on the same map

Now a device:

    physical temperature
      -> sensor
      -> electrical signal
      -> ADC or digital peripheral
      -> firmware
      -> local state
      -> Wi-Fi
      -> IP
      -> MQTT
      -> broker
      -> consumer
      -> database
      -> API
      -> dashboard

The technology is different.

The method is the same.

Follow information across boundaries.

Ask what state exists at each boundary.

Ask what evidence proves each transition.

## One phone call on the same map

Now telephony:

    button press
      -> device UI state
      -> SIP request
      -> proxy or PBX
      -> routing
      -> remote endpoint
      -> session negotiation
      -> media addresses
      -> RTP
      -> jitter buffer
      -> decoder
      -> audio output

Again, the same systems method applies.

That is why networking, embedded devices, web applications, and telephony belong in the same course.

They are different technologies built from recurring engineering ideas: state, representation, interfaces, timing, failure, and evidence.

## The map should change as you learn

At the beginning of the course, draw a box called CPU.

Later we will open it into:

    instruction fetch
    decode
    registers
    ALU
    control
    caches
    memory interface

Draw a box called network.

Later we will open it into:

    link
    IP
    routing
    transport
    DNS
    TLS
    application protocol

Draw a box called database.

Later:

    query
    parser
    planner
    indexes
    pages
    transactions
    log
    storage
    replication

Learning is partly the process of deciding which boxes deserve to be opened.

## Exercise: make your own map

Choose one system you use every day.

Examples:

- WhatsApp message;
- YouTube video;
- mobile payment;
- Linux terminal command;
- smart bulb;
- SIP call.

Draw at least ten boxes from human action to final result.

Then mark:

- state;
- network boundary;
- persistent storage;
- physical input or output;
- one place where latency can appear;
- one place where data can be lost;
- one place where security matters.

You will almost certainly miss something.

Good.

The missing pieces become research questions.

## The lesson to carry forward

A modern computer system is not one thing.

It is a collection of abstractions implemented by lower layers and connected through interfaces.

The central map is:

    physical mechanisms
    -> digital logic
    -> processor and memory
    -> operating system
    -> runtime and libraries
    -> application
    -> networked services
    -> human outcome

But do not treat that as a rigid stack.

State crosses it.

Time changes it.

Networks extend it.

Failures reveal hidden dependencies.

For the next modules, we will begin opening the boxes.

Module 2 starts inside the machine: CPU, instructions, registers, caches, RAM, storage, and buses.
