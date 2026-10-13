---
title: "Information: What Computers Actually Manipulate"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-002-information-what-computers-manipulate.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "A computer does not store meaning directly. It stores physical representations that software interprets as numbers, text, images, instructions, identities, measurements, and much more."
eyebrow: "Open Systems Course · Lesson 2 of 180"
---

A photograph, a bank balance, a song, a program, and the word **hello** can all live inside a computer. That sounds almost magical until we ask a smaller question:

**What is actually stored?**

Not the smell of the room in the photograph. Not the feeling produced by the song. Not the social meaning of the bank balance. A computer stores and transforms representations.

That distinction is the beginning of a useful theory of information for engineers.

## A bit is a distinction

NIST defines a bit as a binary digit with value 0 or 1. Eight bits form a byte in the common definition used by modern computing standards.

But do not imagine a bit as a microscopic printed zero or one.

A physical device must implement two distinguishable conditions that we agree to interpret as 0 and 1. In one context that distinction may be represented by voltage ranges. In another it may be represented by stored electrical charge, magnetic orientation, or another physical state.

The symbol is abstract. The implementation is physical.

This is a pattern we will see throughout computing:

~~~text
meaning
  ↓ interpreted through
representation
  ↓ implemented by
physical state
~~~

Those three layers should not be confused.

## The same bits can mean different things

Consider this byte:

~~~text
01000001
~~~

As an unsigned binary integer it represents 65.

Under ASCII, the numeric code 65 represents the uppercase letter A.

The same eight bits could also be part of a pixel value, a machine instruction, a compressed file, an encrypted message, or a network packet.

The bits did not announce what they meant.

**Context supplied the interpretation.**

This matters enormously in debugging. When a program reads the right bytes using the wrong interpretation, the hardware may be functioning perfectly while the result is nonsense.

A file format is therefore not just data. It is an agreement about how sequences of bytes should be interpreted.

A network protocol performs a similar job across machines.

A data structure performs a similar job inside software.

## Information is not the same thing as meaning

Claude Shannon's 1948 paper on communication theory deliberately separates the engineering problem of transmitting messages from their semantic meaning. That move is easy to misunderstand.

It does not say meaning is unimportant.

It says that one useful engineering problem can be studied without first solving the problem of meaning.

Suppose I transmit one of four possible symbols:

~~~text
A
B
C
D
~~~

A communication system can be evaluated on whether the receiver can distinguish which symbol was sent.

It does not need to know whether A means "open the valve," "I love you," or "the experiment failed."

This separation is powerful because it lets engineers reason about channels, errors, coding, capacity, and uncertainty without pretending that transmission theory is also a theory of human interpretation.

Throughout this course we will protect that boundary.

## Data is useful only when a system knows how to interpret it

Imagine a sensor transmits these two bytes:

~~~text
00000001 00101100
~~~

Together they could represent the integer 300.

But several questions remain:

- Is the value signed or unsigned?
- What byte order is being used?
- Is 300 the actual measurement or a scaled value?
- Is the unit Celsius, millivolts, pascals, millimeters, or something else?
- Is there a calibration offset?
- Is the value valid?
- When was it measured?

A number without metadata can be precise and still be useless.

Suppose a temperature sensor sends 3000.

Maybe that means 30.00 °C because the device uses hundredths of a degree.

Maybe it means an ADC count.

Maybe it is a raw resistance measurement.

Maybe it is an error code.

The computer can store the bits perfectly while the application misunderstands the world.

This is why engineering systems need schemas, units, timestamps, versioning, and contracts.

## Representation creates limits

If a field contains eight unsigned bits, it can represent 256 different bit patterns:

~~~text
00000000
...
11111111
~~~

If those patterns are interpreted as consecutive unsigned integers, the range is 0 through 255.

That is not a limitation of mathematics. It is a limitation of the chosen representation.

With more bits, more distinct patterns become available.

But more bits are not automatically better.

More bits may require more memory, more bandwidth, more storage, or more processing. In embedded systems those costs can matter. In network protocols a few bytes repeated millions of times can matter. In large models or databases representation choices can affect both cost and performance.

Engineering is full of decisions about how much information needs to be represented and at what precision.

## Compression is possible because representation contains structure

Suppose a file contains:

~~~text
AAAAAAAAAAAAAAAAAAAA
~~~

Writing twenty copies of A is one representation.

Another possible representation is something like:

~~~text
20 × A
~~~

The second description can be shorter because the original sequence contains repetition.

