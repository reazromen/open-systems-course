# Lesson 01 — What Is System Design? | System Design Fundamentals

**Course:** System Design — From the Ground Up  
**Module 1:** System Design Fundamentals  
**Learning goal:** Understand what system design means, why it matters, and how to approach a real system.

## Learning Objectives

By the end of this lesson, you should be able to:
- Explain system design through components, data flow, interfaces, and constraints.
- Choose a simple architecture that meets requirements without unnecessary complexity.
- Describe at least one design trade-off.

## Video Script

Welcome to this System Design course. We will start from the fundamentals and gradually learn how to plan software systems, how their components communicate, and how to keep them reliable as usage grows or parts fail.

First, what exactly is **system design**?

Imagine you want to build an online bookstore. Customers should be able to search for books, view details, add books to a cart, place orders, and pay. Is a good-looking web page enough to build the whole store? Not quite. Behind the interface, you need a way to receive requests, store book information, record orders, communicate with a payment provider, and decide what happens when something fails.

System design is the process of deciding what parts a system needs, how those parts communicate, where data lives, how much traffic the system should handle, and how it should continue operating when a component fails.

We can examine a system from several perspectives. **Components** are its building blocks, such as a client, application server, and database. **Data flow** describes how information moves between them. **Interfaces** define how one component requests work from another. **Constraints** are the limits we must work within, including budget, time, hardware, security requirements, and expected user traffic.

System design does not mean starting with lots of servers, Kubernetes, or microservices. A small application may work perfectly well with one server and one database. Unnecessary complexity increases cost and operational risk. Good design means choosing an appropriate solution for the actual requirements.

Another important concept is the **trade-off**. Design decisions often improve one quality while making another harder to achieve. Keeping multiple copies of data can help a service survive a server failure, but keeping those copies consistent is more complicated. Caching can make responses faster, but it may cause users to see outdated information. Learning system design means understanding these trade-offs—not simply memorizing technology names.

Here is a practical way to begin designing a system:

1. Understand what users need to do.
2. List the core requirements and constraints.
3. Identify the major components.
4. Sketch the request and data flows.
5. Decide how data should be stored.
6. Consider traffic, failure, security, and cost.
7. Test the design and improve it.

You do not need to know every answer at the beginning. It is more important to distinguish what you know, what you are assuming, and what still needs investigation.

## Worked example: a small online bookstore

Start with three core needs: list books, place orders, and record payments. A first design could use a web or mobile client, one application server, one relational database, and an external payment provider. Draw arrows from client to server, server to database, and server to payment provider. Before adding a cache or separate microservices, ask whether a measured requirement justifies the added complexity.

## Check Your Understanding

**1. A team adds five microservices before measuring traffic. What is the main design risk?**

<details>
<summary>Answer and explanation</summary>

It adds operational and communication complexity without evidence that the requirements need it. Start with the simplest design that meets known constraints, then evolve it when evidence shows a limitation.

</details>

**2. Why might caching book details create a trade-off?**

<details>
<summary>Answer and explanation</summary>

It can reduce response time and database load, but cached details may be stale. The design needs an acceptable freshness policy and a way to update or expire entries.

</details>

## Common Pitfall

System design is not a contest to use the most technologies. A design is only good relative to requirements, constraints, and failure expectations.

### Key Takeaways

System design is the planning of a software system's components, communication, data, constraints, and failure handling. The goal is not to build the most complicated architecture. The goal is to build a solution that is simple, secure, reliable, and maintainable while meeting its requirements.

### Practice Exercise

List at least four major components for an online bookstore. Explain the responsibility of each component in one sentence.

### Practice Hint and Self-Check

**Hint:** Try Client, Application Server, Database, and Payment Provider. For each one, write its responsibility and show at least one interaction.

**Self-check:** Your answer names at least four components, gives each one a distinct responsibility, and shows at least one interaction between components.

### Next Lesson

Lesson 02 — How Does a Software System Work?
