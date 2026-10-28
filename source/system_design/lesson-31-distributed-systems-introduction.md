# Lesson 31 — What Is a Distributed System?

**Course:** System Design — From the Ground Up  
**Module 6 — Distributed Systems**

## Lesson Overview

A distributed system consists of multiple computers or processes that communicate over a network to provide a service. Distribution can improve scale and fault isolation, but it also introduces delays, partial failures, and coordination problems.

## More Than One Machine

A web application may use separate services for requests, data, queues, and file storage. Each component runs independently and communicates through network protocols. The user sees one product, but a single action can depend on several machines and services.

## Partial Failure

In a single process, a function call usually either returns or fails within that process. Across a network, a request may time out because the remote service is slow, the response was lost, or the service failed after receiving the request. The caller may not know whether the operation happened.

## Time and Coordination

Machines have different clocks, and network messages can be delayed or reordered. A timestamp alone may not prove which event happened first. Distributed designs use explicit identifiers, ordering rules, acknowledgments, and coordination protocols where needed.

## Trade-offs Are Fundamental

Distribution can enable independent scaling and geographic availability, but every network boundary creates latency and failure modes. Prefer a simple design until a requirement justifies distribution, and make failure behavior part of the architecture rather than an afterthought.

## Key Takeaways

Distributed systems communicate over networks, where latency and partial failures are normal. Design explicit timeouts, failure handling, and coordination rules.

## Practice Exercise

A checkout request times out after the payment service receives it. Why can the caller not safely assume the payment failed, and what should the system do next?

## Next Lesson

Lesson 32 — Message Queues and Event-Driven Architecture
