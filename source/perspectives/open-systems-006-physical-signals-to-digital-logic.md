---
title: "From Physical Signals to Digital Logic"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-006-physical-signals-to-digital-logic.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 13
excerpt: "Digital logic is built from physical signals. The trick is not that voltage becomes magically binary, but that circuits interpret ranges robustly as discrete symbols."
eyebrow: "Open Systems Course · Lesson 6 of 180"
---

"Computers use zeros and ones" is true in the same way that "books use letters" is true.

It describes a representation, not the complete physical mechanism.

Inside real electronic systems, voltages and currents vary continuously. Transistors respond to physical electrical conditions. Timing is finite. Noise exists. Yet digital logic lets engineers reason with discrete states such as 0 and 1.

How?

By creating an abstraction boundary.

MIT's Computation Structures material introduces exactly this move: concrete encoding of information, analog signaling, using voltages digitally, and then combinational devices.

## A wire does not contain a philosophical zero

Imagine a digital input pin.

The physical quantity at the pin may be a voltage such as 0.03 V, 0.17 V, 1.42 V, or 3.26 V.

The voltage is not itself zero or one.

The receiving circuit interprets ranges of voltage according to its electrical specification.

A simplified imaginary system might say:

    0.0 V to 0.8 V  -> LOW
    2.0 V to 3.3 V  -> HIGH

What about 1.4 V?

In this invented example, it lies between the guaranteed ranges. We should not pretend the receiver is required to interpret it as a stable logical value.

Real logic families and devices define their own input and output thresholds. Always use the relevant datasheet rather than copying these invented numbers into a circuit design.

The important principle is:

Continuous physical values can be mapped onto discrete logical categories.

## Why ranges matter

Suppose a transmitter produced exactly 3.300000 V to represent HIGH and a receiver accepted only exactly 3.300000 V.

The system would be extremely fragile.

Real circuits need tolerance for noise, component variation, temperature, supply variation, and signal degradation.

So digital interfaces are designed around regions.

The transmitter is expected to produce outputs within certain guarantees. The receiver is expected to recognize corresponding input ranges. The gap between those guarantees can provide noise margin.

This is one reason digital systems are robust: they often care about which region a signal belongs to rather than reproducing an exact analog value.

That does not make them immune to analog physics.

It makes the abstraction useful within specified conditions.

## A transistor is not binary in the everyday sense

Transistors are physical devices whose behaviour depends on voltages, geometry, materials, temperature, and other conditions.

Digital circuit design uses them to build structures that implement logical behaviour.

At a higher level, we may describe an AND gate:

    A  B | AND
    0  0 |  0
    0  1 |  0
    1  0 |  0
    1  1 |  1

That truth table is an abstraction.

It says what logical relationship we expect.

It does not describe transistor dimensions, propagation delay, current consumption, switching thresholds, or signal integrity.

This is enormously valuable.

A designer can combine gates into larger logical functions without reopening device physics for every operation.

## Logic is about relationships between symbols

Consider NOT:

    0 -> 1
    1 -> 0

AND:

    0 AND 0 -> 0
    0 AND 1 -> 0
    1 AND 0 -> 0
    1 AND 1 -> 1

OR:

    0 OR 0 -> 0
    0 OR 1 -> 1
    1 OR 0 -> 1
    1 OR 1 -> 1

From simple logical relationships, much larger digital functions can be built.

But do not jump from truth tables to "therefore a modern CPU is simple."

Scale changes the engineering problem.

Real systems must deal with timing, fan-out, power, clock distribution, memory, synchronization, interconnect, fabrication constraints, and enormous numbers of devices.

The abstraction helps us build upward without claiming the lower-level problem disappeared.

## Timing is part of the physical reality

A logic gate does not respond infinitely fast.

An input changes.

Some finite time later, the output settles.

This propagation delay matters.

Imagine two paths through a circuit:

    input -> gate -> output

and:

    input -> gate -> gate -> gate -> output

The paths may settle at different times.

If another part of the system samples the outputs at the wrong moment, transient values can matter.

Later, when we study clocks and sequential logic, we will see how systems create timing discipline around changing signals.

For now, remember:

Logical correctness and timing correctness are separate requirements.

A Boolean equation may be right while a physical implementation fails at a chosen clock speed.

## Digital does not mean there are only two voltages

Another common misconception is that digital electronics contains only two physical voltage values.

No.

The physical signals vary continuously.

The interpretation is discrete.

This distinction also explains why oscilloscopes are useful when debugging digital systems. A logic analyzer may show a clean sequence of zeros and ones because it applies thresholds. An oscilloscope can reveal ringing, slow edges, overshoot, noise, or voltage levels that make those logical decisions unreliable.

Both instruments are observing the same physical system through different abstractions.

## Where does software enter?

A CPU instruction such as an integer addition eventually causes physical circuits to switch.

But software engineers normally do not reason directly from a Python expression to transistor transitions.

They use intermediate abstractions:

    source code
      -> language or runtime
      -> machine instructions
      -> processor datapath and control
      -> digital logic
      -> transistors
      -> electrical behaviour

Each layer gives us a vocabulary appropriate to a different problem.

A bug in an algorithm is usually solved near the software layer.

A timing failure in a high-speed digital interface may require going much lower.

The ability to move between layers is more valuable than pretending one layer explains everything.

## An embedded example: reading a button

Consider a button connected to an ESP32-class microcontroller.

At the physical layer, switch position changes a circuit.

At the electrical layer, pin voltage changes.

At the digital input layer, voltage is interpreted as LOW or HIGH.

At the register layer, input state becomes visible to the processor.

At the firmware layer, the program might represent that state as:

    pressed = true

At the application layer, that may trigger an action such as starting a call.

A learner who sees only the final function call misses most of the system.

A learner who sees only transistor physics also misses why the system exists.

We need both directions.

## Exercise: find the abstraction boundary

Take a digital GPIO input.

Draw two columns.

Physical observations:

- voltage;
- rise time;
- noise;
- timing.

Logical observations:

- LOW;
- HIGH;
- transition;
- sampled value.

Now ask:

1. What rule maps the left column into the right?
2. Where is that rule specified?
3. What happens when the physical signal violates the assumptions?

Do not guess the voltage thresholds for a real board. Look them up in the device datasheet when you do a real design.

That habit, moving from generic concept to device-specific evidence, is part of engineering accuracy.

## The lesson to carry forward

Digital logic is powerful because it lets us build discrete reasoning on top of continuous physical systems.

The useful statement is not "electricity becomes binary."

It is:

Circuits are designed so that physical signal ranges can be interpreted as stable logical symbols under specified conditions.

Once we have those symbols, we can build gates.

From gates, storage.

From storage and combinational logic, state machines.

From state machines and datapaths, processors.

From processors and memory, programmable computers.

The abstraction is astonishing enough without turning it into magic.
