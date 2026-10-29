---
title: "Why Functions Exist"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-035-why-functions-exist.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 11
excerpt: "Functions create reusable boundaries around behaviour. Their real value is not fewer lines of code but named contracts, controlled inputs and outputs, and smaller units of reasoning."
eyebrow: "Open Systems Course · Lesson 35 of 180"
---

You validate a temperature reading in twelve places.

The rule changes.

Now twelve pieces of code must change correctly.

This is the problem that gives functions value.

A function creates a named boundary around behaviour.

## A function has a contract

Consider:

    normalize_temperature(raw_value)

That name is not enough.

What unit is raw_value?

What range is valid?

What does the function return?

Can it fail?

Does it modify external state?

A useful function contract answers these questions.

The body implements the contract.

The caller should not need to understand every internal step.

This is abstraction in program form.

## Inputs reduce hidden dependencies

Compare:

    calculate_total()

which reads five globals, with:

    calculate_total(items, tax_rate)

The second form exposes more dependencies.

That makes the behaviour easier to test and reason about.

Not every function must be pure.

Some need files, databases, devices, or clocks.

The architectural principle is to make important dependencies visible.

Hidden state creates hidden coupling.

## Return values make output explicit

A function can transform input:

    celsius_to_fahrenheit(c)

The result is output.

A function can also produce side effects:

    save_record(record)

Now the output may be a changed database rather than only a returned value.

Side effects are not bad.

They simply create more system boundaries and failure modes.

A good interface makes them clear.

## Functions reduce duplicated policy

Suppose every call site performs:

    if retries < 3:
        wait
        retry

You have duplicated retry policy.

A reusable function can centralize it.

Now one change updates the rule.

But centralization is valuable only when the situations truly share the same policy.

Forcing unrelated behaviour into one giant function creates coupling rather than reuse.

## Small is not automatically good

A function containing one line can improve naming.

Or it can hide a trivial operation behind needless indirection.

A function containing 500 lines can express one cohesive state machine.

Or it can mix ten responsibilities.

Line count is a weak design metric.

Ask:

Does this boundary represent one understandable responsibility?

## Function calls have runtime mechanics

At the source level:

    result = add(a, b)

At machine level, a calling convention coordinates arguments, registers, stack state, return addresses, and result placement.

A compiler may inline a function and eliminate the call entirely when semantics allow.

So the source abstraction does not require one literal runtime call.

Again, programming-language structure and machine execution are connected but not identical.

## Recursion turns functions into their own callers

A function can call itself with a smaller subproblem.

Each active call needs execution state.

A stack naturally represents nested calls.

But deep recursion can exhaust stack limits.

An elegant recursive definition is therefore also a resource decision.

Algorithms and runtime architecture meet.

## Testability reveals good boundaries

Suppose a function calculates:

    should_alert(reading, threshold, now)

You can test it with controlled values.

Suppose instead it:

- reads the sensor;
- fetches threshold from database;
- checks wall clock;
- sends SMS;
- writes logs;
- updates dashboard.

Testing one decision now requires many systems.

Separating pure decision logic from I/O can make the architecture easier to verify.

Functions are therefore a design tool, not only a reuse mechanism.

## Exercise: extract the rule

Start with:

    if reading.valid and reading.level > threshold:
        send_alert()

Turn the decision into:

    should_alert(reading, threshold)

Now define the contract:

Input:

- reading value;
- validity;
- threshold.

Output:

- true or false.

Then keep actual alert delivery outside.

You have separated policy from side effect.

That distinction scales to large systems.

## The lesson to carry forward

Functions exist because programs need named boundaries around behaviour.

A good function controls complexity by making inputs, outputs, responsibilities, and failure rules understandable.

The syntax of def, function, fn, or another language keyword is secondary.

The engineering question is:

**What behaviour deserves a boundary and a contract?**
