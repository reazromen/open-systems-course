---
title: "Stacks: Last In, First Out"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-043-stacks-last-in-first-out.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 9
excerpt: "A stack is useful when the most recently added item is the next one needed. Function calls, parsing, undo histories, and depth-first search all exploit this ordering."
eyebrow: "Open Systems Course · Lesson 43 of 180"
---

Put three plates on a pile:

    A
    B on A
    C on B

Which plate is easiest to remove?

C.

Last in, first out.

That ordering defines a stack.

## Two essential operations

Push:

    add item to top

Pop:

    remove item from top

Peek:

    inspect top without removing

A stack does not promise efficient arbitrary access to item 500.

Its interface matches one ordering policy.

That limited interface is its strength.

## Function calls form a natural stack

Function A calls B.

B calls C.

C returns to B.

B returns to A.

The most recent unfinished call resumes first.

Execution stacks store call-related state consistent with this nesting.

This is why recursion fits stack behaviour naturally.

Too much nesting can exhaust finite stack space.

The data-structure idea becomes a runtime resource.

## Parsing uses stacks for nesting

Expression:

    (a + (b * c))

Nested parentheses create scopes that close in reverse order.

Push opening structures.

Pop when closing.

Compilers and interpreters use stack-like techniques for expressions, syntax, and execution.

The pattern is:

Most recent unfinished context needs attention next.

## Undo can be modeled as a stack

Actions:

    type A
    type B
    delete C

Undo should first reverse delete C.

Then type B.

Then type A.

A stack fits.

Redo can use another stack.

Real editors have richer histories, but the simple model exposes why ordering matters.

## A stack can be implemented several ways

Use dynamic array with append/pop at one end.

Use linked nodes.

Use fixed array plus top index.

Same abstract data structure.

Different implementation trade-offs.

This distinction is important:

Data structure = behavioural interface and invariants.

Implementation = representation used to achieve it.

## Stack and queue answer different questions

Stack:

Which most recent item should I handle?

Queue:

Which oldest waiting item should I handle?

Choosing one changes system behaviour.

A job scheduler using a stack could starve older work under constant arrivals.

Ordering policy is part of product semantics.

## Exercise: balanced parentheses

Input:

    (()())

Scan left to right.

Push on open parenthesis.

Pop on close.

If close arrives with empty stack, invalid.

At end, stack must be empty.

This tiny algorithm demonstrates a stack matching nested structure.

## The lesson to carry forward

A stack is not important because interview questions ask about it.

It is important because last-in-first-out order appears naturally in nested execution and reversible context.

Whenever the newest unfinished thing should be handled first, a stack deserves consideration.