Real compression algorithms are more sophisticated, but the principle is important: **structure and predictability can make a representation compressible.**

Lossless compression allows the original data to be reconstructed exactly.

Lossy compression deliberately discards some information according to a model of what can be removed while still meeting a goal. JPEG images and many audio codecs use forms of lossy compression.

The word "lossy" should therefore trigger a systems question:

> Which information was discarded, according to which assumptions, and does the remaining representation still satisfy the application?

A tiny image thumbnail may be excellent for a contact list and unacceptable for medical imaging.

The technology did not change. The requirement did.

## Text is not characters stored directly in memory

When you see the word Hello, the computer needs an encoding that maps characters to numerical values and then to bytes.

Unicode defines a large character repertoire and code points. Encodings such as UTF-8 define how those code points are represented as sequences of bytes.

This is why text bugs can appear even when all the bytes arrived successfully. Sender and receiver may disagree about the encoding or interpret byte sequences incorrectly.

The same principle applies to images, audio, video, and structured documents.

For an image, software needs to know dimensions, pixel organization, color representation, compression format, and often metadata.

For audio, software needs sample format, sample rate, channel arrangement, and codec information.

A stream of bytes becomes meaningful only through an agreed interpretation.

## Instructions are information too

One of the most important ideas in general-purpose computing is that instructions can themselves be represented as data.

A compiled program is ultimately stored as a sequence of bytes. Some of those bytes encode machine instructions understood by a processor architecture. Other bytes represent constants, metadata, or other program data.

This is why a storage device can contain both:

~~~text
photo.jpg
program
database
configuration
~~~

All are encoded information.

Their differences emerge from structure, interpretation, and the software that processes them.

That observation prepares us for a later idea: **a computer can manipulate descriptions of processes using the same storage mechanisms it uses for ordinary data.**

That is one reason software is so flexible.

## Information crosses boundaries

Now imagine an ESP32 measuring temperature and sending it to a server.

A simplified path might be:

~~~text
physical temperature
        ↓
sensor response
        ↓
electrical signal
        ↓
digital measurement
        ↓
number in memory
        ↓
serialized message
        ↓
network packets
        ↓
server bytes
        ↓
database field
        ↓
dashboard pixels
~~~

At every arrow, information is represented differently.

The dashboard is not "seeing the temperature."

It is seeing the final result of a chain of measurements, conversions, encodings, transmissions, storage operations, queries, and rendering steps.

This is why a dashboard value should never be treated as magical truth.

When it looks wrong, trace the representation backwards.

## Errors can preserve syntax while destroying truth

Imagine a sensor value of 31.2 °C.

The message reaches the server correctly.

The server stores it correctly.

The API returns it correctly.

The dashboard renders it correctly.

But the sensor was mounted beside a heat source.

Every digital layer behaved perfectly.

The measurement was still a poor representation of the quantity the user thought they were seeing.

This is a crucial engineering lesson:

> data integrity and measurement validity are different problems.

A checksum can help detect transmission errors. It cannot prove the sensor was installed in the right place.

Encryption can protect confidentiality. It cannot prove the value is physically meaningful.

A database constraint can preserve a schema. It cannot prove the source measured what you intended.

Accuracy depends on the entire evidence chain.

## Try it yourself: one value, five interpretations

Take the number 65.

Now describe five possible interpretations:

1. the integer sixty-five;
2. an ASCII code for A;
3. a percentage;
4. a temperature reading;
5. a byte inside a compressed image.

Notice that the stored value alone does not select among those interpretations.

Now add metadata:

~~~json
{
  "value": 65,
  "unit": "percent",
  "source": "battery_monitor"
}
~~~

The representation has become richer.

But even now, you can ask additional questions:

- what does 65% mean for this battery chemistry?
- how was it estimated?
- how old is the reading?
- has the monitor been calibrated?
- what happens when the source becomes unavailable?

Those questions are not outside computing. They are part of building systems that people can trust.

## The lesson to carry forward

Computers manipulate representations.

Bits provide discrete symbols. Bytes group bits. Encodings give structure to byte sequences. Protocols and file formats establish shared interpretation. Programs transform representations. Sensors connect physical phenomena to digital values. Displays transform digital state back into signals people can perceive.

Meaning enters through context.

That single idea explains an enormous number of software bugs, protocol failures, data-quality problems, encoding errors, and misleading dashboards.

When you encounter data in the rest of this course, ask:

> What exactly is represented here, and what assumptions are required to interpret it?

That question is more useful than memorizing that computers "use zeros and ones."
