# Lesson 31 — Introduction to Distributed Systems

**Course:** System Design — From the Ground Up  
**Module 7 — Distributed Systems**

## Learning Objectives
- Define a distributed system.
- Identify network and partial-failure challenges.
- Explain why retries and timeouts need deliberate design.

## Core Concept
A distributed system consists of components communicating across a network. Components can fail independently, messages can be delayed or lost, and one node may be reachable from one place but not another. There is no single shared memory or perfectly reliable global clock.

## Worked Example
An order service calls a payment service. The payment service charges the card, but its response is lost. The order service cannot safely assume the charge failed. It should use a bounded timeout and a payment operation identifier so it can check or retry without creating a duplicate charge.

## Common Pitfall
Assuming a timeout proves that the remote operation did not happen. A timeout only means the caller did not receive a response in time.

## Knowledge Check
1. What is a partial failure?
   - **Answer:** One component or communication path fails while other parts of the system continue working.
2. Why should retries be bounded?
   - **Answer:** Unbounded retries can amplify overload and keep failing work alive indefinitely.

## Practice Hint
For a client-service-database diagram, mark what happens if each network link or component becomes slow or unavailable.

## Self-Check
Can you distinguish “the request failed” from “the outcome is unknown,” and explain why timeouts matter?

## Next Lesson

Lesson 32
