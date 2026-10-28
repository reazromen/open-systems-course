# Lesson 01 — What Is System Design? | System Design Fundamentals

**Course:** System Design — From the Ground Up  
**Module 1:** System Design Fundamentals  
**Learning goal:** Understand what system design means, why it matters, and how to approach a real system.

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

### Key Takeaways

System design is the planning of a software system's components, communication, data, constraints, and failure handling. The goal is not to build the most complicated architecture. The goal is to build a solution that is simple, secure, reliable, and maintainable while meeting its requirements.

### Practice Exercise

List at least four major components for an online bookstore. Explain the responsibility of each component in one sentence.

### Next Lesson

Lesson 02 — How Does a Software System Work?
