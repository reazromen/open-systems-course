# Lesson 18 — Monoliths and Application Architecture

**Course:** System Design — From the Ground Up  
**Module 4 — Core Architecture Components**

## Lesson Overview

An application's architecture defines how responsibilities are organized and how components interact. A monolith is one deployment unit, but it can still have a clean internal structure.

## What Is a Monolith?

In a monolithic application, major capabilities are packaged and deployed together. A bookstore may contain account, catalog, cart, order, and administration modules in one application. This can make local development, transactions, and deployment simpler, especially for a small team and a new product.

## Modular Boundaries Still Matter

A monolith does not have to be a tangled codebase. Modules should own clear responsibilities and expose deliberate interfaces. Avoid allowing every module to read or modify every other module's internal data structures. Clear boundaries make testing, maintenance, and future extraction easier.

## Where Monoliths Become Difficult

As the product grows, a single deployment can make independent scaling, releases, or fault isolation harder. A defect or resource-intensive task may affect the whole application. These are possibilities, not automatic outcomes; good modularity, profiling, and operational practices can keep a monolith effective for a long time.

## Do Not Split Prematurely

Microservices add network failures, distributed tracing, deployment coordination, data ownership questions, and more operational overhead. Begin with the simplest architecture that meets current requirements. Split a module into a service when independent scaling, ownership, release cadence, or isolation provides a measurable benefit.

## Learning Objectives

- Define a monolith by its deployment boundary, not by code quality.
- Describe modular boundaries and the trade-offs between a monolith and distributed services.

## Worked Example

A bookstore can deploy one application containing catalog, inventory, orders, and accounts modules. Clear internal interfaces let the team start simply while preserving boundaries that could later be extracted if evidence justifies it.

## Check Your Understanding

1. **Does a monolith have to be poorly structured?**

   No. A modular monolith can have strong boundaries and maintainable internal design.

2. **What do microservices add along with independent deployment?**

   Network failure modes, distributed observability, deployment coordination, and operational overhead.

## Common Pitfall

Splitting into microservices before the team has clear domain boundaries or a need for independent scaling and releases.

## Key Takeaways

A monolith can be a sound starting architecture. Keep modules well-bounded, measure real constraints, and avoid distributing a system before the benefits justify the cost.

## Practice Exercise

Sketch a bookstore monolith with four internal modules. State one boundary rule that would prevent the codebase from becoming tightly coupled.


### Practice Hint

Draw the modules and their allowed dependencies first; then identify a specific requirement that a separate deployment would solve.

### Self-Check

Can you name the benefits and costs of keeping these modules in one deployable unit?
## Next Lesson

Lesson 19 — Application Servers and Reverse Proxies
